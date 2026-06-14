import { getEvents } from "@/sanity/sanity.query";
import CalendarSplit from "@/app/components/calendar/calendar-split";
import SplatterBackdrop from "@/app/components/splatter-backdrop/splatter-backdrop";
import "./calendar.scss";

export const revalidate = 60; // seconds

export default async function CalendarPage() {
  const events = await getEvents();

  // Open the calendar on the month of the soonest upcoming event (falling back
  // to the most recent past event, then to the current month) so visitors land
  // on a month that actually has something on it.
  const now = Date.now();
  const upcoming = events
    .filter((e) => new Date(e.date).getTime() >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  const mostRecent = events
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const focus = upcoming ?? mostRecent;
  const focusDate = focus ? new Date(focus.date) : new Date();

  return (
    <main id="nsc--calendar">
      <SplatterBackdrop as="section" className="calendar-backdrop">
        <div className="calendar-inner">
          {/* <h1 className="calendar-title">Calendar</h1> */}

          {events.length === 0 ? (
            <p className="calendar-empty">Niciun eveniment programat.</p>
          ) : (
            <CalendarSplit
              events={events}
              month={focusDate.getMonth()}
              year={focusDate.getFullYear()}
            />
          )}
        </div>
      </SplatterBackdrop>
    </main>
  );
}
