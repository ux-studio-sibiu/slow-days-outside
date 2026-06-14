import { useEffect, useMemo, useState } from "react";
import { ObjectInputProps, set, unset, useClient } from "sanity";
import { Box, Button, Select, Stack, Text, TextArea } from "@sanity/ui";

type DayStatus = "occupied" | "free";

interface EventRef {
  _type: "reference";
  _ref: string;
}

interface DayRecord {
  _key?: string;
  date?: string;
  status?: DayStatus;
  note?: string;
  event?: EventRef;
}

// Patch shape for upsertDay. `event` is three-state: undefined = leave as-is,
// null = clear the link, object = set it.
type DayChanges = Partial<Omit<DayRecord, "event">> & {
  event?: EventRef | null;
};

interface EventOption {
  _id: string;
  title: string;
  date?: string;
}

const makeKey = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const toDateStr = (y: number, m: number, day: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

// A record is worth keeping only if it marks the day occupied, carries a note,
// or links an event. (A plain "free" day with nothing attached is the default.)
const isMeaningful = (d: DayRecord) =>
  Boolean(d.date) &&
  (d.status === "occupied" || Boolean(d.note?.trim()) || Boolean(d.event?._ref));

export function AvailabilityInput(props: ObjectInputProps) {
  const { value, onChange } = props;
  const days = (value?.days as DayRecord[] | undefined) ?? [];
  const client = useClient({ apiVersion: "2025-07-14" });

  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<EventOption[]>([]);

  // Load existing events so each day can be linked to one.
  useEffect(() => {
    let active = true;
    client
      .fetch<EventOption[]>(
        `*[_type == "event"] | order(date desc){ _id, title, date }`,
      )
      .then((result) => {
        if (active) setEvents(result ?? []);
      })
      .catch(() => {
        if (active) setEvents([]);
      });
    return () => {
      active = false;
    };
  }, [client]);

  const eventMap = useMemo(() => {
    const map = new Map<string, EventOption>();
    events.forEach((e) => map.set(e._id, e));
    return map;
  }, [events]);

  const writeDays = (next: DayRecord[]) => {
    const clean = next.filter(isMeaningful);
    onChange(clean.length > 0 ? set(clean, ["days"]) : unset(["days"]));
  };

  const dayMap = useMemo(() => {
    const map = new Map<string, DayRecord>();
    days.forEach((d) => {
      if (d.date) map.set(d.date, d);
    });
    return map;
  }, [days]);

  const daysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();
  // Offset of the 1st within a Monday-first week (Mon=0 … Sun=6)
  const mondayFirstOffset = (m: number, y: number) =>
    (new Date(y, m, 1).getDay() + 6) % 7;

  const monthDays = Array.from(
    { length: daysInMonth(month, year) },
    (_, i) => i + 1,
  );
  const blanks = Array.from(
    { length: mondayFirstOffset(month, year) },
    (_, i) => i,
  );

  const monthName = new Date(year, month).toLocaleDateString("ro-RO", {
    month: "long",
    year: "numeric",
  });

  const upsertDay = (dateStr: string, changes: DayChanges) => {
    const existing = dayMap.get(dateStr);
    const nextEvent =
      changes.event !== undefined ? changes.event : existing?.event;
    const merged: DayRecord = {
      _key: existing?._key ?? makeKey(),
      date: dateStr,
      status: changes.status ?? existing?.status ?? "occupied",
      note: changes.note !== undefined ? changes.note : existing?.note,
      // null (cleared) or an object without a _ref both collapse to "no link".
      event: nextEvent?._ref ? nextEvent : undefined,
    };
    const others = days.filter((d) => d.date !== dateStr);
    writeDays([...others, merged]);
  };

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const selectedRecord = selectedDate ? dayMap.get(selectedDate) : undefined;
  const selectedStatus: DayStatus = selectedRecord?.status ?? "free";

  return (
    <Stack space={4} padding={4}>
      <Box>
        <Text weight="semibold" size={2} style={{ marginBottom: "1rem" }}>
          Disponibilitate (apasă o zi pentru a edita)
        </Text>

        <Stack space={3} style={{ marginBottom: "1.5rem" }}>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              text="← Anterioară"
              onClick={prevMonth}
              mode="bleed"
              fontSize={1}
            />
            <Text weight="semibold" style={{ textTransform: "capitalize" }}>
              {monthName}
            </Text>
            <Button
              text="Următoare →"
              onClick={nextMonth}
              mode="bleed"
              fontSize={1}
            />
          </Box>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "8px",
            }}
          >
            {["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"].map((day) => (
              <div
                key={day}
                style={{
                  textAlign: "center",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "#999",
                  padding: "8px 0",
                }}
              >
                {day}
              </div>
            ))}

            {blanks.map((_, i) => (
              <div key={`blank-${i}`} />
            ))}

            {monthDays.map((day) => {
              const dateStr = toDateStr(year, month, day);
              const record = dayMap.get(dateStr);
              const isOccupied = record?.status === "occupied";
              const hasNote = Boolean(record?.note?.trim());
              const linkedEvent = record?.event?._ref
                ? eventMap.get(record.event._ref)
                : undefined;
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  title={linkedEvent?.title || record?.note || undefined}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2px",
                    aspectRatio: "1",
                    padding: "4px",
                    overflow: "hidden",
                    border: isSelected ? "2px solid #1a1a1a" : "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    backgroundColor: isOccupied ? "#e25920" : "#f0f0f0",
                    color: isOccupied ? "#fff" : "#1a1a1a",
                    transition: "all 0.2s",
                  }}
                >
                  <span>{day}</span>
                  {(linkedEvent || hasNote) && (
                    <span
                      style={{
                        maxWidth: "100%",
                        fontSize: "0.55rem",
                        lineHeight: 1.1,
                        fontWeight: 400,
                        opacity: 0.85,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {linkedEvent?.title ?? record?.note}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Stack>
      </Box>

      {selectedDate && (
        <Box
          style={{
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          <Stack space={3}>
            <Text weight="semibold" size={1}>
              {new Date(selectedDate).toLocaleDateString("ro-RO", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>

            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                text="Ocupat"
                tone="critical"
                mode={selectedStatus === "occupied" ? "default" : "ghost"}
                fontSize={1}
                onClick={() => upsertDay(selectedDate, { status: "occupied" })}
              />
              <Button
                text="Liber"
                mode={selectedStatus === "free" ? "default" : "ghost"}
                fontSize={1}
                onClick={() => upsertDay(selectedDate, { status: "free" })}
              />
            </div>

            <Stack space={2}>
              <Text size={1} muted>
                Eveniment legat
              </Text>
              <Select
                fontSize={1}
                value={selectedRecord?.event?._ref ?? ""}
                onChange={(e) => {
                  const id = e.currentTarget.value;
                  upsertDay(selectedDate, {
                    event: id ? { _type: "reference", _ref: id } : null,
                  });
                }}
              >
                <option value="">— Niciun eveniment —</option>
                {events.map((ev) => (
                  <option key={ev._id} value={ev._id}>
                    {ev.title}
                    {ev.date
                      ? ` (${new Date(ev.date).toLocaleDateString("ro-RO")})`
                      : ""}
                  </option>
                ))}
              </Select>
            </Stack>

            <Stack space={2}>
              <Text size={1} muted>
                Notă
              </Text>
              <TextArea
                rows={2}
                value={selectedRecord?.note ?? ""}
                placeholder="Notă opțională pentru această zi…"
                onChange={(e) =>
                  upsertDay(selectedDate, { note: e.currentTarget.value })
                }
              />
            </Stack>

            <Button
              text="Închide"
              mode="bleed"
              fontSize={1}
              onClick={() => setSelectedDate(null)}
            />
          </Stack>
        </Box>
      )}

      <Box
        style={{
          padding: "12px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px",
          fontSize: "0.85rem",
          color: "#666",
        }}
      >
        <Text size={1}>
          💡 Apasă o zi pentru a o marca ocupată/liberă, a o lega de un eveniment
          și a adăuga o notă opțională.
        </Text>
      </Box>
    </Stack>
  );
}
