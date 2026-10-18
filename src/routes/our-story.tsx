import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Prose } from "@/components/site/Site";
import { heroImage } from "@/lib/products";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/our-story")({
  head: () => seo("Our Story", "How Pinch of Salt began — small-batch, homemade baking made with heart."),
  component: () => (
    <>
      <PageHero eyebrow="Our story" title="Baked with Heart, Shared with Love." />
      <div className="container-page max-w-4xl pt-10"><img src={heroImage} alt="Freshly baked treats in our kitchen" className="aspect-[16/9] w-full rounded-[2rem] object-cover" /></div>
      <Prose>
        <p className="text-xs italic">Illustrative story — to be replaced with the bakery's own words.</p>
        <p>Pinch of Salt began in a home kitchen with a simple belief: the best desserts are made slowly, in small batches, by people who love making them.</p>
        <h2>Why "a pinch of salt"?</h2>
        <p>A tiny pinch of salt makes chocolate deeper, caramel richer and sweetness more balanced. It's the little detail that makes everything taste more like itself — and that's how we bake.</p>
        <h2>Made to order</h2>
        <p>Nothing sits on a shelf. Every brownie, cookie and cake is baked for your order, packed with care and handed over fresh.</p>
        <Link to="/shop" className="btn-primary">Explore the Menu</Link>
      </Prose>
    </>
  ),
});
