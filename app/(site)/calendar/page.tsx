import { getEvents } from "@/sanity/sanity.query";
import UpcomingEvents from "@/app/components/upcoming-events/upcoming-events";
import "./calendar.scss";

export const revalidate = 60; // seconds

export default async function CalendarIndexPage() {
  const events = await getEvents();

  return (
    <div id="nsc--calendar" className="has-splatter-bg has-watermark-bg" style={{ "--watermark-number": '"2026"', "--watermark-opacity": "0.08" } as React.CSSProperties}>
      <div className="calendar-inner">
        <p className="calendar-hint">
          Selectează o zi marcată din calendar pentru a vedea evenimentul.
        </p>

        <UpcomingEvents events={events} />
      </div>
    </div>
  );
}
