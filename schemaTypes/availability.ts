import { defineField, defineType } from "sanity";
import { AvailabilityInput } from "../sanity/components/availability-input";

const availability = defineType({
  name: "availability",
  title: "Calendar",
  type: "document",

  components: {
    input: AvailabilityInput,
  },

  fields: [
    defineField({
      name: "days",
      title: "Zile",
      description:
        "Disponibilitate pe zile. O zi este liberă dacă nu are o înregistrare care o marchează ocupată. Fiecare zi poate fi legată de un eveniment existent.",
      type: "array",
      of: [
        {
          type: "object",
          name: "day",
          fields: [
            defineField({
              name: "date",
              title: "Dată",
              type: "date",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "status",
              title: "Status",
              type: "string",
              options: {
                list: [
                  { title: "Ocupat", value: "occupied" },
                  { title: "Liber", value: "free" },
                ],
                layout: "radio",
              },
              initialValue: "occupied",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "event",
              title: "Eveniment",
              description: "Leagă această zi de un eveniment existent.",
              type: "reference",
              to: [{ type: "event" }],
            }),
            defineField({
              name: "note",
              title: "Notă",
              type: "text",
              rows: 2,
            }),
          ],
          preview: {
            select: {
              date: "date",
              status: "status",
              note: "note",
              eventTitle: "event.title",
            },
            prepare({ date, status, note, eventTitle }) {
              const label = status === "free" ? "liber" : "ocupat";
              return {
                title: `${date} — ${label}`,
                subtitle: eventTitle ? `→ ${eventTitle}` : note || undefined,
              };
            },
          },
        },
      ],
    }),
  ],
});

export default availability;
