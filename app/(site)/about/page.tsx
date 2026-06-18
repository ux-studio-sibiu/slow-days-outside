import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { getGeneralInfo } from "@/sanity/sanity.query";
import logoBlack from "@/media/logo-black.jpeg";
import "./about.scss";

export const revalidate = 60; // seconds

export default async function About() {
  const info = await getGeneralInfo();

  return (
    <div id="nsc--about" className="has-butterflies-bg">
      <article className="about-inner">
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
