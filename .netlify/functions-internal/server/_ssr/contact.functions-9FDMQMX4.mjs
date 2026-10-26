import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { n as objectType, r as stringType, t as literalType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact.functions-9FDMQMX4.js
var contactSchema = objectType({
	name: stringType().trim().min(1).max(100),
	email: stringType().trim().email().max(255),
	phone: stringType().trim().max(40).optional().or(literalType("")),
	service: stringType().trim().max(100).optional().or(literalType("")),
	message: stringType().trim().min(1).max(2e3)
});
var submitContact_createServerFn_handler = createServerRpc({
	id: "1ac20e83585a55e943670fa4670b07889b610801a7a21f28dc367c19f92e50fd",
	name: "submitContact",
	filename: "src/lib/contact.functions.ts"
}, (opts) => submitContact.__executeServer(opts));
var submitContact = createServerFn({ method: "POST" }).inputValidator((data) => contactSchema.parse(data)).handler(submitContact_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { error } = await supabaseAdmin.from("contact_submissions").insert({
		name: data.name,
		email: data.email,
		phone: data.phone || null,
		service: data.service || null,
		message: data.message
	});
	if (error) {
		console.error(error);
		throw new Error("Could not save submission");
	}
	return { ok: true };
});
//#endregion
export { submitContact_createServerFn_handler };
