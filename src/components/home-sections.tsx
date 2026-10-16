"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  HeartHandshake,
  Quote,
  RotateCcw,
  SendHorizontal,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import type { Product } from "@/db/schema";
import { cn, formatPrice } from "@/lib/utils";
import { ProductCard, RatingStars } from "@/components/product-card";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ HERO */

const HERO_VIDEO =
  "https://videos.pexels.com/video-files/3191109/3191109-uhd_4096_2160_25fps.mp4";
const HERO_POSTER =
  "https://images.pexels.com/videos/3191109/free-video-3191109.jpg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200";

export function Hero({ sticker }: { sticker: Product | null }) {
  return (
    <section className="relative overflow-hidden">
      {/* backdrop flourishes */}
      <div className="dotgrid pointer-events-none absolute -left-10 top-24 h-72 w-72 opacity-60" />
      <div className="pointer-events-none absolute -right-32 -top-32 size-[420px] rounded-full bg-clay/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 size-64 rounded-full bg-butter/20 blur-3xl" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-6 select-none text-center font-display text-[16vw] font-bold leading-none tracking-tight text-outline opacity-[0.05]"
      >
        Every Day
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:pb-28 lg:pt-20">
        {/* left — copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-clay/30 bg-paper px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-clay"
          >
            <Sparkles className="size-3.5" />
            The 2026 back-to-school drop is here
          </motion.div>

          <h1 className="mt-6 font-display text-[clamp(2.9rem,7.2vw,5.6rem)] font-semibold leading-[0.98] tracking-tight">
            {["Carry their world.", "And yours, too."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span
                  className={cn("block", i === 1 && "italic text-clay")}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.12 + i * 0.14, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
            className="mt-6 max-w-md text-[15.5px] leading-relaxed text-cocoa"
          >
            Schoolbags built for playground storms, handbags that mean business, and
            little shoes for first big miles. One family-run shop for every kind of day
            your crew has.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.62, ease: EASE }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/shop?category=schoolbags"
              className="group inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3.5 text-sm font-bold text-cream shadow-[0_14px_30px_-10px_rgba(217,89,43,0.6)] transition-all hover:bg-clay-deep hover:shadow-[0_18px_36px_-10px_rgba(180,67,29,0.6)] active:scale-[0.97]"
            >
              Shop schoolbags
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/shop?category=handbags"
              className="group inline-flex items-center gap-2 rounded-full border border-ink/20 bg-paper px-7 py-3.5 text-sm font-bold text-ink transition-all hover:border-ink hover:bg-ink hover:text-cream active:scale-[0.97]"
            >
              Handbags for her
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3"
          >
            {[
              { big: "15,400+", small: "happy families" },
              { big: "4.8 / 5", small: "average rating" },
              { big: "30 days", small: "easy returns" },
            ].map((s) => (
              <div key={s.small}>
                <p className="font-display text-2xl font-semibold">{s.big}</p>
                <p className="text-xs font-medium uppercase tracking-wider text-mute">
                  {s.small}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* right — video arch + floating cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, rotate: 4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
          className="relative mx-auto w-full max-w-[480px]"
        >
          <div className="arch relative overflow-hidden border-[8px] border-paper shadow-[0_40px_80px_-30px_rgba(34,26,19,0.45)]">
            <div className="aspect-[4/5] w-full">
              <video
                className="h-full w-full object-cover"
                src={HERO_VIDEO}
                poster={HERO_POSTER}
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
          </div>

          {/* sparkle */}
          <div className="absolute -left-8 -top-6 animate-spin-slower text-butter">
            <svg width="54" height="54" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 0c.7 6.6 5.4 11.3 12 12-6.6.7-11.3 5.4-12 12-.7-6.6-5.4-11.3-12-12C6.6 11.3 11.3 6.6 12 0z" />
            </svg>
          </div>

          {/* floating product sticker */}
          {sticker && (
            <Link
              href={`/product/${sticker.slug}`}
              className="animate-float absolute -left-10 top-16 hidden w-44 rounded-2xl bg-paper p-3 shadow-[0_20px_50px_-16px_rgba(34,26,19,0.4)] transition hover:shadow-xl sm:block"
              style={{ ["--float-rotate" as string]: "-5deg" }}
            >
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-sand">
                <img src={sticker.image} alt={sticker.name} className="h-full w-full object-cover" />
              </div>
              <p className="mt-2 truncate text-xs font-bold">{sticker.name}</p>
              <p className="text-[11px] font-semibold text-clay">
                {formatPrice(sticker.priceCents)}
                <span className="ml-1 font-medium text-mute">beeps of joy included</span>
              </p>
            </Link>
          )}

          {/* floating review card */}
          <div
            className="animate-float-delayed absolute -bottom-6 -right-4 w-48 rounded-2xl bg-ink p-4 text-cream shadow-[0_20px_50px_-16px_rgba(34,26,19,0.5)] sm:-right-8"
            style={{ ["--float-rotate" as string]: "3deg" }}
          >
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-butter text-butter" />
              ))}
            </div>
            <p className="mt-2 text-[13px] font-semibold leading-snug">
              “Survived a full year of recess. Still going strong.”
            </p>
            <p className="mt-1.5 text-[11px] text-cream/60">Priya · mum of three</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ TICKER */

export function Ticker() {
  const items = ["SCHOOLBAGS", "HANDBAGS", "LITTLE SHOES", "SINCE 2019", "FAMILY-RUN", "30-DAY RETURNS"];
  return (
    <div className="relative -rotate-1 overflow-hidden border-y border-ink/10 bg-ink py-4 text-cream shadow-sm">
      <div className="flex w-max animate-marquee-slow items-center gap-10">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center gap-10" aria-hidden={dup === 1}>
            {items.map((item) => (
              <span
                key={item}
                className="flex items-center gap-10 font-display text-lg italic tracking-wide"
              >
                {item}
                <span className="text-clay not-italic">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- CATEGORIES */

type CategoryMeta = {
  slug: string;
  name: string;
  label: string;
  blurb: string;
  image: string;
  accent: string;
};

export function CategoryShowcase({
  categories,
  counts,
}: {
  categories: readonly CategoryMeta[];
  counts: Record<string, number>;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
            The three aisles
          </p>
          <h2 className="mt-2 max-w-lg font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Pick a lane, <span className="italic text-clay">stay a while</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-paper px-5 py-2.5 text-sm font-bold transition hover:border-ink hover:bg-ink hover:text-cream"
          >
            Shop everything
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>

      <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
        {categories.map((cat, i) => (
          <StaggerItem key={cat.slug}>
            <Link
              href={`/shop?category=${cat.slug}`}
              className={cn(
                "group relative block overflow-hidden shadow-sm transition-shadow duration-500 hover:shadow-[0_30px_60px_-24px_rgba(34,26,19,0.45)]",
                i === 0 && "arch",
                i === 1 && "rounded-[2rem]",
                i === 2 && "rounded-[2rem] rounded-tr-[7rem]",
              )}
            >
              <div className="h-[26rem] w-full overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

              <span
                className="absolute left-5 top-5 rounded-full bg-paper px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em]"
                style={{ color: cat.accent }}
              >
                {cat.label}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h3 className="font-display text-3xl font-semibold text-cream">
                      {cat.name}
                    </h3>
                    <p className="mt-1.5 max-w-[16rem] text-[13px] leading-relaxed text-cream/70">
                      {cat.blurb}
                    </p>
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-cream/60">
                      {counts[cat.slug] ?? 0} pieces
                    </p>
                  </div>
                  <span className="grid size-12 shrink-0 translate-y-2 place-items-center rounded-full bg-clay text-cream opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* --------------------------------------------------------- FEATURED SHELF */

export function FeaturedShelf({ products }: { products: Product[] }) {
  const [tab, setTab] = useState<string>("all");
  const filtered = useMemo(
    () => (tab === "all" ? products : products.filter((p) => p.category === tab)),
    [products, tab],
  );

  const tabs = [
    { key: "all", label: "Everything" },
    { key: "schoolbags", label: "Schoolbags" },
    { key: "handbags", label: "Handbags" },
    { key: "shoes", label: "Little Shoes" },
  ];

  return (
    <section className="relative overflow-hidden bg-sand/60 py-20 lg:py-28">
      <div className="dotgrid pointer-events-none absolute right-8 top-10 h-56 w-56 opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
              Fresh on the shelf
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Hand-picked <span className="italic text-clay">this week</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-bold transition-all active:scale-95",
                  tab === t.key
                    ? "bg-ink text-cream shadow-md"
                    : "border border-line bg-paper text-cocoa hover:border-ink/40",
                )}
              >
                {t.label}
              </button>
            ))}
          </Reveal>
        </div>

        <motion.div layout className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ PERKS */

const PERKS = [
  {
    icon: Truck,
    title: "Free shipping over $75",
    sub: "Fast, trackable, carbon-aware delivery.",
  },
  {
    icon: RotateCcw,
    title: "30-day easy returns",
    sub: "Changed your mind? No drama, no fees.",
  },
  {
    icon: ShieldCheck,
    title: "2-year stitch guarantee",
    sub: "Loose thread? We repair it for free.",
  },
  {
    icon: HeartHandshake,
    title: "Family-run support",
    sub: "Real humans who know every product.",
  },
];

export function Perks() {
  return (
    <section className="bg-ink py-14 text-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {PERKS.map((perk, i) => (
          <Reveal key={perk.title} delay={i * 0.08}>
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-clay/15 text-clay">
                <perk.icon className="size-5" />
              </span>
              <div>
                <h3 className="text-[15px] font-bold">{perk.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-cream/55">{perk.sub}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ STORY */

const STORY_IMG_MAIN =
  "https://images.pexels.com/photos/8457625/pexels-photo-8457625.jpeg?auto=compress&cs=tinysrgb&w=1000";
const STORY_IMG_SMALL =
  "https://images.pexels.com/photos/8617519/pexels-photo-8617519.jpeg?auto=compress&cs=tinysrgb&w=700";

export function Story() {
  return (
    <section id="story" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="arch overflow-hidden border-[8px] border-paper shadow-[0_30px_70px_-28px_rgba(34,26,19,0.4)]">
            <img
              src={STORY_IMG_MAIN}
              alt="Children walking together with backpacks"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div
            className="animate-float absolute -bottom-10 -right-4 hidden w-52 overflow-hidden rounded-3xl border-[6px] border-paper shadow-xl sm:block"
            style={{ ["--float-rotate" as string]: "4deg" }}
          >
            <img
              src={STORY_IMG_SMALL}
              alt="Schoolgirls walking and laughing"
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="absolute -left-5 top-8 -rotate-6 rounded-full bg-butter px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-ink shadow-md">
            Since 2019
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">Our story</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-[3.4rem]">
              One shop for the whole crew&apos;s{" "}
              <span className="italic text-clay">comings &amp; goings</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-[15.5px] leading-relaxed text-cocoa">
              It started at our kitchen table: three kids needing schoolbags that
              wouldn&apos;t give up by October, and one mum tired of handbags that
              couldn&apos;t hold actual life. So we found makers who care about the
              small things — bar-tacked straps, veggie-tanned leather, soles that
              bend like feet do.
            </p>
            <p className="mt-4 text-[15.5px] leading-relaxed text-cocoa">
              Every piece is worn, stuffed, dragged and dropped by our own family
              before it earns a spot on the shelf. If it survives us, it&apos;ll
              survive you.
            </p>
          </Reveal>

          <Stagger className="mt-9 grid grid-cols-3 gap-4">
            {[
              { big: "15,342", small: "orders shipped" },
              { big: "96%", small: "five-star reviews" },
              { big: "3", small: "generations shopping" },
            ].map((s) => (
              <StaggerItem key={s.small}>
                <div className="rounded-2xl border border-line bg-paper p-4 text-center">
                  <p className="font-display text-2xl font-semibold text-clay sm:text-3xl">
                    {s.big}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-mute">
                    {s.small}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.15}>
            <Link
              href="/shop"
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-cream transition-all hover:bg-clay active:scale-[0.97]"
            >
              Meet the shelf
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ TESTIMONIALS */

const TESTIMONIALS = [
  {
    quote:
      "The Atlas backpack outlasted two school years, one camping trip and a very enthusiastic golden retriever. Buying a second for the little one.",
    name: "Priya Nair",
    role: "Mum of three",
    initials: "PN",
    tone: "bg-clay",
    rotate: "-rotate-2",
  },
  {
    quote:
      "My Sienna tote carries a laptop, three snack bars, a dinosaur and my dignity. Two years daily and the leather just keeps getting prettier.",
    name: "Dana Whitfield",
    role: "Architect & mum",
    initials: "DW",
    tone: "bg-blues",
    rotate: "rotate-1",
  },
  {
    quote:
      "Both kids went from velcro battles to 'I've got it, mum!' in one morning. The First Sprints are the only shoes they race to put on.",
    name: "Marcus Bell",
    role: "Dad of twins",
    initials: "MB",
    tone: "bg-sage",
    rotate: "-rotate-1",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <Reveal className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
          Doorstep reviews
        </p>
        <h2 className="mx-auto mt-2 max-w-xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Loved by lunchbox packers <span className="italic text-clay">&amp; laptop carriers</span>
        </h2>
      </Reveal>

      <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <StaggerItem key={t.name}>
            <figure
              className={cn(
                "relative h-full rounded-3xl border border-line bg-paper p-7 shadow-sm transition-transform duration-500 hover:rotate-0 hover:shadow-lg",
                t.rotate,
              )}
            >
              <span className="absolute -top-2.5 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 rounded-sm bg-sand/90 shadow-sm" />
              <Quote className="size-6 text-clay" />
              <blockquote className="mt-4 text-[15px] leading-relaxed text-ink">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-full text-sm font-bold text-cream",
                    t.tone,
                  )}
                >
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-xs text-mute">{t.role}</p>
                </div>
                <RatingStars rating={5} className="ml-auto" size="size-3" />
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* -------------------------------------------------------------- NEWSLETTER */

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setError("Network error — try again");
      setState("idle");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-clay px-6 py-16 text-center text-cream sm:px-16">
          <div className="dotgrid pointer-events-none absolute left-8 top-8 h-40 w-40 opacity-20" />
          <div className="absolute -right-10 -top-10 size-56 rounded-full bg-butter/25 blur-2xl" />
          <div className="absolute -bottom-16 -left-10 size-64 rounded-full bg-ink/10 blur-2xl" />

          <p className="relative text-xs font-bold uppercase tracking-[0.24em] text-butter">
            The Outgrow Club
          </p>
          <h2 className="relative mx-auto mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            They&apos;ll outgrow the shoes. <span className="italic">Not the good stuff.</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-[15px] text-cream/85">
            New drops, secret sales and a friendly nudge when it&apos;s time for the
            next size up. Once a month, no clutter.
          </p>

          {state === "done" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative mx-auto mt-8 inline-flex items-center gap-2.5 rounded-full bg-cream px-6 py-3.5 text-sm font-bold text-ink"
            >
              <span className="grid size-6 place-items-center rounded-full bg-sage text-cream">
                <Check className="size-3.5" />
              </span>
              You&apos;re in! First treat lands soon.
            </motion.div>
          ) : (
            <form
              onSubmit={submit}
              className="relative mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full bg-cream/15 p-2 backdrop-blur"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent px-4 py-2.5 text-sm text-cream outline-none placeholder:text-cream/60"
              />
              <button
                type="submit"
                disabled={state === "sending"}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-cream transition hover:bg-cream hover:text-ink disabled:opacity-60"
              >
                {state === "sending" ? "Joining…" : "Join the club"}
                <SendHorizontal className="size-3.5" />
              </button>
            </form>
          )}
          {error && <p className="relative mt-3 text-xs font-semibold text-cream">{error}</p>}
        </div>
      </Reveal>
    </section>
  );
}
