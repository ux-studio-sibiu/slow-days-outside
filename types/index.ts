import type { PortableTextBlock } from "@portabletext/types";

export type FaqItem = {
  question: string;
  answer: string;
};

export type SiteInfoType = {
  _id: string;
  siteTitle: string;
  tagline?: string;
  heroImages?: { url: string; lqip?: string }[];
  aboutTitle?: string;
  aboutText?: PortableTextBlock[];
  email?: string;
  phoneNumber?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  faq?: FaqItem[];
};

export type EventPhoto = {
  url: string;
  width?: number;
  height?: number;
  /** Low-quality image placeholder (base64) for blur-up. */
  lqip?: string;
};

export type EventType = {
  _id: string;
  title: string;
  date: string;
  startTime?: string;
  duration?: string;
  meetPoint?: string;
  price?: string;
  maxParticipants?: number;
  description?: PortableTextBlock[];
  importantNote?: PortableTextBlock[];
  photos?: EventPhoto[];
};

export type DayStatus = "occupied" | "free";

export type DayRecord = {
  date: string;
  status?: DayStatus;
  note?: string;
  /** The event this day links to, resolved to its core fields. */
  event?: Pick<EventType, "_id" | "title" | "date"> | null;
};

export type AvailabilityType = {
  _id: string;
  days?: DayRecord[];
};
