import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const BUCKET = "consultation-files";
const MAX_HISTORY = 24;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const instructions = `You are the pre-consultation assistant for Iason Savvidis Engineering, a civil engineering & architecture office in Thessaloniki, Greece.
A prospective client has already submitted a written description of their property or project, plus photos and/or drawings. They now ask clarifying questions.
Answer using ONLY what they submitted (description + files) and general knowledge of Greek building practice.
Office services: structural studies, architectural studies, building permits, small-scale permits, legalization of unauthorized works (Law 4495/2017), Electronic Building Identity (ΗΤΚ), health-interest shop licensing, topographic surveys, BIM.
Rules:
- Reply in the language given as "lang" (el = Greek, en = English).
- Be concrete and short: a direct answer first, then at most 4 bullet points, then one line on what to send or check next.
- Plain text only: "- " bullets and "1." numbering, no markdown symbols or bold.
- If the answer depends on something the description or files do not show, say exactly what is missing and that an on-site visit or the office can confirm it. Never invent facts about their property.
- Never declare a building safe or unsafe, never diagnose structural failure with certainty, never quote prices or guarantee approval timelines.
- If something they describe or show could be urgent (large cracks, exposed corroded rebar, sagging, water near electrics), tell them to contact the office promptly.
- End by inviting them to book a consultation at +30 694 687 7588 or via the contact page.`;

type FileRow = { path?: unknown; name?: unknown; mime?: unknown };

function toBase64(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i] ?? 0);
  return btoa(bin);
}

export const Route = createFileRoute("/api/consult")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = request.headers.get("authorization") || "";
        if (!auth.startsWith("Bearer ")) return Response.json({ error: "Unauthorized" }, { status: 401 });
        const token = auth.slice(7);
        if (!token || token.split(".").length !== 3) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const url = process.env["SUPABASE_URL"];
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
        if (!url || !key) return Response.json({ error: "Backend is not configured" }, { status: 500 });

        // The caller's own token, so every read below runs under their row-level security.
        const user = createClient<Database>(url, key, {
          global: {
            headers: { Authorization: `Bearer ${token}` },
            fetch: (input, init) => {
              const h = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined);
              if (init?.headers) new Headers(init.headers).forEach((v, k) => h.set(k, v));
              if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
              h.set("apikey", key);
              return fetch(input, { ...init, headers: h });
            },
          },
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
        });

        const { data: claims, error: cErr } = await user.auth.getClaims(token);
        const userId = claims?.claims?.sub;
        if (cErr || !userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

        let body: { question?: unknown; lang?: unknown };
        try { body = await request.json(); } catch { return Response.json({ error: "Invalid request" }, { status: 400 }); }
        const lang = body.lang === "el" ? "el" : "en";
        const question = typeof body.question === "string" ? body.question.trim().slice(0, 2000) : "";
        if (question.length < 3) return Response.json({ error: "Question too short" }, { status: 400 });

        const { data: consult, error: qErr } = await user
          .from("consultations")
          .select("id, description, files")
          .eq("user_id", userId)
          .maybeSingle();
        if (qErr) return Response.json({ error: "Read failed" }, { status: 500 });
        if (!consult) return Response.json({ error: "No consultation yet" }, { status: 403 });

        const { data: history } = await user
          .from("consultation_messages")
          .select("role, content")
          .eq("consultation_id", consult.id)
          .order("created_at", { ascending: false })
          .limit(MAX_HISTORY);

        const files = Array.isArray(consult.files) ? (consult.files as FileRow[]) : [];
        const parts: Array<
          | { type: "text"; text: string }
          | { type: "image"; image: URL }
          | { type: "file"; filename: string; data: string; mediaType: "application/pdf" }
        > = [{ type: "text", text: `lang: ${lang}\n\nClient description:\n${consult.description}\n\nFiles submitted (in order):` }];

        // Files belong to this client (their row was read under their own RLS), so reading
        // the bytes with the privileged client is safe; the paths never come from the caller.
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        for (const [i, f] of files.entries()) {
          const path = typeof f.path === "string" ? f.path : "";
          const mime = typeof f.mime === "string" ? f.mime : "";
          const name = typeof f.name === "string" ? f.name : `file-${i + 1}`;
          if (!path) continue;
          const { data: blob, error: dErr } = await supabaseAdmin.storage.from(BUCKET).download(path);
          if (dErr || !blob) { parts.push({ type: "text", text: `File ${i + 1}: ${name} (unreadable)` }); continue; }
          const b64 = toBase64(await blob.arrayBuffer());
          parts.push({ type: "text", text: `File ${i + 1}: ${name}` });
          if (IMAGE_TYPES.includes(mime)) parts.push({ type: "image", image: new URL(`data:${mime};base64,${b64}`) });
          else if (mime === "application/pdf") parts.push({ type: "file", filename: name, data: b64, mediaType: "application/pdf" });
        }

        const messages: Array<{ role: "user" | "assistant"; content: unknown }> = [{ role: "user", content: parts }];
        for (const m of (history ?? []).reverse()) {
          if (m.role === "user" || m.role === "assistant") messages.push({ role: m.role, content: m.content });
        }
        messages.push({ role: "user", content: question });

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return Response.json({ error: "AI is not configured" }, { status: 500 });
        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: async (input, init) => {
            const res = await fetch(input, init);
            if (!res.ok) console.error(`AI gateway error [${res.status}]: ${await res.clone().text()}`);
            return res;
          },
        });

        let failStatus = 0;
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          instructions,
          messages: messages as never,
          abortSignal: request.signal,
          maxRetries: 0,
          providerOptions: {
            openai: {
              store: false,
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              include: ["reasoning.encrypted_content"],
            },
          },
          onError: ({ error }) => {
            failStatus = (error as { statusCode?: number }).statusCode ?? 500;
            console.error("consult stream error", error);
          },
        });

        const enc = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            let answer = "";
            try {
              for await (const chunk of result.textStream) {
                answer += chunk;
                controller.enqueue(enc.encode(chunk));
              }
              if (failStatus) controller.enqueue(enc.encode(`\n\n[[error:${failStatus}]]`));
            } catch {
              controller.enqueue(enc.encode("\n\n[[error:500]]"));
            }
            controller.close();

            // Keep the exchange so the client can resume it later from any device.
            if (answer.trim()) {
              await user.from("consultation_messages").insert([
                { consultation_id: consult.id, role: "user", content: question },
                { consultation_id: consult.id, role: "assistant", content: answer },
              ]);
            }
          },
        });

        return new Response(stream, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache, no-transform" },
        });
      },
    },
  },
});
