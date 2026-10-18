import { createFileRoute, Link } from "@tanstack/react-router";
import { Croissant, Leaf, Cake, Truck, Gift, Quote } from "lucide-react";
import { categories, products, heroImage } from "@/lib/products";
import { ProductCard } from "@/components/site/Site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo("A Little Sweetness, Baked with Love", "Homemade brownies, cookies, cupcakes, cheesecakes and celebration cakes from A Pinch of Home. Pickup and delivery in India."),
  component: Home,
});

const reasons = [
  { icon: Croissant, t: "Freshly prepared", d: "Every order baked in small batches, just for you." },
  { icon: Leaf, t: "Thoughtful ingredients", d: "Real butter, good chocolate, no shortcuts." },
  { icon: Cake, t: "Made personal", d: "Messages, flavours and sizes for your occasion." },
  { icon: Truck, t: "Pickup or delivery", d: "Choose a slot that suits your day." },
  { icon: Gift, t: "Packed with care", d: "Boxed to arrive as lovely as it left." },
];

const testimonials = [
  { n: "Ananya R.", t: "The salted caramel brownies disappeared in minutes at our house party. Fudgy perfection." },
  { n: "Karthik M.", t: "Ordered a truffle cake for my mother's birthday — beautiful, and not overly sweet." },
  { n: "Meera S.", t: "The cookie box is my go-to gift now. Lovely packaging and warm, thoughtful service." },
];

function Home() {
  const featured = products.filter((p) => p.featured).slice(0, 8);
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container-page grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div className="animate-rise">
            <p className="eyebrow">Homemade · Small batch · Made to order</p>
            <h1 className="mt-4 text-5xl leading-[1.02] md:text-7xl">A Little Sweetness, <em className="text-caramel">Baked with Love.</em></h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">From fudgy brownies to celebration cakes, discover homemade treats crafted to make your everyday moments a little more special.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary">Shop Our Treats</Link>
              <Link to="/custom-cakes" className="btn-outline">Explore Custom Cakes</Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rotate-2 rounded-[2.5rem] bg-blush/30" />
            <img src={heroImage} alt="Brownies, cupcakes, cookies and a chocolate cake on a rustic table" width={1600} height={1200} className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-lift" />
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex items-end justify-between">
          <div><p className="eyebrow">Shop by category</p><h2 className="mt-2 text-4xl md:text-5xl">Something for every craving</h2></div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {categories.map((c) => (
            <Link key={c.slug} to="/shop/$category" params={{ category: c.slug }} className="group relative aspect-[4/5] overflow-hidden rounded-2xl md:aspect-[4/3]">
              <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/10 to-transparent" />
              <div className="absolute bottom-0 p-4 text-primary-foreground md:p-6">
                <h3 className="text-2xl md:text-3xl">{c.name}</h3>
                <p className="hidden text-sm opacity-85 md:block">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ivory py-20">
        <div className="container-page">
          <p className="eyebrow">Bestsellers</p>
          <h2 className="mt-2 text-4xl md:text-5xl">Our customers' favourites</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      <section className="container-page grid items-center gap-12 py-20 md:grid-cols-2">
        <img src={categories[5].image} alt="A dessert gift box tied with a ribbon" loading="lazy" className="aspect-square w-full rounded-[2rem] object-cover" />
        <div>
          <p className="eyebrow">Our story</p>
          <h2 className="mt-2 text-4xl md:text-5xl">Baked with Heart, Shared with Love.</h2>
          <p className="mt-6 text-muted-foreground">A Pinch of Home celebrates small-batch baking, thoughtful ingredients and comforting flavours — desserts made for everyday indulgences and the special occasions in between. That little pinch of salt? It's what makes the sweet things sing.</p>
          <p className="mt-3 text-xs italic text-muted-foreground">Illustrative brand story — to be replaced with the bakery's own.</p>
          <Link to="/our-story" className="btn-outline mt-8">Read our story</Link>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-6 rounded-[2rem] border bg-card p-8 sm:grid-cols-2 lg:grid-cols-5">
          {reasons.map(({ icon: I, t, d }) => (
            <div key={t}>
              <I className="h-7 w-7 text-caramel" />
              <h3 className="mt-3 text-xl">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-20">
        <p className="eyebrow text-center">Kind words</p>
        <h2 className="mt-2 text-center text-4xl md:text-5xl">Sweet things people say</h2>
        <p className="mt-2 text-center text-xs text-muted-foreground">Sample testimonials for demonstration</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((x) => (
            <figure key={x.n} className="rounded-2xl bg-ivory p-7">
              <Quote className="h-6 w-6 text-caramel" />
              <blockquote className="mt-3 font-display text-xl leading-snug">{x.t}</blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">— {x.n} · ★★★★★</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="container-page">
        <div className="flex items-end justify-between"><h2 className="text-3xl md:text-4xl">From our kitchen</h2><a href="#" className="text-sm underline">@apinchofhome (placeholder)</a></div>
        <div className="mt-6 grid grid-cols-3 gap-2 md:grid-cols-6">
          {[heroImage, ...categories.map((c) => c.image)].slice(0, 6).map((src, i) => (
            <img key={i} src={src} alt="Dessert from A Pinch of Home" loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
          ))}
        </div>
      </section>

      <section className="container-page mt-20">
        <div className="rounded-[2rem] bg-primary px-6 py-16 text-center text-primary-foreground">
          <h2 className="text-4xl md:text-6xl">Your Next Favourite Treat Is Waiting.</h2>
          <Link to="/shop" className="mt-8 inline-flex rounded-full bg-caramel px-8 py-3.5 font-medium text-accent-foreground">Explore the Menu</Link>
        </div>
      </section>
    </>
  );
}
