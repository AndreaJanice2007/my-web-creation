import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { getProduct, formatINR } from "@/lib/products";
import { totals, earliestDate, isDateAllowed, linePrice } from "@/lib/pricing";
import { business, paymentMethods, rules, type PaymentMethod } from "@/lib/settings";
import { newOrderNumber, saveOrder, type Order } from "@/lib/orders";
import { PageHero } from "@/components/site/Site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/checkout")({
  head: () => seo("Checkout", "Choose pickup or delivery and place your Pinch of Salt order."),
  component: Checkout,
});

function Checkout() {
  const { lines, clear } = useCart();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", phone: "", email: "", address: "", landmark: "", pin: "", date: "", slot: rules.slots[0], notes: "" });
  const [method, setMethod] = useState<"pickup" | "delivery">("pickup");
  const [pay, setPay] = useState<PaymentMethod>("pickup");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const prep = Math.max(24, ...lines.map((l) => getProduct(l.slug)?.prepHours ?? 24));
  const t = totals(lines, method, f.pin);
  const methods = paymentMethods.filter((m) => !(method === "pickup" && m.id === "cod") && !(method === "delivery" && m.id === "pickup"));

  if (!lines.length) return <div className="py-24 text-center"><h1 className="text-4xl">Your bag is empty</h1><Link to="/shop" className="btn-primary mt-6">Shop</Link></div>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const errs: string[] = [];
    if (f.name.trim().length < 2) errs.push("Please enter your full name.");
    if (!/^(\+?91)?[6-9]\d{9}$/.test(f.phone.replace(/[\s-]/g, ""))) errs.push("Please enter a valid Indian mobile number.");
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) errs.push("Please check your email address.");
    if (!isDateAllowed(f.date, prep)) errs.push(`Please choose a date from ${earliestDate(prep)} onwards (not a holiday).`);
    if (method === "delivery") {
      if (f.address.trim().length < 10) errs.push("Please enter your full delivery address.");
      if (t.delivery === null) errs.push("Sorry, we don't deliver to that PIN code yet. Try pickup instead.");
    }
    if (!t.meetsMinimum) errs.push(`Minimum order is ${formatINR(rules.minOrder)}.`);
    const pm = paymentMethods.find((m) => m.id === pay);
    if (!pm?.enabled || !methods.includes(pm)) errs.push("Please choose an available payment method.");
    if (pay === "cod" && t.total > rules.codMaxOrder) errs.push("Pay on delivery is available for orders up to ₹2,000.");
    if (!agree) errs.push("Please accept the policies to continue.");
    setErrors(errs);
    if (errs.length) return window.scrollTo({ top: 0, behavior: "smooth" });
    setBusy(true);
    const order: Order = {
      number: newOrderNumber(), createdAt: new Date().toISOString(), name: f.name.trim(), phone: f.phone, email: f.email || undefined,
      method, address: method === "delivery" ? `${f.address}${f.landmark ? `, near ${f.landmark}` : ""}` : undefined, pin: f.pin || undefined,
      date: f.date, slot: f.slot, notes: f.notes || undefined, payment: pm!.label,
      paymentStatus: pay === "bank" ? "Awaiting verification" : "Unpaid", status: "Pending",
      lines, subtotal: t.subtotal, delivery: t.delivery ?? 0, total: t.total,
    };
    saveOrder(order);
    clear();
    nav({ to: "/order/$number", params: { number: order.number } });
  };

  return (
    <>
      <PageHero title="Checkout" />
      <form onSubmit={submit} className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_380px]" noValidate>
        <div className="space-y-8">
          {errors.length > 0 && <ul role="alert" className="space-y-1 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">{errors.map((x) => <li key={x}>• {x}</li>)}</ul>}
          <section className="space-y-3">
            <h2 className="text-2xl">1. Your details</h2>
            <input className="field" placeholder="Full name *" value={f.name} onChange={set("name")} autoComplete="name" />
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="field" placeholder="Mobile (+91) *" inputMode="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" />
              <input className="field" placeholder="Email (optional)" type="email" value={f.email} onChange={set("email")} autoComplete="email" />
            </div>
          </section>
          <section className="space-y-3">
            <h2 className="text-2xl">2. Pickup or delivery</h2>
            <div className="grid grid-cols-2 gap-3">
              {(["pickup", "delivery"] as const).map((m) => (
                <button type="button" key={m} onClick={() => { setMethod(m); setPay(m === "pickup" ? "pickup" : "cod"); }} className={`rounded-xl border p-4 text-left ${method === m ? "border-primary bg-ivory" : ""}`}>
                  <strong className="capitalize">{m}</strong>
                  <p className="text-xs text-muted-foreground">{m === "pickup" ? business.pickupAddress : "Within our sample service area"}</p>
                </button>
              ))}
            </div>
            {method === "delivery" && (
              <div className="grid gap-3">
                <textarea className="field" placeholder="Full address *" value={f.address} onChange={set("address")} rows={2} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="field" placeholder="Landmark" value={f.landmark} onChange={set("landmark")} />
                  <input className="field" placeholder="PIN code * (try 560038)" inputMode="numeric" maxLength={6} value={f.pin} onChange={set("pin")} />
                </div>
                {f.pin.length === 6 && <p className="text-sm">{t.delivery === null ? "We don't deliver to this PIN code yet." : t.delivery === 0 ? "Free delivery!" : `Delivery fee: ${formatINR(t.delivery)}`}</p>}
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">Date *<input type="date" className="field mt-1" min={earliestDate(prep)} value={f.date} onChange={set("date")} /></label>
              <label className="text-sm">Time slot *<select className="field mt-1" value={f.slot} onChange={set("slot")}>{rules.slots.map((s) => <option key={s}>{s}</option>)}</select></label>
            </div>
            <textarea className="field" placeholder="Order notes (optional)" value={f.notes} onChange={set("notes")} rows={2} />
          </section>
          <section className="space-y-3">
            <h2 className="text-2xl">3. Payment</h2>
            {methods.map((m) => (
              <label key={m.id} className={`flex gap-3 rounded-xl border p-4 ${!m.enabled ? "opacity-50" : pay === m.id ? "border-primary bg-ivory" : ""}`}>
                <input type="radio" name="pay" disabled={!m.enabled} checked={pay === m.id} onChange={() => setPay(m.id)} className="accent-caramel" />
                <span><strong>{m.label}</strong><span className="block text-sm text-muted-foreground">{m.note}</span></span>
              </label>
            ))}
          </section>
          <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 accent-caramel" /> I agree to the <Link to="/policies" className="underline">delivery & refund policies</Link> and <Link to="/terms" className="underline">terms</Link>.</label>
        </div>
        <aside className="h-fit space-y-3 rounded-2xl bg-ivory p-6 lg:sticky lg:top-24">
          <h2 className="text-2xl">Order summary</h2>
          {lines.map((l) => <div key={l.key} className="flex justify-between text-sm"><span>{l.qty} × {getProduct(l.slug)?.name}</span><span>{formatINR(linePrice(l))}</span></div>)}
          <hr />
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatINR(t.subtotal)}</span></div>
          <div className="flex justify-between text-sm"><span>Delivery</span><span>{method === "pickup" ? "Free" : t.delivery === null ? "—" : formatINR(t.delivery)}</span></div>
          <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{formatINR(t.total)}</span></div>
          <button className="btn-primary w-full" disabled={busy}>Place order</button>
        </aside>
      </form>
    </>
  );
}
