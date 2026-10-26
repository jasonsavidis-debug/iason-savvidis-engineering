import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageIntro } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { contactSchema, submitContact } from "@/lib/contact.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Iason Savvidis Engineering" },
      { name: "description", content: "Get in touch about your construction, renovation or architectural project." },
      { property: "og:title", content: "Contact — Iason Savvidis Engineering" },
      { property: "og:description", content: "Tell us about your project." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

const field =
  "w-full border-0 border-b border-input bg-transparent px-0 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

function Contact() {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const parsed = contactSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!parsed.success) {
      toast.error(t.contact.err);
      return;
    }
    setLoading(true);
    try {
      await submitContact({ data: parsed.data });
      toast.success(t.contact.ok);
      form.reset();
    } catch {
      toast.error(t.contact.err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageIntro kicker={t.contact.kicker} title={t.contact.title} intro={t.contact.intro} />
      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-8">
          <div>
            <p className="label-mono">// {t.info.address}</p>
            <a href="tel:+306946877588" className="mt-3 block font-display text-3xl font-semibold hover:text-primary">{t.info.phone}</a>
            <a href={`mailto:${t.info.email}`} className="mt-2 block font-mono text-sm text-muted-foreground hover:text-primary">{t.info.email}</a>
            <a href="https://www.instagram.com/engineer.savvidis/" target="_blank" rel="noreferrer" className="mt-1 block font-mono text-sm text-muted-foreground hover:text-primary">@{t.info.instagram}</a>
          </div>
          <div>
            <p className="label-mono">// {t.info.hoursTitle}</p>
            <ul className="mt-3 space-y-1 text-muted-foreground">
              {t.info.hours.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="hero" className="h-11 rounded-none"><a href="tel:+306946877588">{t.info.call}</a></Button>
            <Button asChild variant="line" className="h-11 rounded-none">
              <a href="https://www.google.com/maps/dir/?api=1&destination=40.599759,22.977381" target="_blank" rel="noreferrer">{t.info.directions}</a>
            </Button>
            <Button asChild variant="line" className="h-11 rounded-none">
              <a href="https://www.instagram.com/engineer.savvidis/" target="_blank" rel="noreferrer">{t.info.follow}</a>
            </Button>
          </div>
          <iframe
            title="Map"
            src="https://maps.google.com/maps?q=40.599759,22.977381&z=16&output=embed"
            className="aspect-[4/3] w-full border border-border grayscale invert-[0.9] hue-rotate-180"
            loading="lazy"
          />
        </div>
        <form onSubmit={onSubmit} className="grid content-start gap-8 md:grid-cols-2">
          <input name="name" required maxLength={100} placeholder={t.contact.name} className={field} />
          <input name="email" type="email" required maxLength={255} placeholder={t.contact.email} className={field} />
          <input name="phone" maxLength={40} placeholder={t.contact.phone} className={field} />
          <select name="service" defaultValue="" className={`${field} bg-background`}>
            <option value="">{t.contact.service}</option>
            {t.services.items.map((s) => (
              <option key={s.t} value={s.t}>{s.t}</option>
            ))}
          </select>
          <textarea name="message" required maxLength={2000} rows={5} placeholder={t.contact.message} className={`${field} md:col-span-2 resize-none`} />
          <div className="md:col-span-2">
            <Button type="submit" variant="hero" size="lg" disabled={loading} className="h-12 rounded-none">
              {loading ? t.contact.sending : t.contact.send}
            </Button>
          </div>
        </form>
      </section>
    </>
  );
}
