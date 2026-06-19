import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { getGeneralInfo } from "@/sanity/sanity.query";
import logoBlack from "@/media/logo-black.jpeg";
import "./about.scss";
import { DecorLayer } from "@/app/components/decor-layer/decor-layer";
import { SvgItem } from "@/app/components/decor-layer/svg-item";

export const revalidate = 60; // seconds

export default async function About() {
  const info = await getGeneralInfo();

  return (
    <div id="nsc--about">

      
      <article className="about-inner">

        <DecorLayer color="rgba(0,0,0,0.1)" >
              <SvgItem src="/images/foliage-3.svg" right="4%" top="61%" width="23rem" rotate={-8} flipX />
              <SvgItem src="/images/foliage-5.svg" left="-12%" top="3%" width="23rem" rotate={10} />
              <SvgItem src="/images/butterfly-1.svg" left="4%" top="48%" width="12rem" rotate={355} />
              <SvgItem src="/images/butterfly-3.svg" right="9%" top="44%" width="8rem" rotate={-10} flipX />
              <SvgItem src="/images/forest-2.svg" right="-12%" bottom="0%" width="100%" rotate={-5} />
        </DecorLayer>


        <Image src={logoBlack} alt="Slow Play" className="about-logo" priority />
        <h1 className="about-title">Despre</h1>

        {info?.aboutText ? (
          <div className="about-body has-portable-text">
            <PortableText value={info.aboutText} />
          </div>
        ) : (
          <p className="about-empty">
            Completați secțiunea „Despre mine” în Setări website.
          </p>
        )}

        {(info?.email || info?.phoneNumber) && (
          <div className="about-contact">
            {info?.email && (
              <a href={`mailto:${info.email}`} className="about-contact-link">
                {info.email}
              </a>
            )}
            {info?.phoneNumber && (
              <a href={`tel:${info.phoneNumber.replace(/\s+/g, "")}`} className="about-contact-link">
                {info.phoneNumber}
              </a>
            )}
          </div>
        )}

      </article>
    </div>
  );
}
