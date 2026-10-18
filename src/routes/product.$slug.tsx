import { createFileRoute, notFound, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, AlertTriangle, Minus, Plus } from "lucide-react";
import { getProduct, getCategory, formatINR } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { Stars } from "@/components/site/Site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const p = getProduct(params.slug);
    if (!p) throw notFound();
    return { slug: p.slug, name: p.name, short: p.short };
  },
  head: ({ loaderData }) => loaderData ? seo(loaderData.name, loaderData.short) : { meta: [{ title: "Unavailable | Pinch of Salt" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => <div className="py-24 text-center"><h1 className="text-4xl">Treat not found</h1><Link to="/shop" className="btn-primary mt-6">Back to shop</Link></div>,
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const p = getProduct(slug)!;
  const cat = getCategory(p.category)!;
  const cart = useCart();
  const nav = useNavigate();
  const [variantId, setVariant] = useState(p.variants[0].id);
  const [qty, setQty] = useState(1);
  const [flavour, setFlavour] = useState(p.flavours?.[0]);
  const [addons, setAddons] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [giftNote, setGiftNote] = useState("");
  const v = p.variants.find((x) => x.id === variantId)!;
  const unit = v.price + (p.addons ?? []).filter((a) => addons.includes(a.id)).reduce((s, a) => s + a.price, 0);

  const add = (go: boolean) => {
    cart.add({ slug: p.slug, variantId, qty, flavour, addons, message: message || undefined, giftNote: giftNote || undefined });
    if (go) nav({ to: "/cart" });
  };

  return (
    <div className="container-page py-8">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shop/$category" params={{ category: cat.slug }}>{cat.name}</Link> / <span className="text-foreground">{p.name}</span>
      </nav>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <img src={p.image} alt={p.name} width={1024} height={1024} className="aspect-square w-full rounded-[2rem] object-cover shadow-soft" />
        <div>
          {p.badge && <p className="eyebrow">{p.badge}</p>}
          <h1 className="mt-2 text-4xl md:text-5xl">{p.name}</h1>
          <div className="mt-2"><Stars rating={p.rating} reviews={p.reviews} /></div>
          <p className="mt-4 text-3xl font-semibold">{formatINR(unit * qty)}</p>
          <p className="mt-4 text-muted-foreground">{p.description}</p>
          <p className="mt-3 flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-caramel" /> Needs {Math.ceil(p.prepHours / 24)} day(s) notice</p>

          {!p.available ? (
            <p className="mt-6 rounded-xl bg-ivory p-4 font-medium">Sold out for now — check back soon or ask us on WhatsApp.</p>
          ) : (
            <div className="mt-6 space-y-5">
              <fieldset>
                <legend className="text-sm font-medium">Size</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.variants.map((x) => (
                    <button key={x.id} onClick={() => setVariant(x.id)} className={`rounded-full border px-4 py-2 text-sm ${x.id === variantId ? "border-primary bg-primary text-primary-foreground" : "hover:bg-ivory"}`}>{x.label} · {formatINR(x.price)}</button>
                  ))}
                </div>
              </fieldset>
              {p.flavours && (
                <label className="block text-sm font-medium">Flavour
                  <select className="field mt-2" value={flavour} onChange={(e) => setFlavour(e.target.value)}>{p.flavours.map((f) => <option key={f}>{f}</option>)}</select>
                </label>
              )}
              {p.addons && (
                <fieldset>
                  <legend className="text-sm font-medium">Add-ons</legend>
                  <div className="mt-2 space-y-2">
                    {p.addons.map((a) => (
                      <label key={a.id} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="accent-caramel" checked={addons.includes(a.id)} onChange={(e) => setAddons(e.target.checked ? [...addons, a.id] : addons.filter((x) => x !== a.id))} />
                        {a.label} (+{formatINR(a.price)})
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
              {p.allowsMessage && <label className="block text-sm font-medium">Message on cake <input className="field mt-2" maxLength={40} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Happy Birthday, Riya!" /></label>}
              {p.allowsGiftNote && <label className="block text-sm font-medium">Gift note <textarea className="field mt-2" maxLength={200} value={giftNote} onChange={(e) => setGiftNote(e.target.value)} /></label>}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-full border">
                  <button aria-label="Decrease" className="p-3" onClick={() => setQty(Math.max(p.minQty, qty - 1))}><Minus className="h-4 w-4" /></button>
                  <span className="w-8 text-center">{qty}</span>
                  <button aria-label="Increase" className="p-3" onClick={() => setQty(Math.min(p.maxQty, qty + 1))}><Plus className="h-4 w-4" /></button>
                </div>
                <button className="btn-primary" onClick={() => add(false)}>Add to bag</button>
                <button className="btn-outline" onClick={() => add(true)}>Buy now</button>
              </div>
              <p className="text-xs text-muted-foreground">Max {p.maxQty} per order.</p>
            </div>
          )}
          <div className="mt-8 space-y-3 rounded-2xl bg-ivory p-5 text-sm">
            <p><strong>Ingredients:</strong> {p.ingredients}</p>
            <p className="flex gap-2"><AlertTriangle className="h-4 w-4 shrink-0 text-caramel" /><span><strong>Allergens:</strong> {p.allergens}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
