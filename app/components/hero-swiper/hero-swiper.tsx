"use client";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./hero-swiper.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Keyboard, A11y } from "swiper/modules";
import Image from "next/image";

export type HeroSwiperImage = { url: string; lqip?: string };

export default function HeroSwiper({
  images,
  alt = "imagine",
}: {
  images: HeroSwiperImage[];
  alt?: string;
}) {
  return (
    <Swiper
      className="nsc-hero-swiper"
      modules={[EffectFade, Navigation, Pagination, Keyboard, A11y]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      loop
      slidesPerView={1}
      keyboard={{ enabled: true }}
      navigation
      pagination={{ clickable: true }}
    >
      {images.map((src, idx) => (
        <SwiperSlide key={idx}>
          <Image
            src={src.url}
            className="object-cover"
            alt={`${alt} ${idx + 1}`}
            fill
            priority={idx === 0}
            sizes="100vw"
            placeholder={src.lqip ? "blur" : "empty"}
            blurDataURL={src.lqip}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
