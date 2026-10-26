import { InstagramGallery } from "@/components/InstagramGallery";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
const hero = { url: "/images/work/facade.jpg" };
const second = { url: "/images/work/rebar-slab.jpg" };
import logo from "@/assets/logo-light.png";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Iason Savvidis Engineering — Civil Engineer & Architect" },
      { name: "description", content: "Civil engineering and architectural services: structural studies, design, building permits and construction supervision." },
      { property: "og:title", content: "Iason Savvidis Engineering — Civil Engineer & Architect" },
      { property: "og:description", content: "Structural studies, architectural design, permits and supervision." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useLang();
  return (
    <>
      <section className="relative min-h-screen overflow-hidden">
        <img src={hero.url} alt="" className="mono absolute inset-0 h-full w-full object-cover object-center opacity-45" />
        <div className="hero-fade absolute inset-0" />
        <div className="relative mx-auto grid min-h-screen w-full max-w-7xl items-end gap-10 px-6 pb-20 pt-28 lg:grid-cols-[1.1fr_1fr]">
          <div className="animate-rise">
            <img src={logo} alt="Iason Savvidis Engineering logo" width={668} height={538} className="mb-10 h-32 w-auto md:h-44" />
            <p className="label-mono text-primary">■ {t.hero.kicker}</p>
            <h1 className="mt-6 max-w-4xl whitespace-pre-line text-3xl leading-[1.15] sm:text-4xl md:text-5xl">{t.hero.title}</h1>
            <div className="mt-6 h-px w-40 bg-primary/60" />
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">{t.hero.body}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild variant="hero" size="lg" className="h-12 rounded-none">
                <Link to="/contact">{t.hero.cta} <ArrowUpRight /></Link>
              </Button>
              <Button asChild variant="line" size="lg" className="h-12 rounded-none">
                <Link to="/services">{t.hero.cta2}</Link>
              </Button>
            </div>
          </div>
          <div className="group hidden aspect-[4/5] overflow-hidden border border-border lg:block">
            <img src={second.url} alt="Reinforcement of a concrete slab, aerial view" className="mono h-full w-full object-cover" />
          </div>
        </div>
      </section>
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-7xl md:grid-cols-3">
          {t.pillars.map((p) => (
            <div key={p.n} className="group border-b border-border p-10 md:border-b-0 md:border-r last:border-r-0">
              <p className="font-mono text-sm text-primary">{p.n}</p>
              <h3 className="mt-8 text-2xl font-semibold">{p.t}</h3>
              <p className="mt-3 text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </section>
      <InstagramGallery />
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="label-mono text-primary">★★★★★ // {t.info.reviewsTitle}</p>
          <div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-3">
            {t.reviews.map((r) => (
              <blockquote key={r} className="bg-background p-8 text-muted-foreground">“{r}”</blockquote>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
