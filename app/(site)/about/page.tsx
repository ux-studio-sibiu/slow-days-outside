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
    <div id="nsc--about" className="pt-100 pb-300">
      <DecorLayer color="rgba(0,0,0,0.05)">
        <SvgItem src="/images/sun-3.svg" top="-10%" right="-10%" width="20rem" />
        
        <SvgItem src="/images/more-leaves-2.svg" top="25rem" left="-4%" width="17rem" rotate={20} />

        <SvgItem src="/images/leaves-2.svg" right="-3%" top="30%" width="30%" rotate={-70} />
        <SvgItem src="/images/leaves-5.svg" left="-7%" top="50%" width="38%" rotate={20} />

        <SvgItem src="/images/butterfly-1.svg" left="4%" top="3%" width="8rem" rotate={355} />
        <SvgItem src="/images/more-birds-6.svg" left="30%" top="0%" width="8rem" rotate={355} />
        <SvgItem src="/images/butterfly-3.svg" right="9%" top="20%" width="8rem" rotate={-10} flipX />
        <SvgItem src="/images/forest-2.svg" bottom="-2rem" left="-5%" width="110%" />
        
      </DecorLayer>

      <div className="page-content">
        <Image src={logoBlack} alt="Slow Play" className="about-logo" priority />
        <h1 className="about-title">Despre</h1>

        {info?.aboutText ? (
          <div className="about-body has-portable-text">
            <PortableText value={info.aboutText} />
          </div>
        ) : (
          <p className="about-empty">
            Completați secțiunea „Despre mine" în Setări website.
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
      </div>
    </div>
  );
}
