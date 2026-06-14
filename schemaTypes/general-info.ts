import { defineField } from "sanity";

const generalInfo = {
  name: "general-info",
  title: "Setări website",
  type: "document",

  fields: [
    defineField({
      name: "siteTitle",
      title: "Titlu site",
      description: "Numele afișat în antet și pe prima pagină.",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "tagline",
      title: "Slogan",
      description: "Un subtitlu scurt afișat sub titlu.",
      type: "string",
    }),

    defineField({
      name: "heroImages",
      title: "Imagini copertă",
      description: "Imaginile afișate pe prima pagină.",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),

    defineField({
      name: "aboutTitle",
      title: "Titlu „Despre",
      type: "string",
    }),

    defineField({
      name: "aboutText",
      title: "Text „Despre",
      description: "Prezentarea afișată pe pagina „Despre.",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) =>
        rule.email().error("Introduceți o adresă de email validă"),
    }),

    defineField({
      name: "phoneNumber",
      title: "Telefon",
      type: "string",
    }),

    defineField({
      name: "social",
      title: "Rețele sociale",
      description: "Lăsați un câmp gol pentru a ascunde acel link.",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "facebook",
          title: "Facebook",
          type: "url",
        }),
        defineField({
          name: "instagram",
          title: "Instagram",
          type: "url",
        }),
        defineField({
          name: "linkedin",
          title: "LinkedIn",
          type: "url",
        }),
        defineField({
          name: "youtube",
          title: "YouTube",
          type: "url",
        }),
      ],
    }),

    defineField({
      name: "faq",
      title: "Întrebări frecvente",
      type: "array",
      of: [
        {
          type: "object",
          name: "faqItem",
          title: "Întrebare",
          fields: [
            defineField({
              name: "question",
              title: "Întrebare",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Răspuns",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "question", subtitle: "answer" },
          },
        },
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: "Setări website" };
    },
  },
};

export default generalInfo;
