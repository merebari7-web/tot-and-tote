import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  Boxes,
  Package,
  Receipt,
  ShoppingBag,
  TriangleAlert,
} from "lucide-react";
import { getAdminOverview } from "@/lib/data";
import { cn, formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Store dashboard",
  description: "Tot & Tote store overview.",
};

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-butter/25 text-[#8a5a00]",
  shipped: "bg-blues/15 text-blues",
  fulfilled: "bg-sage/15 text-sage",
};

function relativeDay(date: Date): string {
  const days = Math.round((Date.now() - new Date(date).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function AdminPage() {
  const overview = await getAdminOverview();
  const maxDay = Math.max(...overview.revenueByDay.map((d) => d.total), 1);

  const stats = [
    {
      icon: Banknote,
      label: "Lifetime revenue",
      value: formatPrice(overview.revenueCents),
      sub: `${overview.ordersCount} orders`,
    },
    {
      icon: ShoppingBag,
      label: "Orders",
      value: String(overview.ordersCount),
      sub: "across all time",
    },
    {
      icon: Receipt,
      label: "Average order",
      value: formatPrice(overview.avgOrderCents),
      sub: "per basket",
    },
    {
      icon: Package,
      label: "Units sold",
      value: String(overview.unitsSold),
      sub: `${overview.productsCount} products live`,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-clay">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-sage" />
            </span>
            Live store
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Store <span className="italic text-clay">command</span>
          </h1>
        </div>
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2 rounded-full border border-line bg-paper px-5 py-2.5 text-sm font-bold transition hover:border-ink hover:bg-ink hover:text-cream"
        >
          View storefront
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* stats */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-line bg-paper p-6 transition-shadow hover:shadow-md"
          >
            <span className="grid size-11 place-items-center rounded-2xl bg-clay/10 text-clay">
              <stat.icon className="size-5" />
            </span>
            <p className="mt-4 font-display text-3xl font-semibold tracking-tight">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-cocoa">
              {stat.label}
            </p>
            <p className="text-[11px] text-mute">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr,1fr]">
        {/* revenue chart */}
        <div className="rounded-3xl border border-line bg-paper p-6 sm:p-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold">Revenue by day</h2>
            <span className="text-xs font-semibold text-mute">last {overview.revenueByDay.length} days</span>
          </div>
          <div className="mt-8 flex h-44 items-end gap-2 sm:gap-3">
            {overview.revenueByDay.map((day) => (
              <div key={day.day} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[10px] font-bold text-cocoa opacity-0 transition group-hover:opacity-100">
                  {formatPrice(day.total)}
                </span>
                <div
                  className="w-full max-w-12 rounded-t-xl bg-gradient-to-t from-clay to-clay/70 transition-all group-hover:from-ink group-hover:to-ink/80"
                  style={{ height: `${Math.max(6, (day.total / maxDay) * 100)}%` }}
                  title={`${day.day}: ${formatPrice(day.total)}`}
                />
                <span className="w-full truncate text-center text-[9.5px] font-semibold text-mute">
                  {day.day}
                </span>
              </div>
            ))}
            {overview.revenueByDay.length === 0 && (
              <p className="w-full self-center text-center text-sm text-mute">
                Orders placed today will appear here.
              </p>
            )}
          </div>
        </div>

        {/* low stock */}
        <div className="rounded-3xl border border-line bg-paper p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
              <Boxes className="size-5 text-clay" /> Low stock
            </h2>
            <span className="text-xs font-semibold text-mute">≤ 20 units</span>
          </div>
          <ul className="mt-6 space-y-4">
            {overview.lowStock.map((p) => (
              <li key={p.id} className="flex items-center gap-3.5">
                <span className="block h-12 w-11 shrink-0 overflow-hidden rounded-xl bg-sand">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{p.name}</p>
                  <p className="text-[11px] capitalize text-mute">{p.category}</p>
                </div>
                <span
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
                    p.stock <= 15 ? "bg-clay/15 text-clay" : "bg-butter/20 text-[#8a5a00]",
                  )}
                >
                  {p.stock <= 15 && <TriangleAlert className="size-3" />}
                  {p.stock} left
                </span>
              </li>
            ))}
            {overview.lowStock.length === 0 && (
              <p className="text-sm text-mute">Every shelf is well stocked. Nice.</p>
            )}
          </ul>
        </div>
      </div>

      {/* recent orders */}
      <div className="mt-8 overflow-hidden rounded-3xl border border-line bg-paper">
        <div className="flex items-center justify-between px-6 py-5 sm:px-8">
          <h2 className="font-display text-2xl font-semibold">Recent orders</h2>
          <span className="text-xs font-semibold text-mute">
            {overview.ordersCount} total
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-y border-line bg-sand/50 text-[10.5px] uppercase tracking-[0.16em] text-cocoa">
                <th className="px-6 py-3 font-bold sm:px-8">Order</th>
                <th className="px-4 py-3 font-bold">Customer</th>
                <th className="px-4 py-3 font-bold">City</th>
                <th className="px-4 py-3 font-bold">Placed</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-6 py-3 text-right font-bold sm:px-8">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {overview.recentOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-cream/70">
                  <td className="px-6 py-4 font-bold sm:px-8">{order.orderNumber}</td>
                  <td className="px-4 py-4">
                    <p className="font-semibold">
                      {order.firstName} {order.lastName}
                    </p>
                    <p className="text-xs text-mute">{order.email}</p>
                  </td>
                  <td className="px-4 py-4 text-cocoa">{order.city}</td>
                  <td className="px-4 py-4 text-cocoa">{relativeDay(order.createdAt)}</td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-[11px] font-bold capitalize",
                        STATUS_STYLES[order.status] ?? "bg-sand text-cocoa",
                      )}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold sm:px-8">
                    {formatPrice(order.totalCents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
