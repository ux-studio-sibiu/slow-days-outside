import { getEvents } from "@/sanity/sanity.query";
import UpcomingEvents from "@/app/components/upcoming-events/upcoming-events";
import { DecorLayer, DecorItem } from "@/app/components/decor-layer/decor-layer";
import "./calendar.scss";
import { SvgItem } from "@/app/components/decor-layer/svg-item";

export const revalidate = 60; // seconds

export default async function CalendarIndexPage() {
  const events = await getEvents();

  return (
    <div id="nsc--calendar">

       <DecorLayer color="rgba(0,0,0,0.1)" >
        <SvgItem src="/images/foliage-3.svg" right="4%" top="61%" width="23rem" rotate={-8} flipX />
        <SvgItem src="/images/foliage-5.svg" left="-12%" top="3%" width="23rem" rotate={10} />
        <SvgItem src="/images/butterfly-1.svg" left="4%" top="48%" width="12rem" rotate={355} />
        <SvgItem src="/images/butterfly-3.svg" right="9%" top="44%" width="8rem" rotate={-10} flipX />
        <SvgItem src="/images/sun-3.svg" right="-12%" top="-17%" width="26rem" rotate={-5} />
      </DecorLayer>


      <div className="calendar-inner">
        <p className="calendar-hint">
          Selectează o zi marcată din calendar pentru a vedea evenimentul.
        </p>

        <UpcomingEvents events={events} />
      </div>
    </div>
  );
}
