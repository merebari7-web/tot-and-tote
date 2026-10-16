"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CartLine } from "@/lib/cart";

type AddInput = {
  slug?: string;
  productId?: number;
  size?: string | null;
  color?: string | null;
  qty?: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  ready: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (input: AddInput) => Promise<{ ok: boolean; error?: string }>;
  updateQty: (id: number, qty: number) => Promise<void>;
  removeLine: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const inflight = useRef(0);

  const refresh = useCallback(async () => {
    const token = ++inflight.current;
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (token === inflight.current) setLines(data.lines ?? []);
    } catch {
      /* network hiccup — keep current state */
    } finally {
      if (token === inflight.current) setReady(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const add = useCallback(
    async (input: AddInput) => {
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const data = await res.json();
        if (!res.ok) return { ok: false, error: data.error ?? "Could not add item" };
        setLines(data.lines ?? []);
        setOpen(true);
        return { ok: true };
      } catch {
        return { ok: false, error: "Network error — please try again" };
      }
    },
    [],
  );

  const updateQty = useCallback(async (id: number, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 10) } : l)),
    );
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty }),
      });
      if (res.ok) {
        const data = await res.json();
        setLines(data.lines ?? []);
      }
    } catch {
      /* optimistic state stands */
    }
  }, []);

  const removeLine = useCallback(async (id: number) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
    try {
      const res = await fetch(`/api/cart/${id}`, { method: "DELETE" });
      if (res.ok) {
        const data = await res.json();
        setLines(data.lines ?? []);
      }
    } catch {
      /* optimistic state stands */
    }
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const subtotalCents = lines.reduce((s, l) => s + l.priceCents * l.qty, 0);
    return {
      lines,
      count,
      subtotalCents,
      ready,
      open,
      setOpen,
      add,
      updateQty,
      removeLine,
      refresh,
    };
  }, [lines, ready, open, add, updateQty, removeLine, refresh]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
