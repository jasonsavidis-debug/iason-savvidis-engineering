import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dcy-eaQM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/consult.functions-C0E17T57.js
var BUCKET = "consultation-files";
var MAX_FILES = 6;
/** The visitor's single conversation: description, uploaded files and the message history. */
var getConsultation_createServerFn_handler = createServerRpc({
	id: "7f0554bcf4014fcbcd608aa28a16af2fc22ac0c67e21a42cf81afd4c53808ba2",
	name: "getConsultation",
	filename: "src/lib/consult.functions.ts"
}, (opts) => getConsultation.__executeServer(opts));
var getConsultation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(getConsultation_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const { data: consultation, error } = await supabase.from("consultations").select("id, description, files, created_at").eq("user_id", userId).maybeSingle();
	if (error) throw new Error(error.message);
	if (!consultation) return null;
	const { data: messages, error: mErr } = await supabase.from("consultation_messages").select("id, role, content, created_at").eq("consultation_id", consultation.id).order("created_at", { ascending: true });
	if (mErr) throw new Error(mErr.message);
	return {
		consultation,
		messages: messages ?? []
	};
});
var startConsultation_createServerFn_handler = createServerRpc({
	id: "df921925b0a29c27fa9db635e4caac3c1afac590ba3a4d59a6112d6907c3b641",
	name: "startConsultation",
	filename: "src/lib/consult.functions.ts"
}, (opts) => startConsultation.__executeServer(opts));
var startConsultation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(startConsultation_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const description = (data.description || "").trim().slice(0, 4e3);
	if (description.length < 20) throw new Error("TOO_SHORT");
	const files = (data.files || []).filter((f) => typeof f?.path === "string" && f.path.startsWith(`${userId}/`) && f.path.length < 400).slice(0, MAX_FILES).map((f) => ({
		path: f.path,
		name: String(f.name ?? "file").slice(0, 120),
		mime: String(f.mime ?? "application/octet-stream")
	}));
	const { data: existing } = await supabase.from("consultations").select("id, description, files, created_at").eq("user_id", userId).maybeSingle();
	if (existing) return existing;
	const { data: row, error } = await supabase.from("consultations").insert({
		user_id: userId,
		description,
		files
	}).select("id, description, files, created_at").single();
	if (error) throw new Error(error.message);
	return row;
});
var resetConsultation_createServerFn_handler = createServerRpc({
	id: "59c84ce77fdd4d25658ee699331e52e534722446c4655acf447caa74e9f698a1",
	name: "resetConsultation",
	filename: "src/lib/consult.functions.ts"
}, (opts) => resetConsultation.__executeServer(opts));
var resetConsultation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(resetConsultation_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const { data: row } = await supabase.from("consultations").select("files").eq("user_id", userId).maybeSingle();
	const paths = (row?.files ?? []).map((f) => f.path).filter(Boolean);
	if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
	const { error } = await supabase.from("consultations").delete().eq("user_id", userId);
	if (error) throw new Error(error.message);
	return true;
});
//#endregion
export { getConsultation_createServerFn_handler, resetConsultation_createServerFn_handler, startConsultation_createServerFn_handler };
