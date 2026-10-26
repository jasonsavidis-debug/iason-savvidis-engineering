import { createFileRoute } from "@tanstack/react-router";
const office = { url: "/images/work/office.jpeg" };
import { PageIntro } from "@/components/SiteHeader";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Iason Savvidis Engineering" },
      { name: "description", content: "A civil engineering and architecture practice focused on precise, efficient and timeless design." },
      { property: "og:title", content: "About — Iason Savvidis Engineering" },
      { property: "og:description", content: "Engineering with clarity: precision, integrity, innovation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  const { t } = useLang();
  return (
    <>
      <PageIntro kicker={t.about.kicker} title={t.about.title} />
      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-2">
        <div className="space-y-6 text-lg text-muted-foreground">
          <p className="text-2xl text-foreground">{t.about.p1}</p>
          <p>{t.about.p2}</p>
        </div>
        <img src={office.url} alt={t.about.photoAlt} loading="lazy" className="mono max-h-[640px] w-full border border-border object-cover" />
      </section>
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-7xl md:grid-cols-3">
          {t.about.values.map((v) => (
            <div key={v.t} className="border-b border-border p-10 md:border-b-0 md:border-r last:border-r-0">
              <h3 className="text-2xl font-semibold text-primary">{v.t}</h3>
              <p className="mt-3 text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
