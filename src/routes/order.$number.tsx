import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadOrders, type Order } from "@/lib/orders";
import { OrderView } from "@/components/site/OrderView";
import { PageHero } from "@/components/site/Site";

export const Route = createFileRoute("/order/$number")({
  head: () => ({ meta: [{ title: "Order confirmed | Pinch of Salt" }, { name: "robots", content: "noindex" }, { name: "description", content: "Your Pinch of Salt order confirmation." }, { property: "og:title", content: "Order confirmed | Pinch of Salt" }, { property: "og:description", content: "Your order confirmation." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Confirm,
});

function Confirm() {
  const { number } = Route.useParams();
  const [o, setO] = useState<Order | null | undefined>(undefined);
  useEffect(() => setO(loadOrders().find((x) => x.number === number) ?? null), [number]);
  if (o === undefined) return <div className="py-24" />;
  if (!o) return <div className="py-24 text-center"><h1 className="text-4xl">Order not found on this device</h1><Link to="/track" className="btn-primary mt-6">Track an order</Link></div>;
  return (
    <>
      <PageHero eyebrow="Thank you" title={`We've got your order, ${o.name.split(" ")[0]}!`}>We'll confirm it on WhatsApp or by phone shortly. Keep your order number handy to track it.</PageHero>
      <div className="container-page max-w-3xl py-10"><OrderView o={o} /></div>
    </>
  );
}
