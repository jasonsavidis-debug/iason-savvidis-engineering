import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const MAX_FILES = 6;
const MAX_BYTES = 6 * 1024 * 1024; // per file, decoded
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const instructions = `You are the pre-consultation assistant for Iason Savvidis Engineering, a civil engineering & architecture office in Thessaloniki, Greece.
A prospective client uploads photos and/or drawings (plans, sections, permits) of their property, optionally with a note.
Your job: point out VISIBLE issues or things worth checking, and suggest what they should discuss with the engineer.
Office services: structural studies, architectural studies, building permits, small-scale permits, legalization of unauthorized works (Law 4495/2017), Electronic Building Identity (ΗΤΚ), health-interest shop licensing, topographic surveys, BIM.
Rules:
- Reply in the language given as "lang" (el = Greek, en = English).
- Structure: one short line describing what you see, then "Visible observations" (bullets, each tied to which image/drawing), then "To discuss with the engineer" (numbered questions/topics), then "Relevant services" (bullets).
- Plain text only: "- " bullets and "1." numbering, no markdown symbols or bold.
- Only describe what is actually visible; say when something is unclear or needs an on-site inspection. Never declare a building safe or unsafe, never diagnose structural failure with certainty, never quote prices.
- If you see signs that could be urgent (large cracks, exposed corroded rebar, sagging, water damage near electrics), advise contacting the office promptly.
- If the files are not of a property or drawing, say politely that you can only review property photos or drawings.
- End by inviting them to book a consultation at +30 694 687 7588 or via the contact page.`;

type FileIn = { name?: unknown; type?: unknown; data?: unknown };

export const Route = createFileRoute("/api/inspect")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { files?: unknown; note?: unknown; lang?: unknown };
        try { body = await request.json(); } catch { return Response.json({ error: "Invalid request" }, { status: 400 }); }
        const lang = body.lang === "el" ? "el" : "en";
        const note = typeof body.note === "string" ? body.note.trim().slice(0, 1500) : "";
        const files = Array.isArray(body.files) ? (body.files as FileIn[]) : [];
        if (files.length < 1 || files.length > MAX_FILES) return Response.json({ error: "Upload 1–6 files" }, { status: 400 });

        const parts: Array<
          | { type: "text"; text: string }
          | { type: "image"; image: URL }
          | { type: "file"; filename: string; data: string; mediaType: "application/pdf" }
        > = [{ type: "text", text: `lang: ${lang}\n\nClient note: ${note || "(none)"}\n\nFiles follow in order (1..${files.length}).` }];

        for (const [i, f] of files.entries()) {
          const type = typeof f.type === "string" ? f.type : "";
          const data = typeof f.data === "string" ? f.data : "";
          const name = (typeof f.name === "string" ? f.name : `file-${i + 1}`).slice(0, 120);
          if (!data.trim()) return Response.json({ error: "Empty file" }, { status: 400 });
          if (Math.floor((data.length * 3) / 4) > MAX_BYTES) return Response.json({ error: "File too large" }, { status: 400 });
          parts.push({ type: "text", text: `File ${i + 1}: ${name}` });
          if (IMAGE_TYPES.includes(type)) parts.push({ type: "image", image: new URL(`data:${type};base64,${data}`) });
          else if (type === "application/pdf") parts.push({ type: "file", filename: name, data, mediaType: "application/pdf" });
          else return Response.json({ error: "Unsupported file type" }, { status: 400 });
        }

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
          messages: [{ role: "user", content: parts }],
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
            console.error("inspect stream error", error);
          },
        });

        const enc = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of result.textStream) controller.enqueue(enc.encode(chunk));
              if (failStatus) controller.enqueue(enc.encode(`\n\n[[error:${failStatus}]]`));
            } catch {
              controller.enqueue(enc.encode("\n\n[[error:500]]"));
            }
            controller.close();
          },
        });
        return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache, no-transform" } });
      },
    },
  },
});
