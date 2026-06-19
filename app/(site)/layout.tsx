import type { Metadata } from "next";
import { Archivo, Lora } from "next/font/google";
// Website global styles (normalize, resets, theme) live ONLY in this route
// group's bundle, so they never leak into the Sanity Studio at /studio.
import "@/app/styles/globals.scss";
import SiteHeader from "@/app/components/site-header/site-header";
import HeroSwiper from "@/app/components/hero-swiper/hero-swiper";
import { getGeneralInfo } from "@/sanity/sanity.query";

// Archivo is a variable font, so weight is omitted (the full range loads).
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

// Lora for serif headings and editorial typography.
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Slow Days Outside",
  description: "Slow Days Outside",
  icons: { icon: "/favicon.png" },
};

export default async function SiteLayout({
  children,
  aside,
}: {
  children: React.ReactNode;
  aside: React.ReactNode;
}) {
  const info = await getGeneralInfo();

  return (
    <html lang="ro" data-scroll-behavior="smooth">
      <body className={`${archivo.variable} ${lora.variable}`}>
        <div className="nsc-site-layout">
          <aside className="site-panel site-panel-left">
            <SiteHeader />
            {/* Hero lives in the layout so it never remounts on in-section
                navigation — the swiper keeps its slide across pages. The slot
                only overlays the calendar on /calendar routes. */}
            <div className="site-hero">
              <HeroSwiper images={info?.heroImages ?? []} />
            </div>
            {aside}
          </aside>
          <main className="site-panel site-panel-right">{children}</main>
        </div>
      </body>
    </html>
  );
}
