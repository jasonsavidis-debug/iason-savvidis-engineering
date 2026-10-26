import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useLang } from "./i18n-DE0j_coE.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as ArrowUpRight, n as Upload, o as ScanSearch, r as Square, t as X, u as FileText } from "../_libs/lucide-react.mjs";
import { t as PageIntro } from "./SiteHeader-CBv47G-c.mjs";
import { t as Button } from "./button-CUPMFvVo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inspect-gfW_1pYs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MAX_FILES = 6;
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
	const dataUrl = c.toDataURL("image/jpeg", .85);
	return {
		name: file.name,
		type: "image/jpeg",
		data: dataUrl.split(",")[1] ?? "",
		preview: dataUrl
	};
}
async function readPdf(file) {
	const dataUrl = await new Promise((res, rej) => {
		const r = new FileReader();
		r.onload = () => res(r.result);
		r.onerror = rej;
		r.readAsDataURL(file);
	});
	return {
		name: file.name,
		type: "application/pdf",
		data: dataUrl.split(",")[1] ?? ""
	};
}
function Inspect() {
	const { t, lang } = useLang();
	const a = t.inspect;
	const [items, setItems] = (0, import_react.useState)([]);
	const [note, setNote] = (0, import_react.useState)("");
	const [out, setOut] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)("");
	const ctrl = (0, import_react.useRef)(null);
	const input = (0, import_react.useRef)(null);
	async function add(list) {
		if (!list) return;
		setErr("");
		const next = [...items];
		for (const f of Array.from(list)) {
			if (next.length >= MAX_FILES) {
				setErr(a.tooMany);
				break;
			}
			try {
				if (f.type.startsWith("image/")) next.push(await readImage(f));
				else if (f.type === "application/pdf") {
					if (f.size > 6291456) {
						setErr(a.tooBig);
						continue;
					}
					next.push(await readPdf(f));
				} else setErr(a.badType);
			} catch {
				setErr(a.badType);
			}
		}
		setItems(next);
		if (input.current) input.current.value = "";
	}
	async function run() {
		if (!items.length) {
			setErr(a.none);
			return;
		}
		setErr("");
		setOut("");
		setBusy(true);
		const c = new AbortController();
		ctrl.current = c;
		try {
			const res = await fetch("/api/inspect", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				signal: c.signal,
				body: JSON.stringify({
					lang,
					note,
					files: items.map(({ name, type, data }) => ({
						name,
						type,
						data
					}))
				})
			});
			if (!res.ok || !res.body) {
				setErr(a.error);
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
					setErr(m[1] === "402" || m[1] === "429" ? a.busy : a.error);
				}
				setOut(acc);
			}
		} catch (e) {
			if (e.name !== "AbortError") setErr(a.error);
		} finally {
			setBusy(false);
			ctrl.current = null;
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: a.kicker,
		title: a.title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-lg text-muted-foreground",
				children: a.intro
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => input.current?.click(),
				onDragOver: (e) => e.preventDefault(),
				onDrop: (e) => {
					e.preventDefault();
					add(e.dataTransfer.files);
				},
				className: "mt-8 flex w-full flex-col items-center gap-3 border border-dashed border-border bg-card p-10 text-muted-foreground transition hover:border-primary hover:text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6 text-primary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.drop }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono text-xs",
						children: a.formats
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
						"aria-label": a.remove,
						onClick: () => setItems(items.filter((_, j) => j !== i)),
						className: "absolute right-1 top-1 bg-background/80 p-1 text-foreground hover:text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: "note",
				className: "label-mono mt-8 block text-primary",
				children: a.noteLabel
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id: "note",
				value: note,
				onChange: (e) => setNote(e.target.value),
				maxLength: 1500,
				rows: 4,
				placeholder: a.notePlaceholder,
				className: "mt-3 w-full border border-border bg-card p-4 text-foreground outline-none focus:border-primary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "line",
					size: "lg",
					className: "h-12 rounded-none",
					onClick: () => ctrl.current?.abort(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {}),
						" ",
						a.stop
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "hero",
					size: "lg",
					className: "h-12 rounded-none",
					onClick: run,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanSearch, {}),
						" ",
						a.submit
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: a.disclaimer
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-64 border border-border bg-card p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "label-mono text-primary",
					children: ["// ", a.resultTitle]
				}),
				busy && !out && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 animate-pulse text-muted-foreground",
					children: a.thinking
				}),
				!busy && !out && !err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-muted-foreground",
					children: a.empty
				}),
				out && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 whitespace-pre-wrap leading-relaxed text-foreground",
					children: out
				}),
				err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-destructive",
					children: err
				}),
				out && !busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "hero",
					className: "mt-8 h-11 rounded-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/contact",
						children: [
							a.cta,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})
						]
					})
				})
			]
		})]
	})] });
}
//#endregion
export { Inspect as component };
