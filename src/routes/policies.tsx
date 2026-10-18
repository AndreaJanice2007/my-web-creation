import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Prose } from "@/components/site/Site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/policies")({
  head: () => seo("Delivery, Pickup & Refund Policies", "Pinch of Salt shipping, pickup, cancellation and refund policies."),
  component: () => (
    <>
      <PageHero title="Delivery, pickup & refunds" />
      <Prose>
        <p className="text-xs italic">Sample policy — to be reviewed by the bakery owner.</p>
        <h2>Pickup</h2><p>Collect your order from our kitchen during your chosen slot. Please bring your order number.</p>
        <h2>Delivery</h2><p>We deliver to selected PIN codes. Fees are shown at checkout; free delivery on orders over ₹1,500.</p>
        <h2>Cancellations</h2><p>Cancel at least 24 hours before your slot for a full refund. Custom cakes cancelled after ingredients are prepared may be partly refundable.</p>
        <h2>Refunds</h2><p>If something isn't right, tell us within 2 hours of receiving your order with a photo, and we'll make it right.</p>
      </Prose>
    </>
  ),
});
