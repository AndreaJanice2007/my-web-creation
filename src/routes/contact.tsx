import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, waLink } from "@/components/site/Site";
import { business } from "@/lib/settings";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact Us", "Get in touch with Pinch of Salt for orders, custom cakes and questions."),
  component: Contact,
});

function Contact() {
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  return (
    <>
      <PageHero eyebrow="Say hello" title="Contact us">Questions, custom orders or just a craving? We'd love to hear from you.</PageHero>
      <div className="container-page grid gap-10 py-12 md:grid-cols-2">
        <div className="space-y-3 text-muted-foreground">
          <p><strong className="text-foreground">Phone:</strong> {business.phone}</p>
          <p><strong className="text-foreground">Email:</strong> {business.email}</p>
          <p><strong className="text-foreground">Pickup:</strong> {business.pickupAddress}</p>
          <p><strong className="text-foreground">Hours:</strong> {business.hours}</p>
          <p className="text-xs italic">Contact details are placeholders until the bakery shares real ones.</p>
        </div>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); window.open(waLink(`Hi, I'm ${name}. ${msg}`), "_blank"); }}>
          <input className="field" placeholder="Your name" required value={name} onChange={(e) => setName(e.target.value)} />
          <textarea className="field" rows={5} placeholder="Your message" required value={msg} onChange={(e) => setMsg(e.target.value)} />
          <button className="btn-primary">Send via WhatsApp</button>
        </form>
      </div>
    </>
  );
}
