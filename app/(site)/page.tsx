import Image from "next/image";
import { getGeneralInfo, getEvents } from "@/sanity/sanity.query";
import CtaPopout from "@/app/components/cta-popout/cta-popout";
import SplatterBackdrop from "@/app/components/splatter-backdrop/splatter-backdrop";
import HeroSwiper from "@/app/components/hero-swiper/hero-swiper";
import "./page.scss";

export const revalidate = 60; // seconds

export default async function Home() {
  const [info, events] = await Promise.all([getGeneralInfo(), getEvents()]);

  const title = info?.siteTitle || "Educator";
  const tagline = info?.tagline || "";
  const heroImages = info?.heroImages ?? [];
  const heroImage = heroImages[0];

  return (
    <main id="nsc--home">
      <section className="home-hero">
        {heroImages.length > 1 ? (
          // Multiple hero images → swiper so each can be test-driven.
          <div className="home-hero-media">
            <HeroSwiper images={heroImages} alt={title} />
          </div>
        ) : (
          heroImage?.url && (
            <div className="home-hero-media">
              <Image
                src={heroImage.url}
                alt={title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
                placeholder={heroImage.lqip ? "blur" : undefined}
                blurDataURL={heroImage.lqip}
              />
            </div>
          )
        )}
        <div className="home-hero-content">
          <h1 className="home-hero-title text-uppercase">{title}</h1>
          {tagline && <p className="home-hero-tagline">{tagline}</p>}
        </div>
      </section>

      <CtaPopout />

      <SplatterBackdrop as="section" className="home-events">
        <h2 className="home-events-title">Evenimente</h2>

        {events.length === 0 ? (
          <p className="home-events-empty">
            Niciun eveniment momentan. Reveniți în curând.
          </p>
        ) : (
          <ul className="home-events-list">
            {events.map((event) => {
              const cover = event.photos?.[0];
              return (
                <li key={event._id} className="home-events-item">
                  {cover?.url && (
                    <div className="home-events-thumb">
                      <Image
                        src={cover.url}
                        alt={event.title}
                        fill
                        sizes="(min-width: 768px) 360px, 100vw"
                        className="object-cover"
                        placeholder={cover.lqip ? "blur" : undefined}
                        blurDataURL={cover.lqip}
                      />
                    </div>
                  )}
                  <div className="home-events-body">
                    <span className="home-events-date">
                      {new Date(event.date).toLocaleDateString("ro-RO", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <h3 className="home-events-name">{event.title}</h3>
                    {event.photos && event.photos.length > 1 && (
                      <span className="home-events-count">
                        {event.photos.length} fotografii
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </SplatterBackdrop>
    </main>
  );
}
