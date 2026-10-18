import { CheckCircle2, Circle } from "lucide-react";
import { getProduct, formatINR } from "@/lib/products";
import { linePrice, whatsappSummary } from "@/lib/pricing";
import { STATUSES, type Order } from "@/lib/orders";
import { waLink } from "./Site";

export function OrderView({ o }: { o: Order }) {
  const steps = STATUSES.filter((s) => s !== "Cancelled" && (o.method === "pickup" ? s !== "Out for Delivery" : s !== "Ready for Pickup"));
  const idx = steps.indexOf(o.status as (typeof steps)[number]);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-2xl bg-card p-6 shadow-soft sm:grid-cols-2">
        <p><span className="text-sm text-muted-foreground">Order number</span><br /><strong className="text-xl">{o.number}</strong></p>
        <p><span className="text-sm text-muted-foreground">Placed</span><br />{new Date(o.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
        <p><span className="text-sm text-muted-foreground">{o.method === "pickup" ? "Pickup" : "Delivery"}</span><br />{o.date}, {o.slot}{o.address && <><br />{o.address}</>}</p>
        <p><span className="text-sm text-muted-foreground">Payment</span><br />{o.payment} · <strong>{o.paymentStatus}</strong></p>
      </div>
      <ol className="flex flex-wrap gap-4">
        {steps.map((s, i) => (
          <li key={s} className={`flex items-center gap-2 text-sm ${i <= idx ? "text-foreground" : "text-muted-foreground"}`}>
            {i <= idx ? <CheckCircle2 className="h-5 w-5 text-sage" /> : <Circle className="h-5 w-5" />} {s}
          </li>
        ))}
      </ol>
      <div className="rounded-2xl bg-ivory p-6">
        {o.lines.map((l) => <div key={l.key} className="flex justify-between py-1 text-sm"><span>{l.qty} × {getProduct(l.slug)?.name}{l.message && ` — “${l.message}”`}</span><span>{formatINR(linePrice(l))}</span></div>)}
        <div className="mt-3 flex justify-between border-t pt-3 font-semibold"><span>Total</span><span>{formatINR(o.total)}</span></div>
      </div>
      <a className="btn-primary bg-whatsapp" target="_blank" rel="noreferrer" href={waLink(whatsappSummary(o))}>Send order on WhatsApp</a>
      <p className="text-xs text-muted-foreground">Sending a WhatsApp message doesn't mark your order as paid — we'll confirm with you.</p>
    </div>
  );
}
