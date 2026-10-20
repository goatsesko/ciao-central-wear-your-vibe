import type { ReactNode } from "react";

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-[1600px] px-4 pb-12 pt-16 md:px-8 md:pt-24">
      <p className="eyebrow text-muted-foreground">{eyebrow}</p>
      <h1 className="reveal mt-4 text-6xl md:text-9xl">{title}</h1>
      {children && <div className="mt-6 max-w-2xl text-muted-foreground">{children}</div>}
    </section>
  );
}

export function ComingSoon({ note }: { note: string }) {
  return (
    <section className="mx-auto max-w-[1600px] px-4 pb-24 md:px-8">
      <div className="border border-dashed p-10 text-center md:p-20">
        <p className="eyebrow text-gold">Coming soon</p>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{note}</p>
      </div>
    </section>
  );
}
