"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { EventType } from "@/types";
import SplitView from "@/app/components/split-view/split-view";
import Calendar, { dayKey } from "./calendar";
import "./calendar-split.scss";

interface CalendarSplitProps {
  events: EventType[];
  month?: number;
  year?: number;
}

// Minimal line icons (stroke = currentColor) for each meta field.
const iconProps = {
  className: "calendar-split-meta-icon",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const META_ICONS: Record<string, React.ReactNode> = {
  // clock
  time: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  // hourglass
  duration: (
    <svg {...iconProps}>
      <path d="M7 3h10M7 21h10M9 3v4l3 3 3-3V3M9 21v-4l3-3 3 3v4" />
    </svg>
  ),
  // map pin
  place: (
    <svg {...iconProps}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  // price tag
  price: (
    <svg {...iconProps}>
      <path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0l-6.2-6.2A2 2 0 0 1 3.8 13V5.8A2 2 0 0 1 5.8 3.8H13a2 2 0 0 1 1.4.6l6.2 6.2a2 2 0 0 1 0 2.8z" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  // people
  seats: (
    <svg {...iconProps}>
      <circle cx="10" cy="8" r="3" />
      <path d="M4 19a6 6 0 0 1 12 0" />
      <path d="M16.5 5.6a3 3 0 0 1 0 4.8M20 19a6 6 0 0 0-3-5.2" />
    </svg>
  ),
};

export default function CalendarSplit({
  events,
  month,
  year,
}: CalendarSplitProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState(() => ({
    month: month ?? new Date().getMonth(),
    year: year ?? new Date().getFullYear(),
  }));

  // Events falling on the selected day, ordered by time.
  const selectedEvents = useMemo(() => {
    if (!selected) return [];
    return events
      .filter((e) => e.date && dayKey(new Date(e.date)) === selected)
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
  }, [events, selected]);

  // Next 3 upcoming events (from now), shown as teasers when the selected day
  // has no event of its own.
  const upcomingEvents = useMemo(() => {
    const now = Date.now();
    return events
      .filter((e) => e.date && new Date(e.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [events]);

  // Select an event from a teaser: jump the calendar to its month and select
  // its day, exactly as clicking that day in the grid would.
  const selectEvent = (event: EventType) => {
    const d = new Date(event.date);
    setView({ month: d.getMonth(), year: d.getFullYear() });
    setSelected(dayKey(d));
  };

  // All photos across the selected day's events, tagged with their event title
  // for alt text. Shown in the full-width bottom pane.
  const selectedPhotos = useMemo(
    () =>
      selectedEvents.flatMap((event) =>
        (event.photos ?? []).map((photo) => ({ ...photo, title: event.title })),
      ),
    [selectedEvents],
  );

  return (
    <SplitView
      className="calendar-split"
      left={
        <Calendar
          events={events}
          month={view.month}
          year={view.year}
          onNavigate={(m, y) => setView({ month: m, year: y })}
          selectedDate={selected}
          onSelectDate={setSelected}
          renderDetail={false}
        />
      }
      right={
        <div className="calendar-split-detail">
          {!selected ? (
            <p className="calendar-split-hint">
              Selectează o zi pentru a vedea detaliile.
            </p>
          ) : selectedEvents.length === 0 ? (
            <div className="calendar-split-teasers">
              <p className="calendar-split-hint">
                Niciun eveniment în această zi. Evenimente următoare:
              </p>
              {upcomingEvents.length === 0 ? (
                <p className="calendar-split-hint">
                  Niciun eveniment programat.
                </p>
              ) : (
                <ul className="calendar-split-teaser-list">
                  {upcomingEvents.map((event) => {
                    const d = new Date(event.date);
                    return (
                      <li key={event._id}>
                        <button
                          type="button"
                          className="calendar-split-teaser"
                          onClick={() => selectEvent(event)}
                        >
                          <span className="calendar-split-teaser-date">
                            <span className="calendar-split-teaser-day">
                              {d.toLocaleDateString("ro-RO", { day: "2-digit" })}
                            </span>
                            <span className="calendar-split-teaser-month">
                              {d.toLocaleDateString("ro-RO", { month: "short" })}
                            </span>
                          </span>
                          <span className="calendar-split-teaser-body">
                            <span className="calendar-split-teaser-title">
                              {event.title}
                            </span>
                            {event.meetPoint && (
                              <span className="calendar-split-teaser-meta">
                                {event.meetPoint}
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : (
            <>
              <h2 className="calendar-split-date">
                {new Date(selected).toLocaleDateString("ro-RO", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h2>

              <ul className="calendar-split-events">
                {selectedEvents.map((event) => {
                  // Prefer the explicit start time; fall back to the date's time.
                  const startTime =
                    event.startTime ||
                    new Date(event.date).toLocaleTimeString("ro-RO", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                  const meta = [
                    { id: "time", label: "Ora de început", value: startTime },
                    { id: "duration", label: "Durată", value: event.duration },
                    {
                      id: "place",
                      label: "Punct de întâlnire",
                      value: event.meetPoint,
                    },
                    { id: "price", label: "Preț", value: event.price },
                    {
                      id: "seats",
                      label: "Locuri disponibile",
                      value:
                        event.maxParticipants != null
                          ? String(event.maxParticipants)
                          : undefined,
                    },
                  ].filter((row) => row.value);

                  return (
                    <li key={event._id} className="calendar-split-event">
                      <h3 className="calendar-split-name">{event.title}</h3>

                      {event.description && event.description.length > 0 && (
                        <div className="calendar-split-description has-portable-text">
                          <PortableText value={event.description} />
                        </div>
                      )}

                      {meta.length > 0 && (
                        <dl className="calendar-split-meta">
                          {meta.map((row) => (
                            <div key={row.label} className="calendar-split-meta-row">
                              <dt>
                                {META_ICONS[row.id]}
                                <span>{row.label}</span>
                              </dt>
                              <dd>{row.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      {event.importantNote &&
                        event.importantNote.length > 0 && (
                          <div className="calendar-split-note has-portable-text">
                            <span className="calendar-split-note-label">
                              Notă importantă
                            </span>
                            <PortableText value={event.importantNote} />
                          </div>
                        )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      }
      bottom={
        selected && selectedPhotos.length > 0 ? (
          <div className="calendar-split-gallery">
            <span className="calendar-split-gallery-label">Galerie</span>
            <div className="calendar-split-gallery-grid">
              {selectedPhotos.map((photo, i) => (
                <div key={photo.url ?? i} className="calendar-split-photo">
                  <Image
                    src={photo.url}
                    alt={photo.title}
                    fill
                    sizes="(min-width: 1160px) 1120px, 100vw"
                    className="object-cover"
                    placeholder={photo.lqip ? "blur" : undefined}
                    blurDataURL={photo.lqip}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null
      }
    />
  );
}
