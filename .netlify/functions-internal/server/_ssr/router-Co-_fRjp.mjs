import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { t as LangProvider } from "./i18n-DE0j_coE.mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, f as Scripts, g as Outlet, h as createRouter, p as HeadContent, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as SiteFooter, r as SiteHeader } from "./SiteHeader-CBv47G-c.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as createOpenAI } from "../_libs/ai-sdk__openai+zod.mjs";
import { t as streamText } from "../_libs/ai.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Co-_fRjp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DKPK71o_.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message: describeThrown(error),
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var MAX_SERIALIZED_LENGTH = 2e3;
function describeThrown(error) {
	if (error instanceof Response) return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	const { message } = error ?? {};
	if (typeof message === "string" && message.length > 0) return message;
	try {
		return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
	} catch {
		return String(error);
	}
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$11 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Iason Savvidis Engineering" },
			{
				name: "description",
				content: "Civil engineering and architectural services."
			},
			{
				property: "og:title",
				content: "Iason Savvidis Engineering"
			},
			{
				property: "og:description",
				content: "Civil engineering and architectural services."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$11.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LangProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "min-h-screen",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
				theme: "dark",
				position: "bottom-right"
			})
		] })
	});
}
var $$splitComponentImporter$7 = () => import("./routes-BSLbPOfi.mjs");
var Route$10 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Iason Savvidis Engineering — Civil Engineer & Architect" },
		{
			name: "description",
			content: "Civil engineering and architectural services: structural studies, design, building permits and construction supervision."
		},
		{
			property: "og:title",
			content: "Iason Savvidis Engineering — Civil Engineer & Architect"
		},
		{
			property: "og:description",
			content: "Structural studies, architectural design, permits and supervision."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./about-DGVIkt-G.mjs");
var Route$9 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "About — Iason Savvidis Engineering" },
		{
			name: "description",
			content: "A civil engineering and architecture practice focused on precise, efficient and timeless design."
		},
		{
			property: "og:title",
			content: "About — Iason Savvidis Engineering"
		},
		{
			property: "og:description",
			content: "Engineering with clarity: precision, integrity, innovation."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./advisor-CeZcHQ4j.mjs");
var Route$8 = createFileRoute("/advisor")({
	head: () => ({ meta: [
		{ title: "Project Advisor — Iason Savvidis Engineering" },
		{
			name: "description",
			content: "Describe your property or project and get suggested engineering services and next steps."
		},
		{
			property: "og:title",
			content: "Project Advisor — Iason Savvidis Engineering"
		},
		{
			property: "og:description",
			content: "Instant guidance on permits, studies and legalization for your property in Thessaloniki."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./auth-D7uOaa_U.mjs");
var Route$7 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign in — Iason Savvidis Engineering" },
		{
			name: "description",
			content: "Sign in to keep your project description, photos and conversation with the office."
		},
		{
			property: "og:title",
			content: "Sign in — Iason Savvidis Engineering"
		},
		{
			property: "og:description",
			content: "Sign in to continue your project conversation."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./consult-BwuFfPPW.mjs");
var Route$6 = createFileRoute("/consult")({
	head: () => ({ meta: [
		{ title: "Ask us about your project — Iason Savvidis Engineering" },
		{
			name: "description",
			content: "Describe your property, add photos or drawings, and ask clarifying questions about permits, studies and next steps."
		},
		{
			property: "og:title",
			content: "Ask us about your project — Iason Savvidis Engineering"
		},
		{
			property: "og:description",
			content: "Describe your property, add photos, and get answers grounded in what you submitted."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
/** Private thumbnails: the browser asks for a short-lived signed URL for each stored file. */
var $$splitComponentImporter$2 = () => import("./contact-ZfDsZF3O.mjs");
var Route$5 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: "Contact — Iason Savvidis Engineering" },
		{
			name: "description",
			content: "Get in touch about your construction, renovation or architectural project."
		},
		{
			property: "og:title",
			content: "Contact — Iason Savvidis Engineering"
		},
		{
			property: "og:description",
			content: "Tell us about your project."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./inspect-gfW_1pYs.mjs");
var Route$4 = createFileRoute("/inspect")({
	head: () => ({ meta: [
		{ title: "Photo & Plan Review — Iason Savvidis Engineering" },
		{
			name: "description",
			content: "Upload photos or drawings of your property and get visible observations and topics to discuss with an engineer."
		},
		{
			property: "og:title",
			content: "Photo & Plan Review — Iason Savvidis Engineering"
		},
		{
			property: "og:description",
			content: "AI pre-consultation review of property photos and drawings, Thessaloniki."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./services-DZMArfMF.mjs");
var Route$3 = createFileRoute("/services")({
	head: () => ({ meta: [
		{ title: "Services — Iason Savvidis Engineering" },
		{
			name: "description",
			content: "Structural studies, architectural design, building permits, supervision, renovation and legalization services."
		},
		{
			property: "og:title",
			content: "Services — Iason Savvidis Engineering"
		},
		{
			property: "og:description",
			content: "Complete civil engineering and architectural services."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var instructions$2 = `You are the project advisor for Iason Savvidis Engineering, a civil engineering & architecture office in Thessaloniki, Greece.
A prospective client describes their property or project. Recommend which of OUR services fit and the practical next steps under Greek regulations.
Our services: Structural studies; Architectural studies; Building permits; Small-scale works permits; Legalization of unauthorized constructions (Law 4495/2017); Electronic Building Identity (ΗΤΚ); Health-interest shop licensing; Topographic surveys; BIM modelling.
Rules:
- Reply in the language given as "lang" (el = Greek, en = English).
- Structure: a short summary line, then "Recommended services" (bullets, each with one-line why), then "Next steps" (numbered, 3-6 steps), then "Documents to prepare" (bullets).
- Use plain text with "- " bullets and "1." numbering, no markdown headings symbols, no bold.
- Never quote prices or guarantee approval timelines; say a site visit / consultation confirms details.
- End by inviting them to contact the office at +30 694 687 7588 or via the contact page.
- If the request is unrelated to buildings/property/engineering, politely say you can only help with such projects.`;
var RUN = "X-Lovable-AIG-Run-ID";
var Route$2 = createFileRoute("/api/advisor")({ server: { handlers: { POST: async ({ request }) => {
	let body;
	try {
		body = await request.json();
	} catch {
		return Response.json({ error: "Invalid request" }, { status: 400 });
	}
	const description = typeof body.description === "string" ? body.description.trim() : "";
	const lang = body.lang === "el" ? "el" : "en";
	if (description.length < 10 || description.length > 3e3) return Response.json({ error: "Description must be 10–3000 characters" }, { status: 400 });
	const apiKey = process.env["LOVABLE_API_KEY"];
	if (!apiKey) return Response.json({ error: "AI is not configured" }, { status: 500 });
	let runId;
	const provider = createOpenAI({
		baseURL: "https://ai.gateway.lovable.dev/v1",
		apiKey,
		headers: {
			"Lovable-API-Key": apiKey,
			"X-Lovable-AIG-SDK": "vercel-ai-sdk"
		},
		fetch: async (input, init) => {
			const res = await fetch(input, init);
			runId ??= res.headers.get(RUN) ?? void 0;
			if (!res.ok) {
				const text = await res.clone().text();
				console.error(`AI gateway error [${res.status}]: ${text}`);
			}
			return res;
		}
	});
	let failure = null;
	const result = streamText({
		model: provider.responses("openai/gpt-6-astra"),
		instructions: instructions$2,
		messages: [{
			role: "user",
			content: `lang: ${lang}\n\nProject description:\n${description}`
		}],
		abortSignal: request.signal,
		maxRetries: 0,
		providerOptions: { openai: {
			store: false,
			forceReasoning: true,
			reasoningEffort: "low",
			reasoningSummary: "auto",
			include: ["reasoning.encrypted_content"]
		} },
		onError: ({ error }) => {
			const e = error;
			failure = {
				status: e.statusCode ?? 500,
				message: e.message ?? "AI error"
			};
			console.error("advisor stream error", error);
		}
	});
	const encoder = new TextEncoder();
	const stream = new ReadableStream({ async start(controller) {
		try {
			for await (const chunk of result.textStream) controller.enqueue(encoder.encode(chunk));
			if (failure) controller.enqueue(encoder.encode(`\n\n[[error:${failure.status}]]`));
		} catch {
			controller.enqueue(encoder.encode("\n\n[[error:500]]"));
		}
		controller.close();
	} });
	const headers = new Headers({
		"Content-Type": "text/plain; charset=utf-8",
		"Cache-Control": "no-cache, no-transform"
	});
	return new Response(stream, { headers });
} } } });
var BUCKET = "consultation-files";
var MAX_HISTORY = 24;
var IMAGE_TYPES$1 = [
	"image/jpeg",
	"image/png",
	"image/webp"
];
var instructions$1 = `You are the pre-consultation assistant for Iason Savvidis Engineering, a civil engineering & architecture office in Thessaloniki, Greece.
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
function toBase64(buf) {
	const bytes = new Uint8Array(buf);
	let bin = "";
	for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i] ?? 0);
	return btoa(bin);
}
var Route$1 = createFileRoute("/api/consult")({ server: { handlers: { POST: async ({ request }) => {
	const auth = request.headers.get("authorization") || "";
	if (!auth.startsWith("Bearer ")) return Response.json({ error: "Unauthorized" }, { status: 401 });
	const token = auth.slice(7);
	if (!token || token.split(".").length !== 3) return Response.json({ error: "Unauthorized" }, { status: 401 });
	const url = process.env["SUPABASE_URL"];
	const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
	if (!url || !key) return Response.json({ error: "Backend is not configured" }, { status: 500 });
	const user = createClient(url, key, {
		global: {
			headers: { Authorization: `Bearer ${token}` },
			fetch: (input, init) => {
				const h = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
				if (init?.headers) new Headers(init.headers).forEach((v, k) => h.set(k, v));
				if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
				h.set("apikey", key);
				return fetch(input, {
					...init,
					headers: h
				});
			}
		},
		auth: {
			storage: void 0,
			persistSession: false,
			autoRefreshToken: false
		}
	});
	const { data: claims, error: cErr } = await user.auth.getClaims(token);
	const userId = claims?.claims?.sub;
	if (cErr || !userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
	let body;
	try {
		body = await request.json();
	} catch {
		return Response.json({ error: "Invalid request" }, { status: 400 });
	}
	const lang = body.lang === "el" ? "el" : "en";
	const question = typeof body.question === "string" ? body.question.trim().slice(0, 2e3) : "";
	if (question.length < 3) return Response.json({ error: "Question too short" }, { status: 400 });
	const { data: consult, error: qErr } = await user.from("consultations").select("id, description, files").eq("user_id", userId).maybeSingle();
	if (qErr) return Response.json({ error: "Read failed" }, { status: 500 });
	if (!consult) return Response.json({ error: "No consultation yet" }, { status: 403 });
	const { data: history } = await user.from("consultation_messages").select("role, content").eq("consultation_id", consult.id).order("created_at", { ascending: false }).limit(MAX_HISTORY);
	const files = Array.isArray(consult.files) ? consult.files : [];
	const parts = [{
		type: "text",
		text: `lang: ${lang}\n\nClient description:\n${consult.description}\n\nFiles submitted (in order):`
	}];
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	for (const [i, f] of files.entries()) {
		const path = typeof f.path === "string" ? f.path : "";
		const mime = typeof f.mime === "string" ? f.mime : "";
		const name = typeof f.name === "string" ? f.name : `file-${i + 1}`;
		if (!path) continue;
		const { data: blob, error: dErr } = await supabaseAdmin.storage.from(BUCKET).download(path);
		if (dErr || !blob) {
			parts.push({
				type: "text",
				text: `File ${i + 1}: ${name} (unreadable)`
			});
			continue;
		}
		const b64 = toBase64(await blob.arrayBuffer());
		parts.push({
			type: "text",
			text: `File ${i + 1}: ${name}`
		});
		if (IMAGE_TYPES$1.includes(mime)) parts.push({
			type: "image",
			image: new URL(`data:${mime};base64,${b64}`)
		});
		else if (mime === "application/pdf") parts.push({
			type: "file",
			filename: name,
			data: b64,
			mediaType: "application/pdf"
		});
	}
	const messages = [{
		role: "user",
		content: parts
	}];
	for (const m of (history ?? []).reverse()) if (m.role === "user" || m.role === "assistant") messages.push({
		role: m.role,
		content: m.content
	});
	messages.push({
		role: "user",
		content: question
	});
	const apiKey = process.env["LOVABLE_API_KEY"];
	if (!apiKey) return Response.json({ error: "AI is not configured" }, { status: 500 });
	const provider = createOpenAI({
		baseURL: "https://ai.gateway.lovable.dev/v1",
		apiKey,
		headers: {
			"Lovable-API-Key": apiKey,
			"X-Lovable-AIG-SDK": "vercel-ai-sdk"
		},
		fetch: async (input, init) => {
			const res = await fetch(input, init);
			if (!res.ok) console.error(`AI gateway error [${res.status}]: ${await res.clone().text()}`);
			return res;
		}
	});
	let failStatus = 0;
	const result = streamText({
		model: provider.responses("openai/gpt-6-astra"),
		instructions: instructions$1,
		messages,
		abortSignal: request.signal,
		maxRetries: 0,
		providerOptions: { openai: {
			store: false,
			forceReasoning: true,
			reasoningEffort: "low",
			reasoningSummary: "auto",
			include: ["reasoning.encrypted_content"]
		} },
		onError: ({ error }) => {
			failStatus = error.statusCode ?? 500;
			console.error("consult stream error", error);
		}
	});
	const enc = new TextEncoder();
	const stream = new ReadableStream({ async start(controller) {
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
		if (answer.trim()) await user.from("consultation_messages").insert([{
			consultation_id: consult.id,
			role: "user",
			content: question
		}, {
			consultation_id: consult.id,
			role: "assistant",
			content: answer
		}]);
	} });
	return new Response(stream, { headers: {
		"Content-Type": "text/plain; charset=utf-8",
		"Cache-Control": "no-cache, no-transform"
	} });
} } } });
var MAX_FILES = 6;
var MAX_BYTES = 6291456;
var IMAGE_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp"
];
var instructions = `You are the pre-consultation assistant for Iason Savvidis Engineering, a civil engineering & architecture office in Thessaloniki, Greece.
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
var Route = createFileRoute("/api/inspect")({ server: { handlers: { POST: async ({ request }) => {
	let body;
	try {
		body = await request.json();
	} catch {
		return Response.json({ error: "Invalid request" }, { status: 400 });
	}
	const lang = body.lang === "el" ? "el" : "en";
	const note = typeof body.note === "string" ? body.note.trim().slice(0, 1500) : "";
	const files = Array.isArray(body.files) ? body.files : [];
	if (files.length < 1 || files.length > MAX_FILES) return Response.json({ error: "Upload 1–6 files" }, { status: 400 });
	const parts = [{
		type: "text",
		text: `lang: ${lang}\n\nClient note: ${note || "(none)"}\n\nFiles follow in order (1..${files.length}).`
	}];
	for (const [i, f] of files.entries()) {
		const type = typeof f.type === "string" ? f.type : "";
		const data = typeof f.data === "string" ? f.data : "";
		const name = (typeof f.name === "string" ? f.name : `file-${i + 1}`).slice(0, 120);
		if (!data.trim()) return Response.json({ error: "Empty file" }, { status: 400 });
		if (Math.floor(data.length * 3 / 4) > MAX_BYTES) return Response.json({ error: "File too large" }, { status: 400 });
		parts.push({
			type: "text",
			text: `File ${i + 1}: ${name}`
		});
		if (IMAGE_TYPES.includes(type)) parts.push({
			type: "image",
			image: new URL(`data:${type};base64,${data}`)
		});
		else if (type === "application/pdf") parts.push({
			type: "file",
			filename: name,
			data,
			mediaType: "application/pdf"
		});
		else return Response.json({ error: "Unsupported file type" }, { status: 400 });
	}
	const apiKey = process.env["LOVABLE_API_KEY"];
	if (!apiKey) return Response.json({ error: "AI is not configured" }, { status: 500 });
	const provider = createOpenAI({
		baseURL: "https://ai.gateway.lovable.dev/v1",
		apiKey,
		headers: {
			"Lovable-API-Key": apiKey,
			"X-Lovable-AIG-SDK": "vercel-ai-sdk"
		},
		fetch: async (input, init) => {
			const res = await fetch(input, init);
			if (!res.ok) console.error(`AI gateway error [${res.status}]: ${await res.clone().text()}`);
			return res;
		}
	});
	let failStatus = 0;
	const result = streamText({
		model: provider.responses("openai/gpt-6-astra"),
		instructions,
		messages: [{
			role: "user",
			content: parts
		}],
		abortSignal: request.signal,
		maxRetries: 0,
		providerOptions: { openai: {
			store: false,
			forceReasoning: true,
			reasoningEffort: "low",
			reasoningSummary: "auto",
			include: ["reasoning.encrypted_content"]
		} },
		onError: ({ error }) => {
			failStatus = error.statusCode ?? 500;
			console.error("inspect stream error", error);
		}
	});
	const enc = new TextEncoder();
	const stream = new ReadableStream({ async start(controller) {
		try {
			for await (const chunk of result.textStream) controller.enqueue(enc.encode(chunk));
			if (failStatus) controller.enqueue(enc.encode(`\n\n[[error:${failStatus}]]`));
		} catch {
			controller.enqueue(enc.encode("\n\n[[error:500]]"));
		}
		controller.close();
	} });
	return new Response(stream, { headers: {
		"Content-Type": "text/plain; charset=utf-8",
		"Cache-Control": "no-cache, no-transform"
	} });
} } } });
var rootRouteChildren = {
	IndexRoute: Route$10.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$11
	}),
	AboutRoute: Route$9.update({
		id: "/about",
		path: "/about",
		getParentRoute: () => Route$11
	}),
	AdvisorRoute: Route$8.update({
		id: "/advisor",
		path: "/advisor",
		getParentRoute: () => Route$11
	}),
	AuthRoute: Route$7.update({
		id: "/auth",
		path: "/auth",
		getParentRoute: () => Route$11
	}),
	ConsultRoute: Route$6.update({
		id: "/consult",
		path: "/consult",
		getParentRoute: () => Route$11
	}),
	ContactRoute: Route$5.update({
		id: "/contact",
		path: "/contact",
		getParentRoute: () => Route$11
	}),
	InspectRoute: Route$4.update({
		id: "/inspect",
		path: "/inspect",
		getParentRoute: () => Route$11
	}),
	ServicesRoute: Route$3.update({
		id: "/services",
		path: "/services",
		getParentRoute: () => Route$11
	}),
	ApiAdvisorRoute: Route$2.update({
		id: "/api/advisor",
		path: "/api/advisor",
		getParentRoute: () => Route$11
	}),
	ApiConsultRoute: Route$1.update({
		id: "/api/consult",
		path: "/api/consult",
		getParentRoute: () => Route$11
	}),
	ApiInspectRoute: Route.update({
		id: "/api/inspect",
		path: "/api/inspect",
		getParentRoute: () => Route$11
	})
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
