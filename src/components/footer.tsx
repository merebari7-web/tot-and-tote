import Link from "next/link";
import { AtSign, Backpack, Camera, Footprints, Handbag, Mail, MapPin } from "lucide-react";
import { Wordmark } from "./header";

const SHOP_LINKS = [
  { href: "/shop?category=schoolbags", label: "Schoolbags" },
  { href: "/shop?category=handbags", label: "Handbags" },
  { href: "/shop?category=shoes", label: "Little Shoes" },
  { href: "/shop", label: "Shop everything" },
  { href: "/shop?sort=rating", label: "Top rated" },
];

const SUPPORT_LINKS = [
  { href: "#", label: "Shipping & delivery" },
  { href: "#", label: "Returns & exchanges" },
  { href: "#", label: "Kids' size guide" },
  { href: "#", label: "Leather care guide" },
  { href: "#", label: "Contact us" },
];

const COMPANY_LINKS = [
  { href: "/#story", label: "Our story" },
  { href: "#story", label: "Materials we love" },
  { href: "#", label: "The Outgrow Club" },
  { href: "/admin", label: "Store dashboard" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Wordmark light />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/60">
              Schoolbags built for playground storms, handbags that mean business, and
              little shoes for first big miles — all from our family to yours.
            </p>
            <div className="mt-6 flex items-center gap-3 text-cream/50">
              <Backpack className="size-5" />
              <span className="text-xs uppercase tracking-[0.3em]">✦</span>
              <Handbag className="size-5" />
              <span className="text-xs uppercase tracking-[0.3em]">✦</span>
              <Footprints className="size-5" />
            </div>
            <div className="mt-8 flex gap-3">
              {[
                { icon: Camera, label: "Instagram" },
                { icon: AtSign, label: "Threads" },
                { icon: Mail, label: "Email" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-cream/15 transition hover:border-clay hover:bg-clay hover:text-cream"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Shop", links: SHOP_LINKS },
            { title: "Support", links: SUPPORT_LINKS },
            { title: "Company", links: COMPANY_LINKS },
          ].map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-[0.22em] text-cream/40">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/70 transition hover:text-clay"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-[0.22em] text-cream/40">Visit</h4>
            <p className="mt-4 flex items-start gap-1.5 text-sm text-cream/70">
              <MapPin className="mt-0.5 size-3.5 shrink-0 text-clay" />
              212 Juniper Row
              <br />
              Portland, OR
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-cream/40 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 Tot &amp; Tote Co. Made with care in Portland.</p>
          <div className="flex gap-6">
            <a href="#" className="transition hover:text-cream">
              Privacy
            </a>
            <a href="#" className="transition hover:text-cream">
              Terms
            </a>
            <a href="#" className="transition hover:text-cream">
              Accessibility
            </a>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none select-none text-center font-display text-[19vw] font-bold leading-[0.72] tracking-tight text-outline-cream opacity-[0.13]"
      >
        Tot&amp;Tote
      </div>
    </footer>
  );
}
