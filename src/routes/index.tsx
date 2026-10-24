import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import hero from "@/assets/hero.jpg";
import campaign1 from "@/assets/campaign-1.jpg";
import campaign2 from "@/assets/campaign-2.jpg";
import teeBlack from "@/assets/tee-black.jpg";
import denim from "@/assets/denim-black.jpg";
import { productsQuery, type Product } from "@/lib/catalog";
import { ProductGrid } from "@/components/site/ProductCard";
import { SocialLinks } from "@/components/site/SiteFooter";
import { STORE } from "@/lib/format";
import { ProductFilms } from "@/components/site/ProductFilms";
import { PartnerStrip } from "@/components/site/PartnerStrip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ciao Central — Kenyan Streetwear | Wear Your Vibe" },
      { name: "description", content: "Premium Kenyan streetwear and lifestyle. Signature tees, denim and new drops. M-Pesa accepted." },
      { property: "og:title", content: "Ciao Central — Wear Your Vibe" },
      { property: "og:description", content: "More than clothes. It's a lifestyle. Premium Kenyan streetwear." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(productsQuery({ collection: "new", limit: 4 })),
      context.queryClient.ensureQueryData(productsQuery({ collection: "bestseller", limit: 4 })),
    ]),
  component: Home,
});

function Home() {
  const { data: newArrivals } = useSuspenseQuery(productsQuery({ collection: "new", limit: 4 }));
  const { data: bestsellers } = useSuspenseQuery(productsQuery({ collection: "bestseller", limit: 4 }));

  return (
    <>
      <Hero />
      <ProductSection eyebrow="Just landed" title="New Arrivals" products={newArrivals} />
      <Feature
        image={teeBlack}
        eyebrow="Signature Tees"
        title="The everyday uniform"
        body="Heavyweight cotton, oversized cuts, a monogram that speaks quietly."
        to="tees"
      />
      <ProductSection eyebrow="Most wanted" title="Bestsellers" products={bestsellers} />
      <ProductFilms />
      <Feature
        image={denim}
        eyebrow="Denim Collection"
        title="Washed black, built to last"
        body="Overshirts and denim pieces designed for Nairobi days and nights."
        to="denim"
        reverse
      />
      <Gallery />
      <Story />
      <Newsletter />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-6rem)] items-end overflow-hidden bg-ink text-ink-foreground">
      <img
        src={hero}
        alt="Model in a black oversized tee and black denim on a Nairobi rooftop at dusk"
        width={1920}
        height={1088}
        fetchPriority="high"
        className="absolute inset-0 -z-10 size-full object-cover object-[70%_center] opacity-80"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/30 to-transparent" aria-hidden="true" />
      <div className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-8 md:pb-20">
        <p className="eyebrow reveal text-gold">Ciao Central · Nairobi</p>
        <h1 className="reveal mt-4 text-[22vw] md:text-[13vw]" style={{ animationDelay: "120ms" }}>
          Wear your<br />vibe
        </h1>
        <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "260ms" }}>
          <Link to="/shop" className="btn btn-light">Shop the collection <ArrowRight className="size-4" /></Link>
          <Link to="/shop" search={{ sort: "newest" }} className="btn btn-outline-light">Explore new drops</Link>
        </div>
        <Link to="/dress-me" className="btn reveal mt-4 w-full bg-gold text-ink hover:opacity-90 sm:w-auto" style={{ animationDelay: "380ms" }}>
          <Sparkles className="size-4" /> Dress me
        </Link>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, to }: { eyebrow: string; title: string; to?: string }) {
  return (
    <div className="mb-10 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow text-muted-foreground">{eyebrow}</p>
        <h2 className="mt-3 text-5xl md:text-7xl">{title}</h2>
      </div>
      <Link to="/shop" search={to ? { category: to } : {}} className="eyebrow link-underline hidden shrink-0 py-1 sm:block">
        View all
      </Link>
    </div>
  );
}

function ProductSection({ eyebrow, title, products }: { eyebrow: string; title: string; products: Product[] }) {
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 md:py-28">
      <SectionHead eyebrow={eyebrow} title={title} />
      <ProductGrid products={products} />
    </section>
  );
}

function Feature({ image, eyebrow, title, body, to, reverse }: { image: string; eyebrow: string; title: string; body: string; to: string; reverse?: boolean }) {
  return (
    <section className="grid bg-ink text-ink-foreground md:grid-cols-2">
      <div className={`group relative aspect-[4/5] overflow-hidden md:aspect-auto md:min-h-[85vh] ${reverse ? "md:order-2" : ""}`}>
        <img src={image} alt={title} loading="lazy" width={896} height={1152} className="img-zoom absolute inset-0 size-full object-cover group-hover:scale-105" />
      </div>
      <div className="flex flex-col justify-center gap-6 px-6 py-16 md:px-16">
        <p className="eyebrow text-gold">{eyebrow}</p>
        <h2 className="text-6xl md:text-8xl">{title}</h2>
        <p className="max-w-md text-silver">{body}</p>
        <Link to="/shop" search={{ category: to }} className="btn btn-outline-light self-start">Shop {eyebrow}</Link>
      </div>
    </section>
  );
}

function Gallery() {
  const imgs = [
    { src: campaign1, alt: "Two friends in white tees and black denim laughing on a Nairobi street", cls: "md:row-span-2" },
    { src: campaign2, alt: "Close-up of hands fastening a black denim overshirt", cls: "" },
    { src: hero, alt: "Model on a rooftop overlooking the Nairobi skyline", cls: "" },
  ];
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 md:py-28" aria-labelledby="campaign">
      <p className="eyebrow text-muted-foreground">Campaign · Vol. 01</p>
      <h2 id="campaign" className="mt-3 mb-10 text-5xl md:text-7xl">Our streets, our stories</h2>
      <div className="grid gap-4 md:grid-cols-2 md:grid-rows-2">
        {imgs.map((i) => (
          <figure key={i.alt} className={`group overflow-hidden bg-muted ${i.cls}`}>
            <img src={i.src} alt={i.alt} loading="lazy" className="img-zoom size-full min-h-72 object-cover group-hover:scale-105" />
          </figure>
        ))}
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="border-y bg-secondary">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-24 md:grid-cols-[1fr_1.4fr] md:px-8 md:py-32">
        <p className="eyebrow text-muted-foreground">The story</p>
        <div>
          <p className="font-display text-4xl uppercase leading-[1.05] md:text-6xl">
            Born in Nairobi. Made for anyone who moves with intention. <span className="text-muted-foreground">Ciao Central is more than clothes — it's a lifestyle.</span>
          </p>
          <Link to="/about" className="eyebrow link-underline mt-10 inline-block py-1">Read our story →</Link>
        </div>
      </div>
      <PartnerStrip className="mx-auto max-w-[1600px]" />
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-24 text-center md:px-8">
      <p className="eyebrow text-muted-foreground">The list</p>
      <h2 className="mx-auto mt-4 max-w-4xl text-5xl md:text-8xl">First to know. First to wear.</h2>
      <form
        className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("You're on the list. Welcome to Ciao Central.");
          setEmail("");
        }}
      >
        <label htmlFor="nl-email" className="sr-only">Email address</label>
        <input
          id="nl-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="h-12 flex-1 border border-input bg-transparent px-4 text-sm placeholder:text-muted-foreground"
        />
        <button className="btn btn-solid">Sign up</button>
      </form>
      <div className="mt-14">
        <p className="eyebrow mb-4 text-muted-foreground">Follow {STORE.handle}</p>
        <SocialLinks className="justify-center" />
      </div>
    </section>
  );
}
