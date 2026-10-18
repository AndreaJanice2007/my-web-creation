import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, waLink } from "@/components/site/Site";
import { categories } from "@/lib/products";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/custom-cakes")({
  head: () => seo("Custom Cakes", "Personalised celebration cakes from Pinch of Salt, starting at ₹1,299."),
  component: () => (
    <>
      <PageHero eyebrow="Made for your moment" title="Custom celebration cakes">Your flavour, your size, your message — starting at ₹1,299. Please order at least 3 days ahead.</PageHero>
      <div className="container-page grid items-center gap-10 py-14 md:grid-cols-2">
        <img src={categories[0].image} alt="Custom chocolate celebration cake" className="aspect-square w-full rounded-[2rem] object-cover" />
        <div className="space-y-4">
          <ol className="space-y-3 text-muted-foreground">
            <li><strong className="text-foreground">1. Choose a flavour & size</strong> — chocolate, vanilla, red velvet or butterscotch.</li>
            <li><strong className="text-foreground">2. Add your message</strong> — plus candles, toppers and gift packaging.</li>
            <li><strong className="text-foreground">3. Share your idea</strong> — send a reference photo on WhatsApp and we'll confirm design and price.</li>
          </ol>
          <div className="flex flex-wrap gap-3">
            <Link to="/product/$slug" params={{ slug: "custom-celebration-cake" }} className="btn-primary">Start your order</Link>
            <a href={waLink("Hi! I'd like to discuss a custom cake.")} target="_blank" rel="noreferrer" className="btn-outline">Discuss on WhatsApp</a>
          </div>
        </div>
      </div>
    </>
  ),
});
