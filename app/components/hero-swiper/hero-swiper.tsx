"use client";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "./hero-swiper.scss";

import { useRef, type MouseEvent } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Keyboard, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image, { type StaticImageData } from "next/image";

export type HeroSwiperImage = { url: string | StaticImageData; lqip?: string };

// Cover images ("Imagini copertă") come from the Sanity site settings, fetched
// in the layout and passed down.
export default function HeroSwiper({ images }: { images: HeroSwiperImage[] }) {
  const swiperRef = useRef<SwiperType | null>(null);

  // Edge click zones step the swiper.
  const goPrev = (e: MouseEvent) => { e.stopPropagation(); swiperRef.current?.slidePrev(); };
  const goNext = (e: MouseEvent) => { e.stopPropagation(); swiperRef.current?.slideNext(); };

  if (images.length === 0) return null;

  return (
    <div className="nsc-hero-swiper">
      <Swiper
        className="hero-swiper"
        modules={[EffectFade, Pagination, Keyboard, A11y]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        slidesPerView={1}
        keyboard={{ enabled: true }}
        onSwiper={(s) => (swiperRef.current = s)}
        pagination={{ clickable: true }}
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx}>
            <Image src={src.url} className="object-cover" alt={`Image ${idx + 1}`} fill priority={idx === 0} sizes="100vw" placeholder={src.lqip ? "blur" : "empty"} blurDataURL={src.lqip} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Edge zones with left/right arrow cursors that step the swiper. */}
      <button type="button" className="hero-nav prev" aria-label="Imaginea anterioară" onClick={goPrev} />
      <button type="button" className="hero-nav next" aria-label="Imaginea următoare" onClick={goNext} />
    </div>
  );
}
