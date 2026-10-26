import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useLang } from "./i18n-DE0j_coE.mjs";
import { a as Send, n as Upload, r as Square, s as RotateCcw, t as X, u as FileText } from "../_libs/lucide-react.mjs";
import { t as PageIntro } from "./SiteHeader-CBv47G-c.mjs";
import { t as Button } from "./button-CUPMFvVo.mjs";
import { t as supabase } from "./client-7PWcWUUz.mjs";
import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dcy-eaQM.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DMRu3jXA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/consult-BwuFfPPW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** The visitor's single conversation: description, uploaded files and the message history. */
var getConsultation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("7f0554bcf4014fcbcd608aa28a16af2fc22ac0c67e21a42cf81afd4c53808ba2"));
/** Opens the conversation once the description is written and the files are already in storage. */
var startConsultation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("df921925b0a29c27fa9db635e4caac3c1afac590ba3a4d59a6112d6907c3b641"));
/** Clears the conversation and the files that belong to it. */
var resetConsultation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("59c84ce77fdd4d25658ee699331e52e534722446c4655acf447caa74e9f698a1"));
var MAX_FILES = 6;
var DRAFT_KEY = "consult-draft";
async function readImage(file) {
	const url = URL.createObjectURL(file);
	const img = await new Promise((res, rej) => {
		const i = new Image();
		i.onload = () => res(i);
		i.onerror = rej;
		i.src = url;
	});
	const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
	const c = document.createElement("canvas");
	c.width = Math.round(img.width * scale);
	c.height = Math.round(img.height * scale);
	c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
	URL.revokeObjectURL(url);
	const blob = await new Promise((res) => c.toBlob((b) => res(b), "image/jpeg", .85));
	return {
		name: file.name,
		mime: "image/jpeg",
		blob,
		preview: URL.createObjectURL(blob)
	};
}
function Consult() {
	const { t, lang } = useLang();
	const c = t.consult;
	const [session, setSession] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [consultation, setConsultation] = (0, import_react.useState)(null);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [description, setDescription] = (0, import_react.useState)("");
	const [items, setItems] = (0, import_react.useState)([]);
	const [question, setQuestion] = (0, import_react.useState)("");
	const [out, setOut] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)("");
	const ctrl = (0, import_react.useRef)(null);
	const input = (0, import_react.useRef)(null);
	const endRef = (0, import_react.useRef)(null);
	const load = (0, import_react.useCallback)(async () => {
		const res = await getConsultation();
		if (res) {
			setConsultation(res.consultation);
			setMessages(res.messages.map((m) => ({
				role: m.role,
				content: m.content
			})));
		} else {
			setConsultation(null);
			setMessages([]);
		}
	}, []);
	(0, import_react.useEffect)(() => {
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
		return () => {
			live = false;
			sub.subscription.unsubscribe();
		};
	}, [load]);
	(0, import_react.useEffect)(() => {
		const draft = sessionStorage.getItem(DRAFT_KEY);
		if (draft) {
			setDescription(draft);
			sessionStorage.removeItem(DRAFT_KEY);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		endRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end"
		});
	}, [messages, out]);
	async function add(list) {
		if (!list) return;
		setErr("");
		const next = [...items];
		for (const f of Array.from(list)) {
			if (next.length >= MAX_FILES) {
				setErr(c.tooMany);
				break;
			}
			try {
				if (f.type.startsWith("image/")) next.push(await readImage(f));
				else if (f.type === "application/pdf") {
					if (f.size > 6291456) {
						setErr(c.tooBig);
						continue;
					}
					next.push({
						name: f.name,
						mime: "application/pdf",
						blob: f
					});
				} else setErr(c.badType);
			} catch {
				setErr(c.badType);
			}
		}
		setItems(next);
		if (input.current) input.current.value = "";
	}
	async function submit() {
		if (description.trim().length < 20) {
			setErr(c.tooShort);
			return;
		}
		if (!session) {
			sessionStorage.setItem(DRAFT_KEY, description);
			window.location.href = "/auth";
			return;
		}
		setErr("");
		setSubmitting(true);
		try {
			const folder = `${session.user.id}/${crypto.randomUUID()}`;
			const files = [];
			for (const [i, it] of items.entries()) {
				const ext = it.mime === "application/pdf" ? "pdf" : "jpg";
				const path = `${folder}/${i + 1}.${ext}`;
				const { error } = await supabase.storage.from("consultation-files").upload(path, it.blob, {
					contentType: it.mime,
					upsert: true
				});
				if (error) {
					setErr(c.error);
					setSubmitting(false);
					return;
				}
				files.push({
					path,
					name: it.name,
					mime: it.mime
				});
			}
			await startConsultation({ data: {
				description,
				files
			} });
			setDescription("");
			setItems([]);
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
		setErr("");
		setOut("");
		setBusy(true);
		const c0 = new AbortController();
		ctrl.current = c0;
		try {
			const { data } = await supabase.auth.getSession();
			const token = data.session?.access_token;
			const res = await fetch("/api/consult", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					question: q,
					lang
				}),
				signal: c0.signal
			});
			if (!res.ok || !res.body) {
				setErr(res.status === 401 ? c.signInTitle : c.error);
				return;
			}
			const reader = res.body.getReader();
			const dec = new TextDecoder();
			let acc = "";
			for (;;) {
				const { done, value } = await reader.read();
				if (done) break;
				acc += dec.decode(value, { stream: true });
				const m = acc.match(/\[\[error:(\d+)\]\]/);
				if (m) {
					acc = acc.replace(m[0], "").trim();
					setErr(m[1] === "402" || m[1] === "429" ? c.busy : c.error);
				}
				setOut(acc);
			}
			if (acc.trim() && !err) setMessages((prev) => [
				...prev,
				{
					role: "user",
					content: q
				},
				{
					role: "assistant",
					content: acc
				}
			]);
			setQuestion("");
		} catch (e) {
			if (e.name !== "AbortError") setErr(c.error);
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
			setConsultation(null);
			setMessages([]);
			setItems([]);
			setDescription("");
		} catch {
			setErr(c.error);
		} finally {
			setSubmitting(false);
		}
	}
	const signedIn = !!session;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: c.kicker,
		title: c.title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-lg text-muted-foreground",
			children: c.intro
		}), consultation ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "label-mono mt-8 text-primary",
				children: ["// ", c.yourProject]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 whitespace-pre-wrap leading-relaxed text-foreground",
				children: consultation.description
			}),
			consultation.files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "label-mono mt-8 text-primary",
				children: ["// ", c.yourFiles]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid grid-cols-3 gap-2",
				children: consultation.files.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoredThumb, {
					path: f.path,
					name: f.name,
					fallback: c.yourFiles,
					index: i
				}, f.path))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "line",
					size: "sm",
					className: "rounded-none",
					onClick: reset,
					disabled: submitting,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}),
						" ",
						c.reset
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground",
					children: [
						c.signedInAs,
						" ",
						session?.user.email,
						" ·",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "underline hover:text-primary",
							onClick: () => supabase.auth.signOut(),
							children: c.signOut
						})
					]
				})]
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: "desc",
				className: "label-mono mt-8 block text-primary",
				children: c.descLabel
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id: "desc",
				value: description,
				onChange: (e) => setDescription(e.target.value),
				maxLength: 4e3,
				rows: 9,
				placeholder: c.descPlaceholder,
				className: "mt-3 w-full border border-border bg-card p-4 text-foreground outline-none focus:border-primary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => input.current?.click(),
				onDragOver: (e) => e.preventDefault(),
				onDrop: (e) => {
					e.preventDefault();
					add(e.dataTransfer.files);
				},
				className: "mt-6 flex w-full flex-col items-center gap-3 border border-dashed border-border bg-card p-10 text-muted-foreground transition hover:border-primary hover:text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6 text-primary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.drop }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono text-xs",
						children: c.formats
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: input,
				type: "file",
				multiple: true,
				accept: "image/jpeg,image/png,image/webp,application/pdf",
				className: "hidden",
				onChange: (e) => add(e.target.files)
			}),
			items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-3 gap-2",
				children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-square overflow-hidden border border-border bg-card",
					children: [it.preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: it.preview,
						alt: it.name,
						className: "h-full w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-full flex-col items-center justify-center gap-2 p-2 text-center text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-6 w-6 text-primary" }), it.name]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": c.remove,
						onClick: () => setItems(items.filter((_, j) => j !== i)),
						className: "absolute right-1 top-1 bg-background/80 p-1 text-foreground hover:text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "hero",
					size: "lg",
					className: "h-12 rounded-none",
					onClick: submit,
					disabled: submitting || !ready,
					children: submitting ? c.uploading : signedIn ? c.submit : c.signInTitle
				})
			}),
			err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-destructive",
				children: err
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: c.signInBody
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: c.disclaimer
			})
		] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-96 flex-col border border-border bg-card p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "label-mono text-primary",
					children: ["// ", c.chatTitle]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex-1 space-y-6",
					children: [
						messages.length === 0 && !out && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: consultation ? c.empty : c.signInBody
						}),
						messages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: m.role === "user" ? "border-l-2 border-primary pl-4" : "",
							children: [m.role === "user" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-mono mb-1 text-xs text-muted-foreground",
								children: ">"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "whitespace-pre-wrap leading-relaxed text-foreground",
								children: m.content
							})]
						}, i)),
						out && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "whitespace-pre-wrap leading-relaxed text-foreground",
							children: out
						}),
						busy && !out && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "animate-pulse text-muted-foreground",
							children: c.thinking
						}),
						err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-destructive",
							children: err
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: endRef })
					]
				}),
				consultation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 border-t border-border pt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: question,
							onChange: (e) => setQuestion(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									ask();
								}
							},
							maxLength: 2e3,
							rows: 3,
							placeholder: c.qPlaceholder,
							className: "w-full resize-none border border-border bg-background p-3 text-foreground outline-none focus:border-primary"
						}), busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "line",
							size: "icon",
							className: "h-11 w-11 shrink-0 rounded-none",
							onClick: () => ctrl.current?.abort(),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "hero",
							size: "icon",
							className: "h-11 w-11 shrink-0 rounded-none",
							onClick: ask,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: c.disclaimer
					})]
				})
			]
		})]
	})] });
}
/** Private thumbnails: the browser asks for a short-lived signed URL for each stored file. */
function StoredThumb({ path, name, index }) {
	const [url, setUrl] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let live = true;
		supabase.storage.from("consultation-files").createSignedUrl(path, 600).then(({ data }) => {
			if (live && data?.signedUrl) setUrl(data.signedUrl);
		});
		return () => {
			live = false;
		};
	}, [path]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative aspect-square overflow-hidden border border-border bg-card",
		children: [url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: url,
			alt: name,
			className: "h-full w-full object-cover"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-full flex-col items-center justify-center gap-2 p-2 text-center text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-6 w-6 text-primary" }), name]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "label-mono absolute bottom-1 right-1 bg-background/80 px-1 text-[10px]",
			children: index + 1
		})]
	});
}
//#endregion
export { Consult as component };
