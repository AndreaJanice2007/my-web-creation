import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Site";
import { seo } from "@/lib/seo";

const faqs = [
  ["How far ahead should I order?", "Most treats need 1 day's notice. Cakes need 2 days and custom cakes 3 days."],
  ["Do you deliver?", "Yes, to selected PIN codes in our service area. Enter your PIN at checkout to check."],
  ["Are your products eggless?", "Our current products contain egg. Ask us on WhatsApp about eggless options — we'll only confirm what we can truly offer."],
  ["How do I pay?", "Pay at pickup, pay on delivery, bank transfer, or coordinate on WhatsApp. Online UPI and card payments are coming soon."],
  ["Can I change or cancel my order?", "Message us at least 24 hours before your slot. See our policies for details."],
  ["How should I store my treats?", "Keep brownies and cookies airtight at room temperature; cakes and cheesecakes refrigerated."],
];

export const Route = createFileRoute("/faq")({
  head: () => seo("FAQs", "Answers to common questions about ordering, delivery and payment at Pinch of Salt."),
  component: () => (
    <>
      <PageHero eyebrow="Help" title="Frequently asked questions" />
      <div className="container-page max-w-3xl divide-y py-10">
        {faqs.map(([q, a]) => (
          <details key={q} className="group py-5">
            <summary className="cursor-pointer list-none font-display text-2xl">{q}</summary>
            <p className="mt-2 text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </>
  ),
});
