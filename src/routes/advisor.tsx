import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowUpRight, Sparkles, Square } from "lucide-react";
import { PageIntro } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/advisor")({
  head: () => ({
    meta: [
      { title: "Project Advisor — Iason Savvidis Engineering" },
      { name: "description", content: "Describe your property or project and get suggested engineering services and next steps." },
      { property: "og:title", content: "Project Advisor — Iason Savvidis Engineering" },
      { property: "og:description", content: "Instant guidance on permits, studies and legalization for your property in Thessaloniki." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Advisor,
});

function Advisor() {
  const { t, lang } = useLang();
  const a = t.advisor;
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const ctrl = useRef<AbortController | null>(null);

  async function run() {
    if (text.trim().length < 10) { setErr(a.tooShort); return; }
    setErr(""); setOut(""); setBusy(true);
    const c = new AbortController(); ctrl.current = c;
    try {
      const res = await fetch("/api/advisor", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: text, lang }), signal: c.signal,
      });
      if (!res.ok || !res.body) { setErr(a.error); return; }
      const reader = res.body.getReader(); const dec = new TextDecoder(); let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        const m = acc.match(/\[\[error:(\d+)\]\]/);
        if (m) { acc = acc.replace(m[0], "").trim(); setErr(m[1] === "402" || m[1] === "429" ? a.busy : a.error); }
        setOut(acc);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setErr(a.error);
    } finally { setBusy(false); ctrl.current = null; }
  }

  return (
    <>
      <PageIntro kicker={a.kicker} title={a.title} />
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2">
        <div>
          <p className="text-lg text-muted-foreground">{a.intro}</p>
          <label htmlFor="desc" className="label-mono mt-8 block text-primary">{a.label}</label>
          <textarea
            id="desc" value={text} onChange={(e) => setText(e.target.value)} maxLength={3000} rows={9}
            placeholder={a.placeholder}
            className="mt-3 w-full border border-border bg-card p-4 text-foreground outline-none focus:border-primary"
          />
          <div className="mt-4 flex gap-3">
            {busy ? (
              <Button variant="line" size="lg" className="h-12 rounded-none" onClick={() => ctrl.current?.abort()}>
                <Square /> {a.stop}
              </Button>
            ) : (
              <Button variant="hero" size="lg" className="h-12 rounded-none" onClick={run}>
                <Sparkles /> {a.submit}
              </Button>
            )}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{a.disclaimer}</p>
        </div>
        <div className="min-h-64 border border-border bg-card p-8">
          <p className="label-mono text-primary">// {a.resultTitle}</p>
          {busy && !out && <p className="mt-6 animate-pulse text-muted-foreground">{a.thinking}</p>}
          {!busy && !out && !err && <p className="mt-6 text-muted-foreground">{a.empty}</p>}
          {out && <div className="mt-6 whitespace-pre-wrap leading-relaxed text-foreground">{out}</div>}
          {err && <p className="mt-6 text-destructive">{err}</p>}
          {out && !busy && (
            <Button asChild variant="hero" className="mt-8 h-11 rounded-none">
              <Link to="/contact">{a.cta} <ArrowUpRight /></Link>
            </Button>
          )}
        </div>
      </section>
    </>
  );
}
