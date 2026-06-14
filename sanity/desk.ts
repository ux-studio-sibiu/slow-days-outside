import { StructureResolver } from "sanity/structure";
import { CogIcon, CalendarIcon, ClockIcon } from "@sanity/icons";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Conținut")
    .items([
      // Settings - opens directly as singleton
      S.listItem()
        .title("Setări website")
        .id("setari-website")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("general-info")
            .documentId("general-info")
            .title("Setări website")
        ),

      S.divider(),

      // Events
      S.listItem()
        .title("Evenimente")
        .icon(CalendarIcon)
        .child(
          S.documentTypeList("event")
            .title("Evenimente")
            .defaultOrdering([{ field: "date", direction: "desc" }])
        ),

      // Availability calendar - opens directly as singleton
      S.listItem()
        .title("Calendar")
        .id("calendar-disponibilitate")
        .icon(ClockIcon)
        .child(
          S.document()
            .schemaType("availability")
            .documentId("availability")
            .title("Calendar")
        ),
    ]);
