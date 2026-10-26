import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useLang } from "./i18n-DE0j_coE.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as ArrowUpRight, i as Sparkles, r as Square } from "../_libs/lucide-react.mjs";
import { t as PageIntro } from "./SiteHeader-CBv47G-c.mjs";
import { t as Button } from "./button-CUPMFvVo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/advisor-CeZcHQ4j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Advisor() {
	const { t, lang } = useLang();
	const a = t.advisor;
	const [text, setText] = (0, import_react.useState)("");
	const [out, setOut] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)("");
	const ctrl = (0, import_react.useRef)(null);
	async function run() {
		if (text.trim().length < 10) {
			setErr(a.tooShort);
			return;
		}
		setErr("");
		setOut("");
		setBusy(true);
		const c = new AbortController();
		ctrl.current = c;
		try {
			const res = await fetch("/api/advisor", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					description: text,
					lang
				}),
				signal: c.signal
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: "desc",
				className: "label-mono mt-8 block text-primary",
				children: a.label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id: "desc",
				value: text,
				onChange: (e) => setText(e.target.value),
				maxLength: 3e3,
				rows: 9,
				placeholder: a.placeholder,
				className: "mt-3 w-full border border-border bg-card p-4 text-foreground outline-none focus:border-primary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-3",
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}),
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
export { Advisor as component };
