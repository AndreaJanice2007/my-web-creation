import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/products";
import { ProductCard } from "./Site";

const slides = [
  { img: "/hero/hero-1.jpg", eyebrow: "Homemade · Small batch · Made to order", title: "Homemade Happiness", em: "in Every Bite.", text: "Fudgy brownies, gooey cookies and celebration cakes — baked fresh in our home kitchen.", cta: { to: "/shop", label: "Shop Our Treats" } },
  { img: "/hero/hero-2.jpg", eyebrow: "Fresh every morning", title: "Baked with care,", em: "dusted with love.", text: "Every order is prepared in small batches, just for you.", cta: { to: "/shop/$category", params: { category: "cupcakes" }, label: "Explore Cupcakes" } },
  { img: "/hero/hero-3.jpg", eyebrow: "Gifting made sweet", title: "Dessert boxes", em: "for every occasion.", text: "Beautifully boxed assortments, ready to delight.", cta: { to: "/shop/$category", params: { category: "gift-boxes" }, label: "Shop Gift Boxes" } },
] as const;

export function HeroCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [paused]);
  const go = (d: number) => setI((x) => (x + d + slides.length) % slides.length);
  return (
    <section className="relative h-[78vh] min-h-[520px] overflow-hidden" aria-roledescription="carousel" aria-label="Featured" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {slides.map((s, k) => (
        <div key={s.img} className={`absolute inset-0 transition-opacity duration-1000 ${k === i ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={k !== i}>
          <img src={s.img} alt="" width={1600} height={912} loading={k === 0 ? "eager" : "lazy"} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/45 to-transparent" />
          <div className="container-page absolute inset-0 flex items-center">
            <div className="max-w-xl text-primary-foreground">
              <p className="eyebrow">{s.eyebrow}</p>
              {k === 0 ? <h1 className="mt-4 text-5xl leading-[1.02] md:text-7xl">{s.title} <em className="text-caramel">{s.em}</em></h1>
                : <h2 className="mt-4 text-5xl leading-[1.02] md:text-7xl">{s.title} <em className="text-caramel">{s.em}</em></h2>}
              <p className="mt-6 max-w-md text-lg opacity-90">{s.text}</p>
              <Link {...(s.cta as any)} className="mt-8 inline-flex rounded-full bg-caramel px-8 py-3.5 font-medium text-accent-foreground">{s.cta.label}</Link>
            </div>
          </div>
        </div>
      ))}
      <button aria-label="Previous slide" onClick={() => go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2"><ChevronLeft /></button>
      <button aria-label="Next slide" onClick={() => go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2"><ChevronRight /></button>
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, k) => <button key={k} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className={`h-2.5 rounded-full transition-all ${k === i ? "w-8 bg-caramel" : "w-2.5 bg-background/70"}`} />)}
      </div>
    </section>
  );
}

export function ProductCarousel({ items }: { items: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className="relative mt-10">
      <div ref={ref} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:gap-6 [scrollbar-width:none]">
        {items.map((p) => <div key={p.id} className="w-[70%] shrink-0 snap-start sm:w-[45%] lg:w-[23%]"><ProductCard p={p} /></div>)}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button aria-label="Scroll left" onClick={() => scroll(-1)} className="rounded-full border p-2 hover:bg-background"><ChevronLeft className="h-5 w-5" /></button>
        <button aria-label="Scroll right" onClick={() => scroll(1)} className="rounded-full border p-2 hover:bg-background"><ChevronRight className="h-5 w-5" /></button>
      </div>
    </div>
  );
}
