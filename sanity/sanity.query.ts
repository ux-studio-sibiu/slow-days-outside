import { groq } from "next-sanity";
import client from "./sanity.client";
import { SiteInfoType, EventType, AvailabilityType } from "@/types";
import { unstable_cache } from "next/cache";

// 3s in dev, 1h otherwise
const revalidateInterval = process.env.NODE_ENV === "development" ? 3 : 3 * 3600;

export const getGeneralInfo = unstable_cache(
  async (): Promise<SiteInfoType> => {
    return client.fetch(
      groq`*[_type == "general-info"][0]{
        _id,
        siteTitle,
        tagline,
        "heroImages": heroImages[]{ "url": asset->url, "lqip": asset->metadata.lqip },
        aboutTitle,
        aboutText,
        email,
        phoneNumber,
        social,
        faq[]{ question, answer },
      }`,
      {},
    );
  },
  ["generalInfo"],
  { revalidate: revalidateInterval, tags: ["general-info"] },
);

export const getEvents = unstable_cache(
  async (): Promise<EventType[]> => {
    return client.fetch(
      groq`*[_type == "event" && public != false] | order(date desc){
        _id,
        title,
        date,
        startTime,
        duration,
        meetPoint,
        price,
        maxParticipants,
        description,
        importantNote,
        "photos": photos[]{
          "url": asset->url,
          "width": asset->metadata.dimensions.width,
          "height": asset->metadata.dimensions.height,
          "lqip": asset->metadata.lqip,
        },
      }`,
      {},
    );
  },
  ["events"],
  { revalidate: revalidateInterval, tags: ["event"] },
);

export const getAvailability = unstable_cache(
  async (): Promise<AvailabilityType | null> => {
    return client.fetch(
      groq`*[_type == "availability"][0]{
        _id,
        "days": days[]{
          date,
          status,
          note,
          "event": event->{
            _id,
            title,
            date,
          },
        },
      }`,
      {},
    );
  },
  ["availability"],
  { revalidate: revalidateInterval, tags: ["availability"] },
);
