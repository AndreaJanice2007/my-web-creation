import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { findOrder, type Order } from "@/lib/orders";
import { OrderView } from "@/components/site/OrderView";
import { PageHero } from "@/components/site/Site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/track")({
  head: () => seo("Track My Order", "Check the status of your Pinch of Salt order with your order number and phone."),
  component: Track,
});

function Track() {
  const [num, setNum] = useState("");
  const [phone, setPhone] = useState("");
  const [res, setRes] = useState<Order | null | undefined>(undefined);
  return (
    <>
      <PageHero eyebrow="Order status" title="Track my order">Enter your order number and the mobile number you used.</PageHero>
      <div className="container-page max-w-3xl py-10">
        <form className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={(e) => { e.preventDefault(); setRes(findOrder(num, phone) ?? null); }}>
          <input className="field" placeholder="Order number (POS-…)" value={num} onChange={(e) => setNum(e.target.value)} required />
          <input className="field" placeholder="Mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <button className="btn-primary">Track</button>
        </form>
        <div className="mt-8">
          {res === null && <p className="text-center text-muted-foreground">We couldn't find that order. Check the details, or message us on WhatsApp.</p>}
          {res && <OrderView o={res} />}
        </div>
      </div>
    </>
  );
}
