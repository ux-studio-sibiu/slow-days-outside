import Image from "next/image";
import Link from "next/link";
import type { EventType } from "@/types";
import { dayKey } from "@/app/components/calendar/day-key";
import "./upcoming-events.scss";

// Upcoming-event teasers, shared by the home page and the /calendar index. Each
// links to that day's detail page (/calendar/[date]).
export default function UpcomingEvents({
  events,
  limit = 5,
}: {
  events: EventType[];
  limit?: number;
}) {
  const now = Date.now();
  const upcoming = events
    .filter((e) => e.date && new Date(e.date).getTime() >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit);

  if (upcoming.length === 0) return null;

  return (
    <div className="nsc-upcoming-events">
  
      <ul className="upcoming-list">
        {upcoming.map((event) => {
          const d = new Date(event.date);
          const cover = event.photos?.[0];
          return (
            <li key={event._id}>
              <Link href={`/calendar/${dayKey(d)}`} className="upcoming-teaser">
                <span className="upcoming-teaser-date">
                  <span className="upcoming-teaser-day">{d.toLocaleDateString("ro-RO", { day: "2-digit" })}</span>
                  <span className="upcoming-teaser-month">{d.toLocaleDateString("ro-RO", { month: "short" })}</span>
                </span>
                <span className="upcoming-teaser-body">
                  <span className="upcoming-teaser-title">{event.title}</span>
                  {event.meetPoint && <span className="upcoming-teaser-meta">{event.meetPoint}</span>}
                </span>
                <span className="upcoming-teaser-thumb">
                  <span className="upcoming-teaser-border">
                    {cover?.url ? (
                      <Image src={cover.url} alt={event.title} fill sizes="130px" className="object-cover" placeholder={cover.lqip ? "blur" : undefined} blurDataURL={cover.lqip} />
                    ) : (
                      <img src="/images/sun-3.svg" alt="" className="upcoming-teaser-placeholder" />
                    )}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
