import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, PageIntro } from "@/components/site/PageIntro";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — Ciao Central" },
      { name: "description", content: "Meet the people behind Ciao Central." },
      { property: "og:title", content: "Team — Ciao Central" },
      { property: "og:description", content: "The people behind Ciao Central." },
    ],
  }),
  component: () => (
    <>
      <PageIntro eyebrow="The crew" title="Team" />
      <ComingSoon note="Team profiles are coming soon." />
    </>
  ),
});
