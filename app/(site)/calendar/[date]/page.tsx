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
      <DecorLayer color="rgba(0,0,0,0.1)">
        <SvgItem src="/images/sun-1.svg" right="-12%" top="-17%" width="26rem" rotate={-5} />
        <SvgItem src="/images/vines-4.svg" left="2%" top="10%" width="14rem" rotate={12} />
        <SvgItem src="/images/more-leaves-6.svg" right="3%" top="72%" width="11rem" rotate={-20} flipX />
        <SvgItem src="/images/leaves-3.svg" left="6%" top="78%" width="10rem" rotate={15} />
        <SvgItem src="/images/more-leaves-11.svg" right="5%" top="18%" width="12rem" rotate={8} />
      </DecorLayer>
      <div className="calendar-inner">
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
