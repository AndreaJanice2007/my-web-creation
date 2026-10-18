import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Prose } from "@/components/site/Site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => seo("Privacy Policy", "How Pinch of Salt handles your personal information."),
  component: () => (
    <>
      <PageHero title="Privacy policy" />
      <Prose>
        <p className="text-xs italic">Sample policy — to be reviewed before launch.</p>
        <p>We collect only what we need to prepare and deliver your order: your name, phone, email (optional) and address.</p>
        <h2>How we use it</h2><p>To confirm, prepare, deliver and support your order. We never sell your information.</p>
        <h2>Payments</h2><p>Card and UPI details are handled by our payment partner and never stored by us.</p>
        <h2>Contact</h2><p>Ask us anytime to view or delete your information.</p>
      </Prose>
    </>
  ),
});
