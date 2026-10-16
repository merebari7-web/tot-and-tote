"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function ConfettiCheck({ orderNumber }: { orderNumber: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <motion.span
          className="absolute inset-0 rounded-full bg-sage/25"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 2.1, opacity: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
        />
        <motion.span
          className="absolute inset-0 rounded-full bg-sage/20"
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1.6, delay: 0.7, ease: "easeOut" }}
        />
        <motion.span
          className="relative grid size-20 place-items-center rounded-full bg-sage text-cream shadow-lg"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
        >
          <Check className="size-9" strokeWidth={3} />
        </motion.span>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.span
            key={i}
            className="absolute size-2 rounded-full"
            style={{
              backgroundColor: ["#D9592B", "#F2B33C", "#8CA378", "#6F97BF", "#E2A3A1", "#221A13"][i],
              left: "50%",
              top: "50%",
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos((i / 6) * Math.PI * 2) * 72,
              y: Math.sin((i / 6) * Math.PI * 2) * 72,
              opacity: 0,
              scale: 0.4,
            }}
            transition={{ duration: 1.1, delay: 0.45, ease: "easeOut" }}
          />
        ))}
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 font-display text-4xl font-semibold tracking-tight sm:text-5xl"
      >
        Order <span className="italic text-clay">wrapped!</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.66, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-3 max-w-md text-[15px] leading-relaxed text-cocoa"
      >
        Order <span className="font-bold text-ink">{orderNumber}</span> is confirmed.
        We&apos;re packing it with tissue paper and a thank-you doodle — a shipping
        email will follow shortly.
      </motion.p>
    </div>
  );
}
