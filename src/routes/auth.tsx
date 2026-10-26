import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import "@lovable.dev/cloud-auth-js/styles.css";
import { PageIntro } from "@/components/SiteHeader";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Iason Savvidis Engineering" },
      { name: "description", content: "Sign in to keep your project description, photos and conversation with the office." },
      { property: "og:title", content: "Sign in — Iason Savvidis Engineering" },
      { property: "og:description", content: "Sign in to continue your project conversation." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Auth,
});

function Auth() {
  const { t } = useLang();
  const c = t.consult;
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState<"" | "google" | "lovable">("");

  // Someone who is already signed in should not sit on this screen.
  useEffect(() => {
    let live = true;
    supabase.auth.getSession().then(({ data }) => {
      if (live && data.session) navigate({ to: "/consult" });
    });
    return () => { live = false; };
  }, [navigate]);

  async function go(provider: "google" | "lovable") {
    setErr("");
    setBusy(provider);
    const res = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    if (res.error) {
      setErr(c.error);
      setBusy("");
      return;
    }
    if (res.redirected) return; // the browser is on its way to the provider
    navigate({ to: "/consult" });
  }

  return (
    <>
      <PageIntro kicker={c.kicker} title={c.signInTitle} />
      <section className="mx-auto max-w-xl px-6 py-16">
        <p className="text-lg text-muted-foreground">{c.signInBody}</p>

        <div className="mt-10 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => go("google")}
            disabled={!!busy}
            className="flex h-12 items-center justify-center gap-3 border border-border bg-card px-6 font-display text-sm font-semibold text-foreground transition hover:border-primary disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.8Z" />
              <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.7-4.9H1.3v3.1A12 12 0 0 0 12 24Z" />
              <path fill="#FBBC05" d="M5.3 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.3a12 12 0 0 0 0 10.8l4-3.1Z" />
              <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z" />
            </svg>
            Google
          </button>

          <button
            type="button"
            onClick={() => go("lovable")}
            disabled={!!busy}
            className="lovable-auth-button disabled:opacity-60"
          >
            Continue with Lovable
          </button>
        </div>

        {err && <p className="mt-6 text-sm text-destructive">{err}</p>}
        <p className="mt-8 text-sm text-muted-foreground">{c.signInNote}</p>
      </section>
    </>
  );
}
