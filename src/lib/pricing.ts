import { getProduct, formatINR } from "./products";
import { deliveryZones, rules } from "./settings";

export type CartLine = {
  key: string;
  slug: string;
  variantId: string;
  qty: number;
  flavour?: string;
  addons: string[];
  message?: string;
  giftNote?: string;
};

export function linePrice(line: CartLine): number {
  const p = getProduct(line.slug);
  if (!p) return 0;
  const v = p.variants.find((x) => x.id === line.variantId) ?? p.variants[0];
  const add = (p.addons ?? []).filter((a) => line.addons.includes(a.id)).reduce((s, a) => s + a.price, 0);
  return (v.price + add) * line.qty;
}

export function deliveryFee(pin: string | undefined, subtotal: number): number | null {
  if (!pin) return null;
  const zone = deliveryZones.find((z) => z.pins.includes(pin.trim()));
  if (!zone) return null;
  return subtotal >= rules.freeDeliveryOver ? 0 : zone.fee;
}

export function totals(lines: CartLine[], method: "pickup" | "delivery", pin?: string) {
  const subtotal = lines.reduce((s, l) => s + linePrice(l), 0);
  const fee = method === "pickup" ? 0 : deliveryFee(pin, subtotal);
  return { subtotal, delivery: fee, total: subtotal + (fee ?? 0), meetsMinimum: subtotal >= rules.minOrder };
}

export function validQty(slug: string, qty: number) {
  const p = getProduct(slug);
  return !!p && Number.isInteger(qty) && qty >= p.minQty && qty <= p.maxQty;
}

/** Earliest allowed date (YYYY-MM-DD) in Asia/Kolkata given max prep hours. */
export function earliestDate(prepHours: number, now = new Date()) {
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const days = Math.max(rules.leadDays, Math.ceil(prepHours / 24));
  ist.setDate(ist.getDate() + days);
  return ist.toISOString().slice(0, 10);
}

export function isDateAllowed(date: string, prepHours: number, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  if (rules.blackoutDates.includes(date)) return false;
  const min = earliestDate(prepHours, now);
  const max = new Date(min);
  max.setDate(max.getDate() + rules.bookingWindowDays);
  return date >= min && date <= max.toISOString().slice(0, 10);
}

export function whatsappSummary(o: {
  number: string; name: string; lines: CartLine[]; method: string; date: string; slot: string; total: number; payment: string;
}) {
  const items = o.lines
    .map((l) => {
      const p = getProduct(l.slug);
      const v = p?.variants.find((x) => x.id === l.variantId);
      return `• ${l.qty} × ${p?.name} (${v?.label})${l.flavour ? `, ${l.flavour}` : ""}${l.message ? `, msg: "${l.message}"` : ""} — ${formatINR(linePrice(l))}`;
    })
    .join("\n");
  return `Hello Pinch of Salt! 🧁\nOrder ${o.number}\nName: ${o.name}\n\n${items}\n\n${o.method === "pickup" ? "Pickup" : "Delivery"}: ${o.date}, ${o.slot}\nPayment: ${o.payment}\nTotal: ${formatINR(o.total)}`;
}
