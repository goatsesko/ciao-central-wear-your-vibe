import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageIntro } from "@/components/site/PageIntro";
import { formatKSh, STORE } from "@/lib/format";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — FAQ, Delivery, Returns & Size Guide | Ciao Central" },
      { name: "description", content: "Ciao Central help: FAQs, delivery in Kenya, returns and size guide." },
      { property: "og:title", content: "Support — Ciao Central" },
      { property: "og:description", content: "FAQs, delivery, returns and size guide." },
    ],
  }),
  component: Support,
});

const SIZE_ROWS = [
  ["S", "96–101", "70"],
  ["M", "102–107", "72"],
  ["L", "108–113", "74"],
  ["XL", "114–119", "76"],
  ["XXL", "120–125", "78"],
];

function Support() {
  return (
    <>
      <PageIntro eyebrow="Help centre" title="Support">
        Draft policies below — placeholders to be confirmed by the Ciao Central team.
      </PageIntro>
      <div className="mx-auto grid max-w-[1600px] gap-16 px-4 pb-24 md:grid-cols-2 md:px-8">
        <section id="faq" aria-labelledby="faq-h">
          <h2 id="faq-h" className="text-4xl">FAQ</h2>
          <Accordion type="single" collapsible className="mt-6">
            <AccordionItem value="pay">
              <AccordionTrigger>How can I pay?</AccordionTrigger>
              <AccordionContent>We accept M-Pesa. More payment options may be added later.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="sample">
              <AccordionTrigger>What does "Sample" mean on a product?</AccordionTrigger>
              <AccordionContent>Sample items are placeholders while the store is being set up.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        <section id="delivery" aria-labelledby="del-h">
          <h2 id="del-h" className="text-4xl">Delivery</h2>
          <p className="mt-6 text-muted-foreground">
            Free delivery on orders over {formatKSh(STORE.freeDeliveryThreshold)}; otherwise {formatKSh(STORE.deliveryFee)}. {STORE.deliveryEstimate}.
          </p>
        </section>
        <section id="returns" aria-labelledby="ret-h">
          <h2 id="ret-h" className="text-4xl">Returns</h2>
          <p className="mt-6 text-muted-foreground">Returns policy coming soon.</p>
        </section>
        <section id="size-guide" aria-labelledby="size-h">
          <h2 id="size-h" className="text-4xl">Size guide</h2>
          <p className="mt-2 text-xs text-muted-foreground">Sample measurements in cm — to be confirmed.</p>
          <table className="mt-6 w-full text-left text-sm">
            <thead className="eyebrow border-b"><tr><th className="py-3">Size</th><th>Chest</th><th>Length</th></tr></thead>
            <tbody>
              {SIZE_ROWS.map(([s, c, l]) => (
                <tr key={s} className="border-b"><td className="py-3 font-semibold">{s}</td><td>{c}</td><td>{l}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
