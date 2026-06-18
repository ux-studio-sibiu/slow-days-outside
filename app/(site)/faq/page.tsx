import { getGeneralInfo } from "@/sanity/sanity.query";
import Accordion, { AccordionItem } from "@/app/components/accordion/accordion";
import "./faq.scss";

export const revalidate = 60; // seconds

export default async function Faq() {
  const info = await getGeneralInfo();
  const items = info?.faq ?? [];

  return (
    <div id="nsc--faq" className="has-splatter-bg has-watermark-bg" style={{ "--watermark-number": '"2026"', "--watermark-opacity": "0.08" } as React.CSSProperties}>
      <div className="faq-inner">
        <h1 className="faq-title">Întrebări frecvente</h1>

        {items.length === 0 ? (
          <p className="faq-empty">
            Adăugați întrebări frecvente în Setări website.
          </p>
        ) : (
          <Accordion>
            {items.map((item, i) => (
              <AccordionItem key={i} title={item.question}>{item.answer}</AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
