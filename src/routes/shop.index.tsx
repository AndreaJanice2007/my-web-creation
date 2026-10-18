import { createFileRoute } from "@tanstack/react-router";
import { Catalogue } from "@/components/site/Catalogue";
import { PageHero } from "@/components/site/Site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/shop/")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : undefined }),
  head: () => seo("Shop All Treats", "Browse every homemade cake, brownie, cookie, cupcake, cheesecake and gift box from A Pinch of Home."),
  component: Shop,
});

function Shop() {
  const { q } = Route.useSearch();
  return (
    <>
      <PageHero eyebrow="The menu" title="Shop all treats">Freshly baked to order — pick a favourite or discover a new one.</PageHero>
      <Catalogue initialQ={q ?? ""} />
    </>
  );
}
