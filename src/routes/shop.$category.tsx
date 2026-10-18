import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Catalogue } from "@/components/site/Catalogue";
import { PageHero } from "@/components/site/Site";
import { getCategory } from "@/lib/products";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/shop/$category")({
  loader: ({ params }) => {
    const c = getCategory(params.category);
    if (!c) throw notFound();
    return { slug: c.slug, name: c.name, blurb: c.blurb };
  },
  head: ({ loaderData }) => loaderData ? seo(loaderData.name, `${loaderData.blurb} Homemade ${loaderData.name.toLowerCase()} from A Pinch of Home.`) : { meta: [{ title: "Not found | A Pinch of Home" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => <div className="py-24 text-center"><h1 className="text-4xl">Category not found</h1><Link to="/shop" className="btn-primary mt-6">Shop all</Link></div>,
  component: Cat,
});

function Cat() {
  const c = Route.useLoaderData();
  return (
    <>
      <PageHero eyebrow="Shop" title={c.name}>{c.blurb}</PageHero>
      <Catalogue key={c.slug} category={c.slug} />
    </>
  );
}
