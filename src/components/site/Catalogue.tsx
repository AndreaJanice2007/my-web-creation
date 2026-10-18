import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { categories, products, type CategorySlug } from "@/lib/products";
import { ProductCard } from "./Site";

export function Catalogue({ category, initialQ = "" }: { category?: CategorySlug; initialQ?: string }) {
  const [q, setQ] = useState(initialQ);
  const [sort, setSort] = useState("popular");
  const [max, setMax] = useState(3000);
  const [inStock, setInStock] = useState(false);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    let l = products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!term || p.name.toLowerCase().includes(term) || p.category.includes(term)) &&
        p.variants[0].price / 100 <= max &&
        (!inStock || p.available),
    );
    if (sort === "asc") l = [...l].sort((a, b) => a.variants[0].price - b.variants[0].price);
    if (sort === "desc") l = [...l].sort((a, b) => b.variants[0].price - a.variants[0].price);
    if (sort === "new") l = [...l].sort((a, b) => b.createdAt - a.createdAt);
    if (sort === "popular") l = [...l].sort((a, b) => b.reviews - a.reviews);
    return l;
  }, [q, sort, max, inStock, category]);

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap gap-2">
        <Link to="/shop" className={`rounded-full border px-4 py-2 text-sm ${!category ? "bg-primary text-primary-foreground" : "hover:bg-ivory"}`}>All</Link>
        {categories.map((c) => (
          <Link key={c.slug} to="/shop/$category" params={{ category: c.slug }} className={`rounded-full border px-4 py-2 text-sm ${category === c.slug ? "bg-primary text-primary-foreground" : "hover:bg-ivory"}`}>{c.name}</Link>
        ))}
      </div>
      <div className="mt-6 grid gap-3 rounded-2xl bg-ivory p-4 sm:grid-cols-2 lg:grid-cols-4">
        <input className="field" placeholder="Search treats…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" />
        <select className="field" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
          <option value="popular">Most popular</option>
          <option value="asc">Price: low to high</option>
          <option value="desc">Price: high to low</option>
          <option value="new">Newest</option>
        </select>
        <label className="flex items-center gap-3 text-sm">Up to ₹{max}
          <input type="range" min={100} max={3000} step={50} value={max} onChange={(e) => setMax(+e.target.value)} className="flex-1 accent-caramel" />
        </label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="accent-caramel" /> Available only</label>
      </div>
      {list.length === 0 ? (
        <div className="py-20 text-center"><p className="font-display text-3xl">No treats match that search.</p><p className="mt-2 text-muted-foreground">Try a different word or clear your filters.</p></div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      )}
    </div>
  );
}
