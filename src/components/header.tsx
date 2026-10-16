"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "./cart-context";
import { SearchOverlay } from "./search-overlay";

const NAV = [
  { href: "/shop?category=schoolbags", label: "Schoolbags" },
  { href: "/shop?category=handbags", label: "Handbags" },
  { href: "/shop?category=shoes", label: "Little Shoes" },
  { href: "/shop", label: "Shop All" },
];

const TICKER_ITEMS = [
  "Free shipping over $75",
  "30-day fuss-free returns",
  "2-year stitch guarantee",
  "Family-run since 2019",
  "Carbon-aware deliveries",
];

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-baseline gap-1" aria-label="Tot & Tote home">
      <span
        className={cn(
          "font-display text-[1.55rem] font-semibold tracking-tight transition-colors",
          light ? "text-cream" : "text-ink",
        )}
      >
        Tot
      </span>
      <span className="font-display text-[1.55rem] italic font-medium text-clay transition-transform duration-300 group-hover:rotate-12 inline-block">
        &amp;
      </span>
      <span
        className={cn(
          "font-display text-[1.55rem] font-semibold tracking-tight",
          light ? "text-cream" : "text-ink",
        )}
      >
        Tote
      </span>
    </Link>
  );
}

export function Header() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* announcement marquee */}
      <div className="relative z-40 overflow-hidden bg-clay text-cream">
        <div className="flex w-max animate-marquee items-center gap-8 py-2 text-[11px] font-medium uppercase tracking-[0.22em]">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center gap-8" aria-hidden={dup === 1}>
              {TICKER_ITEMS.map((item) => (
                <span key={item} className="flex items-center gap-8">
                  <span>{item}</span>
                  <span className="text-butter">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-line bg-cream/85 shadow-[0_8px_30px_-18px_rgba(34,26,19,0.35)] backdrop-blur-xl"
            : "border-b border-transparent bg-cream/40 backdrop-blur-sm",
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="grid size-10 place-items-center rounded-full border border-line bg-paper md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <Wordmark />
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active =
                pathname === "/shop" &&
                (item.href === "/shop"
                  ? typeof window !== "undefined" && !window.location.search.includes("category")
                  : false);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative rounded-full px-4 py-2 text-[13.5px] font-medium text-cocoa transition-colors hover:text-ink",
                    active && "text-ink",
                  )}
                >
                  {item.label}
                  <span className="absolute inset-x-4 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-clay transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="group flex h-10 items-center gap-2 rounded-full border border-line bg-paper px-3.5 text-sm text-cocoa transition-all hover:border-ink/30 hover:text-ink"
              aria-label="Search products"
            >
              <Search className="size-4" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded-md border border-line bg-cream px-1.5 py-0.5 text-[10px] font-semibold text-mute lg:inline">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => setOpen(true)}
              className="relative grid size-10 place-items-center rounded-full bg-ink text-cream transition-transform hover:scale-105 active:scale-95"
              aria-label="Open bag"
            >
              <ShoppingBag className="size-[18px]" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-clay px-1 text-[10px] font-bold text-cream ring-2 ring-cream"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[95] bg-ink/45 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-[96] flex w-[86vw] max-w-sm flex-col bg-cream p-6 md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <div className="flex items-center justify-between">
                <Wordmark />
                <button
                  className="grid size-10 place-items-center rounded-full border border-line"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>
              <nav className="mt-10 flex flex-col gap-1">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06 }}
                  >
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between border-b border-line py-4 font-display text-3xl font-medium tracking-tight"
                    >
                      {item.label}
                      <span className="text-clay opacity-0 transition group-hover:opacity-100">→</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <p className="mt-auto text-xs text-mute">
                Bags & little shoes for every kind of day.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
