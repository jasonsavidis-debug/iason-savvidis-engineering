import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const SERVICES = `Structural studies; Architectural studies; Building permits; Small-scale works permits; Legalization of unauthorized constructions (Law 4495/2017); Electronic Building Identity (ΗΤΚ); Health-interest shop licensing; Topographic surveys; BIM modelling.`;

const instructions = `You are the project advisor for Iason Savvidis Engineering, a civil engineering & architecture office in Thessaloniki, Greece.
A prospective client describes their property or project. Recommend which of OUR services fit and the practical next steps under Greek regulations.
Our services: ${SERVICES}
Rules:
- Reply in the language given as "lang" (el = Greek, en = English).
- Structure: a short summary line, then "Recommended services" (bullets, each with one-line why), then "Next steps" (numbered, 3-6 steps), then "Documents to prepare" (bullets).
- Use plain text with "- " bullets and "1." numbering, no markdown headings symbols, no bold.
- Never quote prices or guarantee approval timelines; say a site visit / consultation confirms details.
- End by inviting them to contact the office at +30 694 687 7588 or via the contact page.
- If the request is unrelated to buildings/property/engineering, politely say you can only help with such projects.`;

const RUN = "X-Lovable-AIG-Run-ID";

export const Route = createFileRoute("/api/advisor")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { description?: unknown; lang?: unknown };
        try { body = await request.json(); } catch { return Response.json({ error: "Invalid request" }, { status: 400 }); }
        const description = typeof body.description === "string" ? body.description.trim() : "";
        const lang = body.lang === "el" ? "el" : "en";
        if (description.length < 10 || description.length > 3000) {
          return Response.json({ error: "Description must be 10–3000 characters" }, { status: 400 });
        }
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return Response.json({ error: "AI is not configured" }, { status: 500 });

        let runId: string | undefined;
        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: async (input, init) => {
            const res = await fetch(input, init);
            runId ??= res.headers.get(RUN) ?? undefined;
            if (!res.ok) {
              const text = await res.clone().text();
              console.error(`AI gateway error [${res.status}]: ${text}`);
            }
            return res;
          },
        });

        let failure: { status: number; message: string } | null = null;
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          instructions,
          messages: [{ role: "user", content: `lang: ${lang}\n\nProject description:\n${description}` }],
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
            const e = error as { statusCode?: number; message?: string };
            failure = { status: e.statusCode ?? 500, message: e.message ?? "AI error" };
            console.error("advisor stream error", error);
          },
        });

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of result.textStream) controller.enqueue(encoder.encode(chunk));
              if (failure) controller.enqueue(encoder.encode(`\n\n[[error:${(failure as { status: number }).status}]]`));
            } catch {
              controller.enqueue(encoder.encode("\n\n[[error:500]]"));
            }
            controller.close();
          },
        });
        const headers = new Headers({ "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache, no-transform" });
        return new Response(stream, { headers });
      },
    },
  },
});
