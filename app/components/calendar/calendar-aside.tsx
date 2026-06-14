import { getEvents } from "@/sanity/sanity.query";
import CalendarNav from "./calendar-nav";
import "./calendar-aside.scss";

// Calendar overlay for /calendar routes. The hero image lives in the layout
// (so it persists across navigation); this only floats the calendar card over
// it, leaving the image visible around the edges.
export default async function CalendarAside() {
  const events = await getEvents();

  return (
    <div className="nsc-calendar-overlay">
      <CalendarNav events={events} />
    </div>
  );
}
