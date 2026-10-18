import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Prose } from "@/components/site/Site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => seo("Terms & Conditions", "Terms for ordering from Pinch of Salt."),
  component: () => (
    <>
      <PageHero title="Terms & conditions" />
      <Prose>
        <p className="text-xs italic">Sample terms — to be reviewed before launch.</p>
        <p>Prices are in Indian Rupees and may change. An order is confirmed once we confirm it with you.</p>
        <h2>Allergens</h2><p>Our kitchen handles wheat, milk, egg and nuts. Please check allergen details before ordering.</p>
        <h2>Images</h2><p>Handmade products may vary slightly from photographs.</p>
      </Prose>
    </>
  ),
});
