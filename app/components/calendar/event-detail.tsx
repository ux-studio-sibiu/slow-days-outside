import { PortableText } from "@portabletext/react";
import type { EventType } from "@/types";
import SignupForm from "@/app/components/signup-form/signup-form";

export default function EventDetail({ event }: { event: EventType }) {
  // Prefer the explicit start time; fall back to the date's time.
  const startTime =
    event.startTime ||
    new Date(event.date).toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });

  const meta = [
    { id: "time", label: "Ora de început", value: startTime },
    { id: "duration", label: "Durată", value: event.duration },
    { id: "place", label: "Punct de întâlnire", value: event.meetPoint },
    { id: "price", label: "Preț", value: event.price },
    {
      id: "seats",
      label: "Locuri disponibile",
      value: event.maxParticipants != null ? String(event.maxParticipants) : undefined,
    },
  ].filter((row) => row.value);

  return (
    <li className="calendar-event">
      <h2 className="calendar-event-name">{event.title}</h2>

      {event.subtitle && <p className="calendar-event-subtitle">{event.subtitle}</p>}

      {event.description && event.description.length > 0 && (
        <div className="calendar-event-description has-portable-text">
          <PortableText value={event.description} />
        </div>
      )}

      {meta.length > 0 && (
        <dl className="calendar-meta">
          {meta.map((row) => (
            <div key={row.label} className="calendar-meta-row">
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {event.importantNote && event.importantNote.length > 0 && (
        <div className="calendar-note has-portable-text">
          <span className="calendar-note-label">Notă importantă</span>
          <PortableText value={event.importantNote} />
        </div>
      )}

      <SignupForm eventId={event._id} eventTitle={event.title} />
    </li>
  );
}
