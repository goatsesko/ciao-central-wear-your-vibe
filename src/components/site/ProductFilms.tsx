import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { productFilms } from "@/lib/product-films";

export function ProductFilms() {
  const [viewportRef, carousel] = useEmblaCarousel({ loop: true });
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    const section = sectionRef.current;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false), { threshold: 0.2 });
    if (section) observer.observe(section);
    return () => { observer.disconnect(); query.removeEventListener("change", update); };
  }, []);

  useEffect(() => {
    if (!carousel) return;
    const update = () => setActive(carousel.selectedScrollSnap());
    update();
    carousel.on("select", update);
    return () => { carousel.off("select", update); };
  }, [carousel]);

  useEffect(() => {
    if (!carousel || paused || reducedMotion || !visible) return;
    const timer = window.setInterval(() => carousel.scrollNext(), 6500);
    return () => window.clearInterval(timer);
  }, [carousel, paused, reducedMotion, visible]);

  return (
    <section ref={sectionRef} className="bg-ink text-ink-foreground" aria-labelledby="product-films-title">
      <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-8 md:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-gold">Ciao Central · Short films</p>
            <h2 id="product-films-title" className="mt-3 text-5xl md:text-7xl">In motion</h2>
          </div>
          <p className="eyebrow text-silver">The product. The details. The vibe.</p>
        </div>
        <div role="region" aria-roledescription="carousel" aria-label="Product short films"
          onFocusCapture={() => setPaused(true)}>
          <div ref={viewportRef} className="overflow-hidden">
            <div className="flex touch-pan-y">
              {productFilms.map((film, index) => (
                <div key={film.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${productFilms.length}: ${film.title}`}
                  aria-hidden={active !== index} className="relative min-w-0 flex-[0_0_100%]">
                  <div className="relative aspect-[4/5] overflow-hidden bg-charcoal md:aspect-[16/9]">
                    {film.videoSrc ? (
                      <video key={active === index ? `${film.id}-active` : film.id} controls playsInline preload="none" poster={film.poster}
                        className="size-full object-contain" tabIndex={active === index ? 0 : -1} onPlay={() => setPaused(true)}>
                        {active === index && <source src={film.videoSrc} />}
                        Your browser does not support video playback.
                      </video>
                    ) : (
                      <>
                        <img src={film.poster} alt={film.alt} loading="lazy" className="size-full object-cover" />
                        <span className="eyebrow absolute left-4 top-4 border border-ink-foreground/30 bg-ink/80 px-3 py-2 text-ink-foreground md:left-8 md:top-8">
                          Preview · Video coming soon
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-ink-foreground/20 py-5">
                    <h3 className="text-2xl md:text-4xl">{film.title}</h3>
                    <span className="eyebrow shrink-0 text-gold">0{index + 1} / 0{productFilms.length}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex gap-1" aria-label="Choose a film">
              {productFilms.map((film, index) => (
                <Button key={film.id} variant="ghost" className="size-11 rounded-none hover:bg-charcoal hover:text-ink-foreground"
                  aria-label={`Show ${film.title}`} aria-pressed={active === index} onClick={() => { setPaused(true); carousel?.scrollTo(index); }}>
                  <span className={`h-0.5 w-6 ${active === index ? "bg-gold" : "bg-silver/40"}`} />
                </Button>
              ))}
            </div>
            <div className="flex gap-1">
              {!reducedMotion && <Button variant="ghost" size="icon" className="size-11 rounded-none hover:bg-charcoal hover:text-ink-foreground"
                aria-label={paused ? "Resume slideshow" : "Pause slideshow"} title={paused ? "Resume slideshow" : "Pause slideshow"}
                onClick={() => setPaused(!paused)}>{paused ? <Play /> : <Pause />}</Button>}
              <Button variant="ghost" size="icon" className="size-11 rounded-none hover:bg-charcoal hover:text-ink-foreground" aria-label="Previous film" title="Previous film"
                onClick={() => { setPaused(true); carousel?.scrollPrev(); }}><ArrowLeft /></Button>
              <Button variant="ghost" size="icon" className="size-11 rounded-none hover:bg-charcoal hover:text-ink-foreground" aria-label="Next film" title="Next film"
                onClick={() => { setPaused(true); carousel?.scrollNext(); }}><ArrowRight /></Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}