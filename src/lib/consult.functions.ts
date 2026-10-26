import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ConsultFile = { path: string; name: string; mime: string };

const BUCKET = "consultation-files";
const MAX_FILES = 6;

/** The visitor's single conversation: description, uploaded files and the message history. */
export const getConsultation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: consultation, error } = await supabase
      .from("consultations")
      .select("id, description, files, created_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!consultation) return null;

    const { data: messages, error: mErr } = await supabase
      .from("consultation_messages")
      .select("id, role, content, created_at")
      .eq("consultation_id", consultation.id)
      .order("created_at", { ascending: true });
    if (mErr) throw new Error(mErr.message);

    return { consultation, messages: messages ?? [] };
  });

/** Opens the conversation once the description is written and the files are already in storage. */
export const startConsultation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { description: string; files: ConsultFile[] }) => input)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const description = (data.description || "").trim().slice(0, 4000);
    if (description.length < 20) throw new Error("TOO_SHORT");

    const files = (data.files || [])
      .filter((f) => typeof f?.path === "string" && f.path.startsWith(`${userId}/`) && f.path.length < 400)
      .slice(0, MAX_FILES)
      .map((f) => ({ path: f.path, name: String(f.name ?? "file").slice(0, 120), mime: String(f.mime ?? "application/octet-stream") }));

    // One conversation per person: a second submit keeps the first one.
    const { data: existing } = await supabase
      .from("consultations")
      .select("id, description, files, created_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (existing) return existing;

    const { data: row, error } = await supabase
      .from("consultations")
      .insert({ user_id: userId, description, files })
      .select("id, description, files, created_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

/** Clears the conversation and the files that belong to it. */
export const resetConsultation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: row } = await supabase.from("consultations").select("files").eq("user_id", userId).maybeSingle();
    const paths = ((row?.files ?? []) as ConsultFile[]).map((f) => f.path).filter(Boolean);
    if (paths.length) await supabase.storage.from(BUCKET).remove(paths);

    const { error } = await supabase.from("consultations").delete().eq("user_id", userId);
    if (error) throw new Error(error.message);
    return true;
  });
