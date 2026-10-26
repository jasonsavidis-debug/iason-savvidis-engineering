import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FileText, RotateCcw, Send, Square, Upload, X } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { PageIntro } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { getConsultation, resetConsultation, startConsultation, type ConsultFile } from "@/lib/consult.functions";

export const Route = createFileRoute("/consult")({
  head: () => ({
    meta: [
      { title: "Ask us about your project — Iason Savvidis Engineering" },
      { name: "description", content: "Describe your property, add photos or drawings, and ask clarifying questions about permits, studies and next steps." },
      { property: "og:title", content: "Ask us about your project — Iason Savvidis Engineering" },
      { property: "og:description", content: "Describe your property, add photos, and get answers grounded in what you submitted." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Consult,
});

type Item = { name: string; mime: string; blob: Blob; preview?: string };
type Msg = { role: "user" | "assistant"; content: string };
type Consultation = { id: string; description: string; files: ConsultFile[] };

const MAX_FILES = 6;
const DRAFT_KEY = "consult-draft";

async function readImage(file: File): Promise<Item> {
  const url = URL.createObjectURL(file);
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = url;
  });
  const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
  const c = document.createElement("canvas");
  c.width = Math.round(img.width * scale);
  c.height = Math.round(img.height * scale);
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  URL.revokeObjectURL(url);
  const blob = await new Promise<Blob>((res) => c.toBlob((b) => res(b as Blob), "image/jpeg", 0.85));
  return { name: file.name, mime: "image/jpeg", blob, preview: URL.createObjectURL(blob) };
}

function Consult() {
  const { t, lang } = useLang();
  const c = t.consult;

  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);

  const [description, setDescription] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [question, setQuestion] = useState("");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const ctrl = useRef<AbortController | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    const res = await getConsultation();
    if (res) {
      setConsultation(res.consultation as unknown as Consultation);
      setMessages(res.messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })));
    } else {
      setConsultation(null);
      setMessages([]);
    }
  }, []);

  // Session + existing conversation.
  useEffect(() => {
    let live = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!live) return;
      setSession(data.session);
      if (data.session) await load();
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, s) => {
      if (!live) return;
      setSession(s);
      if (s) await load();
    });
    return () => { live = false; sub.subscription.unsubscribe(); };
  }, [load]);

  // Bring back a description typed before signing in.
  useEffect(() => {
    const draft = sessionStorage.getItem(DRAFT_KEY);
    if (draft) { setDescription(draft); sessionStorage.removeItem(DRAFT_KEY); }
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, out]);

  async function add(list: FileList | null) {
    if (!list) return;
    setErr("");
    const next = [...items];
    for (const f of Array.from(list)) {
      if (next.length >= MAX_FILES) { setErr(c.tooMany); break; }
      try {
        if (f.type.startsWith("image/")) next.push(await readImage(f));
        else if (f.type === "application/pdf") {
          if (f.size > 6 * 1024 * 1024) { setErr(c.tooBig); continue; }
          next.push({ name: f.name, mime: "application/pdf", blob: f });
        } else setErr(c.badType);
      } catch { setErr(c.badType); }
    }
    setItems(next);
    if (input.current) input.current.value = "";
  }

  async function submit() {
    if (description.trim().length < 20) { setErr(c.tooShort); return; }
    if (!session) {
      sessionStorage.setItem(DRAFT_KEY, description);
      window.location.href = "/auth";
      return;
    }
    setErr(""); setSubmitting(true);
    try {
      const userId = session.user.id;
      const folder = `${userId}/${crypto.randomUUID()}`;
      const files: ConsultFile[] = [];
      for (const [i, it] of items.entries()) {
        const ext = it.mime === "application/pdf" ? "pdf" : "jpg";
        const path = `${folder}/${i + 1}.${ext}`;
        const { error } = await supabase.storage.from("consultation-files").upload(path, it.blob, { contentType: it.mime, upsert: true });
        if (error) { setErr(c.error); setSubmitting(false); return; }
        files.push({ path, name: it.name, mime: it.mime });
      }
      await startConsultation({ data: { description, files } });
      setDescription(""); setItems([]);
      await load();
    } catch {
      setErr(c.error);
    } finally {
      setSubmitting(false);
    }
  }

  async function ask() {
    const q = question.trim();
    if (q.length < 3 || busy) return;
    setErr(""); setOut(""); setBusy(true);
    const c0 = new AbortController(); ctrl.current = c0;
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question: q, lang }),
        signal: c0.signal,
      });
      if (!res.ok || !res.body) { setErr(res.status === 401 ? c.signInTitle : c.error); return; }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        const m = acc.match(/\[\[error:(\d+)\]\]/);
        if (m) { acc = acc.replace(m[0], "").trim(); setErr(m[1] === "402" || m[1] === "429" ? c.busy : c.error); }
        setOut(acc);
      }
      if (acc.trim() && !err) setMessages((prev) => [...prev, { role: "user", content: q }, { role: "assistant", content: acc }]);
      setQuestion("");
    } catch (e) {
      if ((e as Error).name !== "AbortError") setErr(c.error);
    } finally {
      setBusy(false);
      ctrl.current = null;
      setOut("");
    }
  }

  async function reset() {
    setSubmitting(true);
    try {
      await resetConsultation();
      setConsultation(null); setMessages([]); setItems([]); setDescription("");
    } catch { setErr(c.error); }
    finally { setSubmitting(false); }
  }

  const signedIn = !!session;

  return (
    <>
      <PageIntro kicker={c.kicker} title={c.title} />
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2">
        {/* ---- left: what the client gave us ---- */}
        <div>
          <p className="text-lg text-muted-foreground">{c.intro}</p>

          {consultation ? (
            <>
              <p className="label-mono mt-8 text-primary">// {c.yourProject}</p>
              <p className="mt-3 whitespace-pre-wrap leading-relaxed text-foreground">{consultation.description}</p>

              {consultation.files.length > 0 && (
                <>
                  <p className="label-mono mt-8 text-primary">// {c.yourFiles}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {consultation.files.map((f, i) => (
                      <StoredThumb key={f.path} path={f.path} name={f.name} fallback={c.yourFiles} index={i} />
                    ))}
                  </div>
                </>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button variant="line" size="sm" className="rounded-none" onClick={reset} disabled={submitting}>
                  <RotateCcw /> {c.reset}
                </Button>
                <span className="text-xs text-muted-foreground">
                  {c.signedInAs} {session?.user.email} ·{" "}
                  <button type="button" className="underline hover:text-primary" onClick={() => supabase.auth.signOut()}>
                    {c.signOut}
                  </button>
                </span>
              </div>
            </>
          ) : (
            <>
              <label htmlFor="desc" className="label-mono mt-8 block text-primary">{c.descLabel}</label>
              <textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={4000}
                rows={9}
                placeholder={c.descPlaceholder}
                className="mt-3 w-full border border-border bg-card p-4 text-foreground outline-none focus:border-primary"
              />

              <button
                type="button"
                onClick={() => input.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); add(e.dataTransfer.files); }}
                className="mt-6 flex w-full flex-col items-center gap-3 border border-dashed border-border bg-card p-10 text-muted-foreground transition hover:border-primary hover:text-foreground"
              >
                <Upload className="h-6 w-6 text-primary" />
                <span>{c.drop}</span>
                <span className="label-mono text-xs">{c.formats}</span>
              </button>
              <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={(e) => add(e.target.files)} />

              {items.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {items.map((it, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden border border-border bg-card">
                      {it.preview ? (
                        <img src={it.preview} alt={it.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 p-2 text-center text-xs text-muted-foreground">
                          <FileText className="h-6 w-6 text-primary" />
                          {it.name}
                        </div>
                      )}
                      <button
                        type="button"
                        aria-label={c.remove}
                        onClick={() => setItems(items.filter((_, j) => j !== i))}
                        className="absolute right-1 top-1 bg-background/80 p-1 text-foreground hover:text-primary"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <Button variant="hero" size="lg" className="h-12 rounded-none" onClick={submit} disabled={submitting || !ready}>
                  {submitting ? c.uploading : signedIn ? c.submit : c.signInTitle}
                </Button>
              </div>

              {err && <p className="mt-4 text-sm text-destructive">{err}</p>}
              <p className="mt-4 text-sm text-muted-foreground">{c.signInBody}</p>
              <p className="mt-2 text-sm text-muted-foreground">{c.disclaimer}</p>
            </>
          )}
        </div>

        {/* ---- right: the conversation ---- */}
        <div className="flex min-h-96 flex-col border border-border bg-card p-8">
          <p className="label-mono text-primary">// {c.chatTitle}</p>

          <div className="mt-6 flex-1 space-y-6">
            {messages.length === 0 && !out && <p className="text-muted-foreground">{consultation ? c.empty : c.signInBody}</p>}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "border-l-2 border-primary pl-4" : ""}>
                {m.role === "user" && <p className="label-mono mb-1 text-xs text-muted-foreground">&gt;</p>}
                <p className="whitespace-pre-wrap leading-relaxed text-foreground">{m.content}</p>
              </div>
            ))}
            {out && <p className="whitespace-pre-wrap leading-relaxed text-foreground">{out}</p>}
            {busy && !out && <p className="animate-pulse text-muted-foreground">{c.thinking}</p>}
            {err && <p className="text-destructive">{err}</p>}
            <div ref={endRef} />
          </div>

          {consultation && (
            <div className="mt-8 border-t border-border pt-6">
              <div className="flex items-end gap-3">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } }}
                  maxLength={2000}
                  rows={3}
                  placeholder={c.qPlaceholder}
                  className="w-full resize-none border border-border bg-background p-3 text-foreground outline-none focus:border-primary"
                />
                {busy ? (
                  <Button variant="line" size="icon" className="h-11 w-11 shrink-0 rounded-none" onClick={() => ctrl.current?.abort()}>
                    <Square />
                  </Button>
                ) : (
                  <Button variant="hero" size="icon" className="h-11 w-11 shrink-0 rounded-none" onClick={ask}>
                    <Send />
                  </Button>
                )}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{c.disclaimer}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/** Private thumbnails: the browser asks for a short-lived signed URL for each stored file. */
function StoredThumb({ path, name, index }: { path: string; name: string; fallback: string; index: number }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    let live = true;
    supabase.storage.from("consultation-files").createSignedUrl(path, 600).then(({ data }) => {
      if (live && data?.signedUrl) setUrl(data.signedUrl);
    });
    return () => { live = false; };
  }, [path]);

  return (
    <div className="relative aspect-square overflow-hidden border border-border bg-card">
      {url ? (
        <img src={url} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-2 text-center text-xs text-muted-foreground">
          <FileText className="h-6 w-6 text-primary" />
          {name}
        </div>
      )}
      <span className="label-mono absolute bottom-1 right-1 bg-background/80 px-1 text-[10px]">{index + 1}</span>
    </div>
  );
}
