import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { getProduct, formatINR } from "@/lib/products";
import { linePrice, totals } from "@/lib/pricing";
import { rules } from "@/lib/settings";
import { PageHero } from "@/components/site/Site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/cart")({
  head: () => seo("Your Bag", "Review the treats in your Pinch of Salt bag."),
  component: Cart,
});

function Cart() {
  const { lines, setQty, remove } = useCart();
  const t = totals(lines, "pickup");
  if (!lines.length)
    return (
      <>
        <PageHero title="Your bag is empty">Nothing sweet in here yet.</PageHero>
        <div className="py-10 text-center"><Link to="/shop" className="btn-primary">Explore the Menu</Link></div>
      </>
    );
  return (
    <>
      <PageHero title="Your bag" />
      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y">
          {lines.map((l) => {
            const p = getProduct(l.slug);
            if (!p) return null;
            const v = p.variants.find((x) => x.id === l.variantId);
            return (
              <li key={l.key} className="flex gap-4 py-5">
                <img src={p.image} alt={p.name} className="h-24 w-24 rounded-xl object-cover" />
                <div className="flex-1">
                  <Link to="/product/$slug" params={{ slug: p.slug }} className="font-display text-xl">{p.name}</Link>
                  <p className="text-sm text-muted-foreground">{v?.label}{l.flavour && ` · ${l.flavour}`}{l.addons.length > 0 && ` · ${l.addons.length} add-on(s)`}</p>
                  {l.message && <p className="text-sm text-muted-foreground">Message: “{l.message}”</p>}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center rounded-full border">
                      <button aria-label="Decrease" className="p-2" onClick={() => setQty(l.key, l.qty - 1)}><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-6 text-center text-sm">{l.qty}</span>
                      <button aria-label="Increase" className="p-2" onClick={() => setQty(l.key, l.qty + 1)}><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <button aria-label="Remove" onClick={() => remove(l.key)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <p className="font-semibold">{formatINR(linePrice(l))}</p>
              </li>
            );
          })}
        </ul>
        <aside className="h-fit rounded-2xl bg-ivory p-6">
          <div className="flex justify-between"><span>Subtotal</span><strong>{formatINR(t.subtotal)}</strong></div>
          <p className="mt-2 text-sm text-muted-foreground">Delivery fee calculated at checkout. Free delivery over {formatINR(rules.freeDeliveryOver)}.</p>
          {!t.meetsMinimum && <p className="mt-3 text-sm text-destructive">Minimum order is {formatINR(rules.minOrder)}.</p>}
          {t.meetsMinimum ? <Link to="/checkout" className="btn-primary mt-6 w-full">Checkout</Link> : <button disabled className="btn-primary mt-6 w-full">Checkout</button>}
        </aside>
      </div>
    </>
  );
}
