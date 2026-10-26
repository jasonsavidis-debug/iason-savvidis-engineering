import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useLang } from "./i18n-DE0j_coE.mjs";
import { t as PageIntro } from "./SiteHeader-CBv47G-c.mjs";
import { t as Button } from "./button-CUPMFvVo.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DMRu3jXA.mjs";
import { n as objectType, r as stringType, t as literalType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-ZfDsZF3O.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var contactSchema = objectType({
	name: stringType().trim().min(1).max(100),
	email: stringType().trim().email().max(255),
	phone: stringType().trim().max(40).optional().or(literalType("")),
	service: stringType().trim().max(100).optional().or(literalType("")),
	message: stringType().trim().min(1).max(2e3)
});
var submitContact = createServerFn({ method: "POST" }).inputValidator((data) => contactSchema.parse(data)).handler(createSsrRpc("1ac20e83585a55e943670fa4670b07889b610801a7a21f28dc367c19f92e50fd"));
var field = "w-full border-0 border-b border-input bg-transparent px-0 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";
function Contact() {
	const { t } = useLang();
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		const form = e.currentTarget;
		const parsed = contactSchema.safeParse(Object.fromEntries(new FormData(form)));
		if (!parsed.success) {
			toast.error(t.contact.err);
			return;
		}
		setLoading(true);
		try {
			await submitContact({ data: parsed.data });
			toast.success(t.contact.ok);
			form.reset();
		} catch {
			toast.error(t.contact.err);
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: t.contact.kicker,
		title: t.contact.title,
		intro: t.contact.intro
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-[1fr_1.4fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "label-mono",
						children: ["// ", t.info.address]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "tel:+306946877588",
						className: "mt-3 block font-display text-3xl font-semibold hover:text-primary",
						children: t.info.phone
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: `mailto:${t.info.email}`,
						className: "mt-2 block font-mono text-sm text-muted-foreground hover:text-primary",
						children: t.info.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "https://www.instagram.com/engineer.savvidis/",
						target: "_blank",
						rel: "noreferrer",
						className: "mt-1 block font-mono text-sm text-muted-foreground hover:text-primary",
						children: ["@", t.info.instagram]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "label-mono",
					children: ["// ", t.info.hoursTitle]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-1 text-muted-foreground",
					children: t.info.hours.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: h }, h))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "hero",
							className: "h-11 rounded-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "tel:+306946877588",
								children: t.info.call
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "line",
							className: "h-11 rounded-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://www.google.com/maps/dir/?api=1&destination=40.599759,22.977381",
								target: "_blank",
								rel: "noreferrer",
								children: t.info.directions
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "line",
							className: "h-11 rounded-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://www.instagram.com/engineer.savvidis/",
								target: "_blank",
								rel: "noreferrer",
								children: t.info.follow
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					title: "Map",
					src: "https://maps.google.com/maps?q=40.599759,22.977381&z=16&output=embed",
					className: "aspect-[4/3] w-full border border-border grayscale invert-[0.9] hue-rotate-180",
					loading: "lazy"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "grid content-start gap-8 md:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					name: "name",
					required: true,
					maxLength: 100,
					placeholder: t.contact.name,
					className: field
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					name: "email",
					type: "email",
					required: true,
					maxLength: 255,
					placeholder: t.contact.email,
					className: field
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					name: "phone",
					maxLength: 40,
					placeholder: t.contact.phone,
					className: field
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					name: "service",
					defaultValue: "",
					className: `${field} bg-background`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: t.contact.service
					}), t.services.items.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s.t,
						children: s.t
					}, s.t))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					name: "message",
					required: true,
					maxLength: 2e3,
					rows: 5,
					placeholder: t.contact.message,
					className: `${field} md:col-span-2 resize-none`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "hero",
						size: "lg",
						disabled: loading,
						className: "h-12 rounded-none",
						children: loading ? t.contact.sending : t.contact.send
					})
				})
			]
		})]
	})] });
}
//#endregion
export { Contact as component };
