import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useLang } from "./i18n-DE0j_coE.mjs";
import { t as PageIntro } from "./SiteHeader-CBv47G-c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-DGVIkt-G.js
var import_jsx_runtime = require_jsx_runtime();
var office_jpeg_asset_default = {
	version: 1,
	asset_id: "ce9c165e-2ad7-4325-a4ad-4eb1afcff375",
	project_id: "a10d5bf5-6ea4-56a3-8ac4-6716a7123118",
	url: "/__l5e/assets-v1/ce9c165e-2ad7-4325-a4ad-4eb1afcff375/office.jpeg",
	r2_key: "a/v1/a10d5bf5-6ea4-56a3-8ac4-6716a7123118/ce9c165e-2ad7-4325-a4ad-4eb1afcff375/office.jpeg",
	original_filename: "office.jpeg",
	size: 296026,
	content_type: "image/jpeg",
	created_at: "2026-10-26T12:41:43Z"
};
function About() {
	const { t } = useLang();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			kicker: t.about.kicker,
			title: t.about.title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6 text-lg text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-2xl text-foreground",
					children: t.about.p1
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t.about.p2 })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: office_jpeg_asset_default.url,
				alt: t.about.photoAlt,
				loading: "lazy",
				className: "mono max-h-[640px] w-full border border-border object-cover"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid max-w-7xl md:grid-cols-3",
				children: t.about.values.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border p-10 md:border-b-0 md:border-r last:border-r-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-2xl font-semibold text-primary",
						children: v.t
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted-foreground",
						children: v.d
					})]
				}, v.t))
			})
		})
	] });
}
//#endregion
export { About as component };
