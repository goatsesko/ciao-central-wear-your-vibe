import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, PageIntro } from "@/components/site/PageIntro";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — Ciao Central" },
      { name: "description", content: "Meet the people behind Ciao Central." },
      { property: "og:title", content: "Team — Ciao Central" },
      { property: "og:description", content: "The people behind Ciao Central." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <PageIntro eyebrow="The crew" title="Team" />
      <ComingSoon note="Team profiles are coming soon." />
    </>
  ),
});
