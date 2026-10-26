import logoMark from "@/assets/logo-mark.png";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, Menu, X } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function SiteHeader() {
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: t.nav.home },
    { to: "/services", label: t.nav.services },
    { to: "/about", label: t.nav.about },
    { to: "/advisor", label: t.nav.advisor },
    { to: "/inspect", label: t.nav.inspect },
    { to: "/consult", label: t.nav.consult },
    { to: "/contact", label: t.nav.contact },

  ] as const;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b border-border backdrop-blur-xl ${open ? "bg-background" : "bg-background/70"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <img src={logoMark} alt="" width={40} height={36} className="h-9 w-auto shrink-0" />
          <span className="min-w-0 truncate font-display text-xs font-semibold tracking-tight sm:hidden">{t.brandShort}</span>
          <span className="hidden min-w-0 truncate font-display text-sm font-semibold tracking-tight sm:block">{t.brand}</span>

        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="label-mono transition-colors hover:text-foreground data-[status=active]:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="flex border border-border font-mono text-xs">
            {(["en", "el"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 uppercase transition-colors ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {l === "en" ? "EN" : "ΕΛ"}
              </button>
            ))}
          </div>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-4 border-t border-border bg-background px-6 py-6 md:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="label-mono">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-10 md:flex-row">
        <div>
          <p className="font-display font-semibold">{t.brand}</p>
          <p className="label-mono mt-1">{t.tagline}</p>
          <p className="label-mono mt-3 flex flex-wrap gap-x-4 gap-y-1">
            <a href="tel:+306946877588" className="hover:text-primary">{t.info.phone}</a>
            <a href={`mailto:${t.info.email}`} className="hover:text-primary">{t.info.email}</a>
            <a href="https://www.instagram.com/engineer.savvidis/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-primary"><Instagram className="h-3.5 w-3.5" />@{t.info.instagram}</a>
          </p>
        </div>
        <p className="label-mono self-end">© {new Date().getFullYear()} — {t.footer}</p>
      </div>
    </footer>
  );
}

export function PageIntro({ kicker, title, intro }: { kicker: string; title: string; intro?: string }) {
  return (
    <section className="grid-lines border-b border-border pt-36 pb-20">
      <div className="mx-auto max-w-7xl px-6 animate-rise">
        <p className="label-mono text-primary">// {kicker}</p>
        <h1 className="mt-6 max-w-4xl text-5xl font-semibold md:text-7xl">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{intro}</p>}
      </div>
    </section>
  );
}
