import Link from "next/link";
import NavMenu from "../nav-menu/nav-menu";
import "./site-header.scss";

const NAV_ITEMS = [
  { label: "Despre", href: "/about" },
  { label: "Calendar", href: "/calendar" },
  { label: "Întrebări frecvente", href: "/faq" },
];

export default function SiteHeader({ title }: { title: string }) {
  return (
    <header className="nsc-site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-header-brand text-uppercase">
          {title}
        </Link>
        <NavMenu items={NAV_ITEMS} />
      </div>
    </header>
  );
}
