import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database";

export async function downloadAvatar(
  path: string,
  supabase: SupabaseClient<Database>
) {
  const { data, error } = await supabase.storage.from("avatars").download(path);

  if (error) {
    throw error;
  }

  const url = URL.createObjectURL(data);
  return url;
}
