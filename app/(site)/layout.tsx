import type { Metadata } from "next";
import { Poppins } from "next/font/google";
// Website global styles (normalize, resets, theme) live ONLY in this route
// group's bundle, so they never leak into the Sanity Studio at /studio.
import "@/app/styles/globals.scss";
import SiteHeader from "@/app/components/site-header/site-header";
import HeroSwiper from "@/app/components/hero-swiper/hero-swiper";
import { getGeneralInfo } from "@/sanity/sanity.query";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Educator",
  description: "Site personal — educator",
  icons: { icon: "/images/favicon.png" },
};

export default async function SiteLayout({
  children,
  aside,
}: {
  children: React.ReactNode;
  aside: React.ReactNode;
}) {
  const info = await getGeneralInfo();
  const title = info?.siteTitle || "Educator";
  const tagline = info?.tagline || "";

  return (
    <html lang="ro" data-scroll-behavior="smooth">
      <body className={poppins.variable}>
        <div className="nsc-site-layout">
          <aside className="site-panel site-panel-left">
            <SiteHeader title={title} tagline={tagline} />
            {/* Hero lives in the layout so it never remounts on in-section
                navigation — the swiper keeps its slide across pages. The slot
                only overlays the calendar on /calendar routes. */}
            <div className="site-hero">
              <HeroSwiper />
            </div>
            {aside}
          </aside>
          <main className="site-panel site-panel-right">{children}</main>
        </div>
      </body>
    </html>
  );
}
