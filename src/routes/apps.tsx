import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, PageIntro } from "@/components/site/PageIntro";

export const Route = createFileRoute("/apps")({
  head: () => ({
    meta: [
      { title: "Apps — Ciao Central" },
      { name: "description", content: "Digital products and apps from the Ciao Central lifestyle universe." },
      { property: "og:title", content: "Apps — Ciao Central" },
      { property: "og:description", content: "Digital products from Ciao Central." },
    ],
  }),
  component: () => (
    <>
      <PageIntro eyebrow="Beyond the wardrobe" title="Apps">The Ciao Central lifestyle, extended into digital.</PageIntro>
      <ComingSoon note="Our apps will live here. Check back soon." />
    </>
  ),
});
