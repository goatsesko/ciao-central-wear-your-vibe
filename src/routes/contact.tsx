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
        Contact details are coming soon. For now, find us on social at {STORE.handle}.
      </PageIntro>
      <div className="mx-auto max-w-[1600px] px-4 pb-24 md:px-8">
        <SocialLinks />
      </div>
    </>
  ),
});
