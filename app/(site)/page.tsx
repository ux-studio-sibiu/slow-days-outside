import { getEvents } from "@/sanity/sanity.query";
import UpcomingEvents from "@/app/components/upcoming-events/upcoming-events";
import "./page.scss";

export const revalidate = 60; // seconds

export default async function Home() {
  const events = await getEvents();

  return (
    <div id="nsc--home" className="has-splatter-bg has-watermark-bg" style={{ "--watermark-number": '"2026"', "--watermark-opacity": "0.08" } as React.CSSProperties}>
      <div className="home-inner">
        <header className="home-header">
          <p className="home-header-label">Slow Days Outside · Program</p>
          <h1 className="home-header-title">Evenimente următoare</h1>
          <p className="home-header-desc">Alege un eveniment din listă pentru detalii și însciere.</p>
        </header>

        <section className="home-events">
          {events.length === 0 ? (
            <p className="home-events-empty">
              Niciun eveniment momentan. Reveniți în curând.
            </p>
          ) : (
            <UpcomingEvents events={events} />
          )}
        </section>
      </div>
    </div>
  );
}
