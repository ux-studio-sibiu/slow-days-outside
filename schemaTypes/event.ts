import { defineField, defineType } from "sanity";

const event = defineType({
  name: "event",
  title: "Eveniment",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Titlu",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "date",
      title: "Dată",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "startTime",
      title: "Ora de început",
      description: "Ex.: 09:00",
      type: "string",
    }),

    defineField({
      name: "duration",
      title: "Durată",
      description: "Ex.: 2 ore",
      type: "string",
    }),

    defineField({
      name: "meetPoint",
      title: "Punct de întâlnire",
      type: "string",
    }),

    defineField({
      name: "price",
      title: "Preț",
      description: "Ex.: 40 lei / copil sau Gratuit",
      type: "string",
    }),

    defineField({
      name: "maxParticipants",
      title: "Locuri disponibile",
      type: "number",
      validation: (rule) => rule.min(1).integer(),
    }),

    defineField({
      name: "description",
      title: "Descriere",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "importantNote",
      title: "Notă importantă",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "public",
      title: "Vizibil în calendarul public",
      description:
        "Dacă este bifat, evenimentul apare în calendarul de pe site.",
      type: "boolean",
      initialValue: true,
    }),

    defineField({
      name: "photos",
      title: "Fotografii",
      description: "Trageți și plasați mai multe imagini deodată.",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
  ],

  preview: {
    select: { title: "title", date: "date", media: "photos.0", isPublic: "public" },
    prepare({ title, date, media, isPublic }) {
      const parts = [
        date ? new Date(date as string).toLocaleDateString("ro-RO") : null,
        isPublic === false ? "ascuns din calendar" : null,
      ].filter(Boolean);
      return {
        title: title || "Eveniment fără titlu",
        subtitle: parts.length ? parts.join(" · ") : undefined,
        media,
      };
    },
  },
});

export default event;
