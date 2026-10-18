import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ShoppingBag, Search, MessageCircle, Star, Instagram, Facebook } from "lucide-react";
import logoMark from "@/assets/logo-mark.png";
import { categories, formatINR, type Product } from "@/lib/products";
import { business } from "@/lib/settings";
import { useCart } from "@/lib/cart";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="A Pinch of Home home">
      <img src={logoMark} alt="" width={40} height={40} className="h-10 w-10" />
      {!compact && (
        <span className="font-display text-2xl font-semibold leading-none tracking-tight">
          A Pinch <em className="font-normal text-caramel">of</em> Home
        </span>
      )}
    </Link>
  );
}

export const waLink = (text = "Hi A Pinch of Home! I'd like to place an order.") =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`;

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const nav = [
    { to: "/our-story", label: "Our Story" },
    { to: "/custom-cakes", label: "Custom Cakes" },
    { to: "/track", label: "Track Order" },
    { to: "/contact", label: "Contact" },
  ] as const;
  return (
    <>
      <div className="bg-primary py-2 text-center text-xs tracking-wide text-primary-foreground">{business.announcement}</div>
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="container-page flex h-18 items-center justify-between gap-4 py-3">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm lg:flex">
            <div className="group relative">
              <Link to="/shop" className="py-2 hover:text-caramel" activeProps={{ className: "text-caramel" }}>Shop</Link>
              <div className="invisible absolute left-1/2 top-full w-64 -translate-x-1/2 rounded-2xl border bg-card p-3 opacity-0 shadow-lift transition group-hover:visible group-hover:opacity-100">
                <Link to="/shop" className="block rounded-lg px-3 py-2 font-medium hover:bg-ivory">Shop all</Link>
                {categories.map((c) => (
                  <Link key={c.slug} to="/shop/$category" params={{ category: c.slug }} className="block rounded-lg px-3 py-2 hover:bg-ivory">{c.name}</Link>
                ))}
              </div>
            </div>
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="hover:text-caramel" activeProps={{ className: "text-caramel" }}>{n.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <Link to="/shop" search={{ q: "" }} aria-label="Search" className="rounded-full p-2.5 hover:bg-ivory"><Search className="h-5 w-5" /></Link>
            <a href={waLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp us" className="rounded-full p-2.5 text-whatsapp hover:bg-ivory"><MessageCircle className="h-5 w-5" /></a>
            <Link to="/cart" aria-label={`Cart, ${count} items`} className="relative rounded-full p-2.5 hover:bg-ivory">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-caramel px-1 text-[10px] font-bold text-accent-foreground">{count}</span>}
            </Link>
            <button className="rounded-full p-2.5 hover:bg-ivory lg:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t bg-background lg:hidden" onClick={() => setOpen(false)}>
            <div className="container-page grid gap-1 py-4">
              <Link to="/shop" className="rounded-lg px-3 py-3 font-medium hover:bg-ivory">Shop all</Link>
              <div className="grid grid-cols-2 gap-1">
                {categories.map((c) => (
                  <Link key={c.slug} to="/shop/$category" params={{ category: c.slug }} className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-ivory">{c.name}</Link>
                ))}
              </div>
              {nav.map((n) => <Link key={n.to} to={n.to} className="rounded-lg px-3 py-3 hover:bg-ivory">{n.label}</Link>)}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="container-page grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-background"><img src={logoMark} alt="" className="h-8 w-8" /></span>
            <span className="font-display text-2xl">A Pinch of Home</span>
          </div>
          <p className="mt-4 max-w-sm text-sm opacity-80">Small-batch, homemade bakes for everyday indulgence and every celebration in between.</p>
          <form className="mt-6 flex max-w-sm gap-2" onSubmit={(e) => { e.preventDefault(); (e.currentTarget.querySelector("input") as HTMLInputElement).value = ""; alert("Thanks! Newsletter signups will be connected soon."); }}>
            <input type="email" required placeholder="Your email" aria-label="Email for newsletter" className="w-full rounded-full border border-primary-foreground/30 bg-transparent px-4 py-2.5 text-sm placeholder:text-primary-foreground/50" />
            <button className="rounded-full bg-caramel px-5 text-sm font-medium text-accent-foreground">Join</button>
          </form>
        </div>
        <div>
          <h3 className="text-lg">Shop</h3>
          <ul className="mt-4 space-y-2 text-sm opacity-80">
            {categories.map((c) => <li key={c.slug}><Link to="/shop/$category" params={{ category: c.slug }} className="hover:opacity-100">{c.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="text-lg">Help</h3>
          <ul className="mt-4 space-y-2 text-sm opacity-80">
            <li><Link to="/track">Track my order</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/policies">Delivery & refunds</Link></li>
            <li><Link to="/privacy">Privacy policy</Link></li>
            <li><Link to="/terms">Terms & conditions</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg">Visit & contact</h3>
          <ul className="mt-4 space-y-2 text-sm opacity-80">
            <li>{business.phone}</li>
            <li>{business.email}</li>
            <li>{business.hours}</li>
            <li>{business.serviceArea}</li>
            <li><a href={waLink()} target="_blank" rel="noreferrer" className="underline">Chat on WhatsApp</a></li>
          </ul>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Instagram (placeholder)"><Instagram className="h-5 w-5" /></a>
            <a href="#" aria-label="Facebook (placeholder)"><Facebook className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 py-5 text-center text-xs opacity-70">© {new Date().getFullYear()} A Pinch of Home. Contact details shown are placeholders.</div>
    </footer>
  );
}

export function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground" title="Demo rating">
      <Star className="h-3.5 w-3.5 fill-caramel text-caramel" /> {rating.toFixed(1)} <span>({reviews} demo reviews)</span>
    </span>
  );
}

export function ProductCard({ p }: { p: Product }) {
  return (
    <Link to="/product/$slug" params={{ slug: p.slug }} className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden bg-ivory">
        <img src={p.image} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/hero/hero-1.jpg"; }} alt={p.name} loading="lazy" width={600} height={600} className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${p.available ? "" : "opacity-60 grayscale"}`} />
        {p.badge && <span className="absolute left-3 top-3 rounded-full bg-background/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-caramel">{p.badge}</span>}
        {!p.available && <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">Sold out</span>}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="text-xl leading-tight">{p.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{p.short}</p>
        <Stars rating={p.rating} reviews={p.reviews} />
        <div className="mt-auto flex items-end justify-between pt-3">
          <p><span className="text-lg font-semibold">{formatINR(p.variants[0].price)}</span> <span className="text-xs text-muted-foreground">{p.unit}</span></p>
          <span className="rounded-full border border-primary px-3 py-1.5 text-xs font-medium transition group-hover:bg-primary group-hover:text-primary-foreground">View</span>
        </div>
      </div>
    </Link>
  );
}

export function PageHero({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <section className="bg-ivory py-14 md:py-20">
      <div className="container-page max-w-3xl text-center">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-3 text-4xl md:text-6xl">{title}</h1>
        {children && <div className="mt-4 text-muted-foreground">{children}</div>}
      </div>
    </section>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="container-page max-w-3xl space-y-4 py-14 leading-relaxed text-muted-foreground [&_h2]:mt-8 [&_h2]:text-3xl [&_h2]:text-foreground">{children}</div>;
}
