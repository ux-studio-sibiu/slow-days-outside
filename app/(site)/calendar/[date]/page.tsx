import Image from "next/image";
import { getEvents } from "@/sanity/sanity.query";
import { dayKey } from "@/app/components/calendar/day-key";
import EventDetail from "@/app/components/calendar/event-detail";
import { DecorLayer } from "@/app/components/decor-layer/decor-layer";
import { SvgItem } from "@/app/components/decor-layer/svg-item";
import "../calendar.scss";

export const revalidate = 60; // seconds

export default async function CalendarDatePage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const events = await getEvents();

  const dayEvents = events
    .filter((e) => e.date && dayKey(new Date(e.date)) === date)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Parse at midday to keep the heading on the intended local day regardless of
  // timezone offset.
  const heading = new Date(`${date}T12:00:00`).toLocaleDateString("ro-RO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const photos = dayEvents.flatMap((event) =>
    (event.photos ?? []).map((photo) => ({ ...photo, title: event.title })),
  );

  return (
    <div id="nsc--calendar">

      <DecorLayer color="rgba(0,0,0,0.05)">
        <SvgItem src="/images/sun-3.svg" top="-10%" right="-10%" width="20rem" />
        
        <SvgItem src="/images/more-leaves-2.svg" top="25rem" left="-4%" width="17rem" rotate={20} />

        <SvgItem src="/images/leaves-2.svg" right="-3%" top="30%" width="30%" rotate={-70} />
        <SvgItem src="/images/leaves-5.svg" left="-7%" top="50%" width="38%" rotate={20} />

        <SvgItem src="/images/butterfly-1.svg" left="4%" top="3%" width="8rem" rotate={355} />
        <SvgItem src="/images/more-birds-6.svg" left="30%" top="0%" width="8rem" rotate={355} />
        <SvgItem src="/images/butterfly-3.svg" right="9%" top="20%" width="8rem" rotate={-10} flipX />
        <SvgItem src="/images/forest-2.svg" bottom="-2rem" left="-5%" width="110%" />
        
      </DecorLayer>
      
      <div className="page-content">
        <h1 className="calendar-detail-heading">{heading}</h1>

        {dayEvents.length === 0 ? (
          <p className="calendar-empty">Niciun eveniment în această zi.</p>
        ) : (
          <ul className="calendar-events">
            {dayEvents.map((event) => (
              <EventDetail key={event._id} event={event} />
            ))}
          </ul>
        )}

        {photos.length > 0 && (
          <div className="calendar-gallery">
            <span className="calendar-gallery-label">Galerie</span>
            <div className="calendar-gallery-grid">
              {photos.map((photo, i) => (
                <div key={photo.url ?? i} className="calendar-photo">
                  <Image src={photo.url} alt={photo.title} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" placeholder={photo.lqip ? "blur" : undefined} blurDataURL={photo.lqip} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
