import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/SiteHeader";
import { useLang } from "@/lib/i18n";
import rebar from "@/assets/work/rebar-slab.jpg.asset.json";
import steel from "@/assets/work/steel-frame.jpg.asset.json";
import render from "@/assets/work/render.jpg.asset.json";
import facade from "@/assets/work/facade.jpg.asset.json";
import excavation from "@/assets/work/excavation.jpg.asset.json";
import aerial from "@/assets/work/aerial-land.jpg.asset.json";
import drone from "@/assets/work/drone.jpg.asset.json";
import smallScale from "@/assets/work/small-scale.jpeg.asset.json";
import legalization from "@/assets/work/legalization.jpeg.asset.json";
import identity from "@/assets/work/building-identity.jpeg.asset.json";
import shop from "@/assets/work/health-shop.jpeg.asset.json";
import silos from "@/assets/work/industrial-silos.jpeg.asset.json";
import industrialRoof from "@/assets/work/industrial-roof.jpeg.asset.json";

// index matches t.services.items order
const photos: Record<number, { url: string }[]> = {
  0: [rebar, steel],
  1: [render],
  2: [facade, excavation],
  3: [smallScale],
  4: [legalization],
  5: [identity],
  6: [shop],
  7: [aerial, drone],
  8: [silos, industrialRoof],
};

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Iason Savvidis Engineering" },
      { name: "description", content: "Structural studies, architectural design, building permits, supervision, renovation and legalization services." },
      { property: "og:title", content: "Services — Iason Savvidis Engineering" },
      { property: "og:description", content: "Complete civil engineering and architectural services." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Services,
});

function Services() {
  const { t } = useLang();
  return (
    <>
      <PageIntro kicker={t.services.kicker} title={t.services.title} intro={t.services.intro} />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((s, i) => (
            <div key={s.t} className="group bg-background transition-colors hover:bg-card">
              {photos[i] && (
                <div className="grid aspect-[4/3] auto-cols-fr grid-flow-col gap-px overflow-hidden bg-border">
                  {photos[i].map((p) => (
                    <img key={p.url} src={p.url} alt={s.t} loading="lazy" className="mono h-full min-w-0 w-full object-cover" />
                  ))}
                </div>
              )}
              <div className="p-10">
                <p className="font-mono text-xs text-muted-foreground group-hover:text-primary">
                  {String(i + 1).padStart(2, "0")} /
                </p>
                <h3 className="mt-6 text-2xl">{s.t}</h3>
                <p className="mt-4 text-muted-foreground">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
