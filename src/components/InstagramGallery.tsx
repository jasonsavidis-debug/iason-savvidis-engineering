import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import i1 from "@/assets/ig/ig-1.jpg.asset.json";
import i2 from "@/assets/ig/ig-2.jpg.asset.json";
import i3 from "@/assets/ig/ig-3.jpg.asset.json";
import i4 from "@/assets/ig/ig-4.jpg.asset.json";
import i5 from "@/assets/ig/ig-5.jpg.asset.json";
import i6 from "@/assets/ig/ig-6.jpg.asset.json";
import i7 from "@/assets/ig/ig-7.jpg.asset.json";
import i8 from "@/assets/ig/ig-8.jpg.asset.json";
import i9 from "@/assets/ig/ig-9.jpg.asset.json";
import i10 from "@/assets/ig/ig-10.jpg.asset.json";
import i11 from "@/assets/ig/ig-11.jpg.asset.json";
import i12 from "@/assets/ig/ig-12.jpg.asset.json";

const IG = "https://www.instagram.com/engineer.savvidis/";
const posts = [
  [i1, "reel/DbNaQZ-oL7U"], [i5, "p/DXHvJwviDPF"], [i12, "p/DU23pOwCBAa"], [i6, "reel/DWBr3-7iCcu"],
  [i10, "p/DVWAtDHCJwC"], [i11, "p/DVMWqmsiK5Q"], [i7, "reel/DV1HtpzCMiM"], [i4, "reel/DXRdl_bCIib"],
  [i3, "reel/DYSLlxyo-Nt"], [i2, "reel/DYpgvkyoznt"], [i8, "reel/DVvR4TjiJ7b"], [i9, "reel/DVs44g8CPbG"],
] as const;

export function InstagramGallery() {
  const { t } = useLang();
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <p className="label-mono text-primary">// {t.work.kicker}</p>
        <h2 className="mt-4 text-3xl font-semibold md:text-5xl">{t.work.title}</h2>
        <div className="mt-10 grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4">
          {posts.map(([img, path]) => (
            <a key={path} href={IG + path} target="_blank" rel="noreferrer" className="group relative block aspect-square overflow-hidden bg-background">
              <img src={img.url} alt="Iason Savvidis Engineering project" loading="lazy" className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
            </a>
          ))}
        </div>
        <a href={IG} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 font-mono text-sm text-primary hover:underline">
          {t.work.cta} <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
