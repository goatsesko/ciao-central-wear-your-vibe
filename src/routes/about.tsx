import { createFileRoute } from "@tanstack/react-router";
import campaign1 from "@/assets/campaign-1.jpg";
import { ComingSoon, PageIntro } from "@/components/site/PageIntro";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Ciao Central" },
      { name: "description", content: "The story behind Ciao Central, a Kenyan streetwear and lifestyle brand." },
      { property: "og:title", content: "Our Story — Ciao Central" },
      { property: "og:description", content: "More than clothes. It's a lifestyle." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <PageIntro eyebrow="Our story" title="More than clothes">Ciao Central is a Kenyan streetwear and lifestyle brand.</PageIntro>
      <div className="mx-auto max-w-[1600px] px-4 pb-16 md:px-8">
        <img src={campaign1} alt="Two friends in Ciao Central tees on a Nairobi street" loading="lazy" className="aspect-[16/9] w-full object-cover" />
      </div>
      <ComingSoon note="The full brand story is being written. Share yours with us and we'll add it here." />
    </>
  ),
});
