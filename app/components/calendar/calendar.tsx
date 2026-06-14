"use client";

import { useMemo, useState } from "react";
import type { EventType } from "@/types";
import "./calendar.scss";

interface CalendarProps {
  events: EventType[];
  /** Displayed month (0-11). Initial value when uncontrolled, current value
   *  when `onNavigate` is supplied. */
  month?: number;
  /** Displayed year. Initial value when uncontrolled, current value when
   *  `onNavigate` is supplied. */
  year?: number;
  /** Called when the month is changed via the nav arrows. Supplying it makes
   *  the displayed month/year controlled by the parent. */
  onNavigate?: (month: number, year: number) => void;
  /** Controlled selected day key ("YYYY-MM-DD"). Pair with `onSelectDate`. */
  selectedDate?: string | null;
  /** Called when any day is clicked. Enables controlled selection. */
  onSelectDate?: (date: string | null) => void;
  /** Render the built-in detail panel below the grid (default true). Turn off
   *  when an external view (e.g. SplitView) renders the day's details. */
  renderDetail?: boolean;
}

// Monday-first week order (Sunday last), Romanian short names.
const WEEKDAYS = ["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"];

// Offset of the 1st of the month within a Monday-first week (Mon=0 … Sun=6)
const mondayFirstOffset = (m: number, y: number) =>
  (new Date(y, m, 1).getDay() + 6) % 7;

// Local-time "YYYY-MM-DD" key for a given Date (matches the grid, which is
// built in local time, so events land on the day the user sees them).
export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

export default function Calendar({
  events,
  month: monthProp = new Date().getMonth(),
  year: yearProp = new Date().getFullYear(),
  onNavigate,
  selectedDate,
  onSelectDate,
  renderDetail = true,
}: CalendarProps) {
  const [internalMonth, setInternalMonth] = useState(monthProp);
  const [internalYear, setInternalYear] = useState(yearProp);
  const [internalSelected, setInternalSelected] = useState<string | null>(null);

  // Month/year are controlled when an `onNavigate` handler is supplied.
  const isMonthControlled = onNavigate !== undefined;
  const month = isMonthControlled ? monthProp : internalMonth;
  const year = isMonthControlled ? yearProp : internalYear;
  const navigate = (m: number, y: number) => {
    if (isMonthControlled) onNavigate(m, y);
    else {
      setInternalMonth(m);
      setInternalYear(y);
    }
  };

  // Selection is controlled when an `onSelectDate` handler is supplied;
  // uncontrolled otherwise (keeps the standalone calendar self-sufficient).
  const isControlled = onSelectDate !== undefined;
  const selected = isControlled ? (selectedDate ?? null) : internalSelected;
  const setSelected = (date: string | null) => {
    if (isControlled) onSelectDate(date);
    else setInternalSelected(date);
  };

  const daysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();

  // Group events by their local day key, each list ordered by time.
  const eventsByDay = useMemo(() => {
    const map = new Map<string, EventType[]>();
    events.forEach((event) => {
      if (!event.date) return;
      const key = dayKey(new Date(event.date));
      const list = map.get(key);
      if (list) list.push(event);
      else map.set(key, [event]);
    });
    map.forEach((list) =>
      list.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    );
    return map;
  }, [events]);

  const days = Array.from({ length: daysInMonth(month, year) }, (_, i) => i + 1);
  const blanks = Array.from(
    { length: mondayFirstOffset(month, year) },
    (_, i) => i,
  );

  const monthName = new Date(year, month).toLocaleDateString("ro-RO", {
    month: "long",
    year: "numeric",
  });

  const todayKey = dayKey(new Date());

  const prevMonth = () => {
    setSelected(null);
    navigate(month === 0 ? 11 : month - 1, month === 0 ? year - 1 : year);
  };

  const nextMonth = () => {
    setSelected(null);
    navigate(month === 11 ? 0 : month + 1, month === 11 ? year + 1 : year);
  };

  const selectedEvents = selected ? (eventsByDay.get(selected) ?? []) : [];

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          type="button"
          className="calendar-nav"
          onClick={prevMonth}
          aria-label="Luna precedentă"
        >
          ‹
        </button>
        <h2 className="calendar-month">{monthName}</h2>
        <button
          type="button"
          className="calendar-nav"
          onClick={nextMonth}
          aria-label="Luna următoare"
        >
          ›
        </button>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAYS.map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {blanks.map((i) => (
          <div key={`blank-${i}`} className="calendar-day is-empty" />
        ))}

        {days.map((day) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day,
          ).padStart(2, "0")}`;
          const dayEvents = eventsByDay.get(dateStr) ?? [];
          const hasEvents = dayEvents.length > 0;
          const isToday = todayKey === dateStr;
          const isSelected = selected === dateStr;

          return (
            <button
              type="button"
              key={day}
              onClick={() => setSelected(dateStr)}
              title={
                hasEvents
                  ? dayEvents.map((e) => e.title).join(", ")
                  : undefined
              }
              className={`calendar-day ${
                hasEvents ? "has-events" : "is-free"
              } ${isToday ? "is-today" : ""} ${
                isSelected ? "is-selected" : ""
              }`}
            >
              {hasEvents && (
                <svg
                  className="calendar-day-star"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2l2.6 6.3 6.8.5-5.2 4.4 1.6 6.6L12 17l-5.8 3.3 1.6-6.6L2.6 9.3l6.8-.5z" />
                </svg>
              )}
              <span className="calendar-day-num">{day}</span>
            </button>
          );
        })}
      </div>

      {renderDetail && selected && (
        <div className="calendar-detail">
          <h3 className="calendar-detail-date">
            {new Date(selected).toLocaleDateString("ro-RO", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h3>
          <ul className="calendar-detail-list">
            {selectedEvents.map((event) => (
              <li key={event._id} className="calendar-detail-item">
                <span className="calendar-detail-time">
                  {new Date(event.date).toLocaleTimeString("ro-RO", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="calendar-detail-name">{event.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
