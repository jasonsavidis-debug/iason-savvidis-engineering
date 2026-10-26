import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowUpRight, FileText, ScanSearch, Square, Upload, X } from "lucide-react";
import { PageIntro } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/inspect")({
  head: () => ({
    meta: [
      { title: "Photo & Plan Review — Iason Savvidis Engineering" },
      { name: "description", content: "Upload photos or drawings of your property and get visible observations and topics to discuss with an engineer." },
      { property: "og:title", content: "Photo & Plan Review — Iason Savvidis Engineering" },
      { property: "og:description", content: "AI pre-consultation review of property photos and drawings, Thessaloniki." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Inspect,
});

type Item = { name: string; type: string; data: string; preview?: string };
const MAX_FILES = 6;

// Downscale photos so uploads stay small and fast.
async function readImage(file: File): Promise<Item> {
  const url = URL.createObjectURL(file);
  const img = await new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
  const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
  const c = document.createElement("canvas");
  c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  URL.revokeObjectURL(url);
  const dataUrl = c.toDataURL("image/jpeg", 0.85);
  return { name: file.name, type: "image/jpeg", data: dataUrl.split(",")[1] ?? "", preview: dataUrl };
}
async function readPdf(file: File): Promise<Item> {
  const dataUrl = await new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = rej; r.readAsDataURL(file); });
  return { name: file.name, type: "application/pdf", data: dataUrl.split(",")[1] ?? "" };
}

function Inspect() {
  const { t, lang } = useLang();
  const a = t.inspect;
  const [items, setItems] = useState<Item[]>([]);
  const [note, setNote] = useState("");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const ctrl = useRef<AbortController | null>(null);
  const input = useRef<HTMLInputElement>(null);

  async function add(list: FileList | null) {
    if (!list) return;
    setErr("");
    const next = [...items];
    for (const f of Array.from(list)) {
      if (next.length >= MAX_FILES) { setErr(a.tooMany); break; }
      try {
        if (f.type.startsWith("image/")) next.push(await readImage(f));
        else if (f.type === "application/pdf") {
          if (f.size > 6 * 1024 * 1024) { setErr(a.tooBig); continue; }
          next.push(await readPdf(f));
        } else setErr(a.badType);
      } catch { setErr(a.badType); }
    }
    setItems(next);
    if (input.current) input.current.value = "";
  }

  async function run() {
    if (!items.length) { setErr(a.none); return; }
    setErr(""); setOut(""); setBusy(true);
    const c = new AbortController(); ctrl.current = c;
    try {
      const res = await fetch("/api/inspect", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: c.signal,
        body: JSON.stringify({ lang, note, files: items.map(({ name, type, data }) => ({ name, type, data })) }),
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
          <button
            type="button" onClick={() => input.current?.click()}
            onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); add(e.dataTransfer.files); }}
            className="mt-8 flex w-full flex-col items-center gap-3 border border-dashed border-border bg-card p-10 text-muted-foreground transition hover:border-primary hover:text-foreground"
          >
            <Upload className="h-6 w-6 text-primary" />
            <span>{a.drop}</span>
            <span className="label-mono text-xs">{a.formats}</span>
          </button>
          <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={(e) => add(e.target.files)} />
          {items.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {items.map((it, i) => (
                <div key={i} className="relative aspect-square overflow-hidden border border-border bg-card">
                  {it.preview ? <img src={it.preview} alt={it.name} className="h-full w-full object-cover" /> : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 p-2 text-center text-xs text-muted-foreground"><FileText className="h-6 w-6 text-primary" />{it.name}</div>
                  )}
                  <button type="button" aria-label={a.remove} onClick={() => setItems(items.filter((_, j) => j !== i))} className="absolute right-1 top-1 bg-background/80 p-1 text-foreground hover:text-primary"><X className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          )}
          <label htmlFor="note" className="label-mono mt-8 block text-primary">{a.noteLabel}</label>
          <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={1500} rows={4} placeholder={a.notePlaceholder}
            className="mt-3 w-full border border-border bg-card p-4 text-foreground outline-none focus:border-primary" />
          <div className="mt-4">
            {busy ? (
              <Button variant="line" size="lg" className="h-12 rounded-none" onClick={() => ctrl.current?.abort()}><Square /> {a.stop}</Button>
            ) : (
              <Button variant="hero" size="lg" className="h-12 rounded-none" onClick={run}><ScanSearch /> {a.submit}</Button>
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
            <Button asChild variant="hero" className="mt-8 h-11 rounded-none"><Link to="/contact">{a.cta} <ArrowUpRight /></Link></Button>
          )}
        </div>
      </section>
    </>
  );
}
