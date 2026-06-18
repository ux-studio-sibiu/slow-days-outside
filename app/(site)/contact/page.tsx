import Image from "next/image";
import { getGeneralInfo } from "@/sanity/sanity.query";
import logoBlack from "@/media/logo-black.jpeg";
import "./contact.scss";

export const revalidate = 60; // seconds

export default async function Contact() {
  const info = await getGeneralInfo();
  const email = info?.email;
  const phone = info?.phoneNumber;
  const social = info?.social;
  const hasSocial = Boolean(social?.facebook || social?.instagram || social?.linkedin || social?.youtube);

  return (
    <div id="nsc--contact" className="has-splatter-bg has-watermark-bg" style={{ "--watermark-number": '"2026"', "--watermark-opacity": "0.08" } as React.CSSProperties}>
      <div className="contact-inner">
        <Image src={logoBlack} alt="Slow Play" className="contact-logo" priority />
        {/* <h1 className="contact-title">Contact</h1>
        <p className="contact-lead">Scrie-ne sau sună-ne — răspundem cu drag.</p> */}

        {(email || phone) && (
          <div className="contact-methods">
            {email && (
              <a href={`mailto:${email}`} className="contact-method">
                <span className="contact-method-label">Email</span>
                <span className="contact-method-value">{email}</span>
              </a>
            )}
            {phone && (
              <a href={`tel:${phone.replace(/\s+/g, "")}`} className="contact-method">
                <span className="contact-method-label">Telefon</span>
                <span className="contact-method-value">{phone}</span>
              </a>
            )}
          </div>
        )}

        {hasSocial && (
          <div className="contact-social">
            <span className="contact-social-label">Urmărește-ne</span>
            <ul className="contact-social-list">
              {social?.facebook && <li><a href={social.facebook} target="_blank" rel="noopener noreferrer" className="contact-social-link">Facebook</a></li>}
              {social?.instagram && <li><a href={social.instagram} target="_blank" rel="noopener noreferrer" className="contact-social-link">Instagram</a></li>}
              {social?.linkedin && <li><a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="contact-social-link">LinkedIn</a></li>}
              {social?.youtube && <li><a href={social.youtube} target="_blank" rel="noopener noreferrer" className="contact-social-link">YouTube</a></li>}
            </ul>
          </div>
        )}

        {!email && !phone && !hasSocial && (
          <p className="contact-empty">Completați datele de contact în Setări website.</p>
        )}
      </div>
    </div>
  );
}
