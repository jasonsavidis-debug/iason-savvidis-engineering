import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useLang } from "./i18n-DE0j_coE.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Menu, l as Instagram, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SiteHeader-CBv47G-c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var logo_mark_default = "/assets/logo-mark-CdUGTFr_.png";
function SiteHeader() {
	const { t, lang, setLang } = useLang();
	const [open, setOpen] = (0, import_react.useState)(false);
	const links = [
		{
			to: "/",
			label: t.nav.home
		},
		{
			to: "/services",
			label: t.nav.services
		},
		{
			to: "/about",
			label: t.nav.about
		},
		{
			to: "/advisor",
			label: t.nav.advisor
		},
		{
			to: "/inspect",
			label: t.nav.inspect
		},
		{
			to: "/consult",
			label: t.nav.consult
		},
		{
			to: "/contact",
			label: t.nav.contact
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: `fixed inset-x-0 top-0 z-50 border-b border-border backdrop-blur-xl ${open ? "bg-background" : "bg-background/70"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex min-w-0 items-center gap-2.5 sm:gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: logo_mark_default,
							alt: "",
							width: 40,
							height: 36,
							className: "h-9 w-auto shrink-0"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 truncate font-display text-xs font-semibold tracking-tight sm:hidden",
							children: t.brandShort
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden min-w-0 truncate font-display text-sm font-semibold tracking-tight sm:block",
							children: t.brand
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-8 md:flex",
					children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: l.to,
						activeOptions: { exact: true },
						className: "label-mono transition-colors hover:text-foreground data-[status=active]:text-primary",
						children: l.label
					}, l.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex border border-border font-mono text-xs",
						children: ["en", "el"].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setLang(l),
							className: `px-2.5 py-1 uppercase transition-colors ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
							children: l === "en" ? "EN" : "ΕΛ"
						}, l))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "md:hidden",
						onClick: () => setOpen(!open),
						"aria-label": "Menu",
						children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
					})]
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "flex flex-col gap-4 border-t border-border bg-background px-6 py-6 md:hidden",
			children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: l.to,
				onClick: () => setOpen(false),
				className: "label-mono",
				children: l.label
			}, l.to))
		})]
	});
}
function SiteFooter() {
	const { t } = useLang();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-10 md:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display font-semibold",
					children: t.brand
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-mono mt-1",
					children: t.tagline
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "label-mono mt-3 flex flex-wrap gap-x-4 gap-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "tel:+306946877588",
							className: "hover:text-primary",
							children: t.info.phone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `mailto:${t.info.email}`,
							className: "hover:text-primary",
							children: t.info.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "https://www.instagram.com/engineer.savvidis/",
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center gap-1.5 hover:text-primary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-3.5 w-3.5" }),
								"@",
								t.info.instagram
							]
						})
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "label-mono self-end",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" — ",
					t.footer
				]
			})]
		})
	});
}
function PageIntro({ kicker, title, intro }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "grid-lines border-b border-border pt-36 pb-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-6 animate-rise",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "label-mono text-primary",
					children: ["// ", kicker]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-6 max-w-4xl text-5xl font-semibold md:text-7xl",
					children: title
				}),
				intro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-2xl text-lg text-muted-foreground",
					children: intro
				})
			]
		})
	});
}
//#endregion
export { SiteFooter as n, SiteHeader as r, PageIntro as t };
