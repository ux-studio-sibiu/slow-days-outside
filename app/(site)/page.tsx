import Link from "next/link";
import { getEvents } from "@/sanity/sanity.query";
import UpcomingEvents from "@/app/components/upcoming-events/upcoming-events";
import { DecorLayer } from "@/app/components/decor-layer/decor-layer";
import { SvgItem } from "@/app/components/decor-layer/svg-item";
import "./page.scss";

export const revalidate = 60; // seconds

export default async function Home() {
  const events = await getEvents();

  return (
    <div id="nsc--home" className="pb-300 pt-100">

      <DecorLayer color="rgba(0,0,0,0.05)">

        <SvgItem src="/images/butterfly-4.svg" right="4%" top="2%" width="23rem" rotate={-47} />
        <SvgItem src="/images/leaves-1.svg" left="-9%" top="13%" width="30rem" rotate={12} />
        <SvgItem src="/images/forest-4.svg" left="-5%" bottom="-2rem" width="110%" />
        
      </DecorLayer>

      <div className="page-content">
        <header className="home-header">
          
          <h1 className="home-header-title">Program activităti</h1>
          <Link href="/calendar" className="btn btn-primary">Vezi calendar</Link>
        </header>

        {/* <div className="divider-leaves" aria-hidden="true">
          <img src="/images/vines-14.svg" alt="" />
        </div> */}

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

