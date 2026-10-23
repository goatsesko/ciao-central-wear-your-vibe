import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/PageIntro";
import { SocialLinks } from "@/components/site/SiteFooter";
import { STORE } from "@/lib/format";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Ciao Central" },
      { name: "description", content: "Get in touch with Ciao Central." },
      { property: "og:title", content: "Contact — Ciao Central" },
      { property: "og:description", content: "Get in touch with Ciao Central." },
    ],
  }),
  component: () => (
    <>
      <PageIntro eyebrow="Say ciao" title="Contact">
        Tap any icon below to open our {STORE.handle} profile — we reply there.
      </PageIntro>
      <div className="mx-auto max-w-[1600px] px-4 pb-24 md:px-8">
        <SocialLinks />
      </div>
    </>
  ),
});
