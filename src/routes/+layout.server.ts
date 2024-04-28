import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals: { safeGetSession, supabase } }) => {
  const { user, session } = await safeGetSession();

  return { user, session };
}) satisfies LayoutServerLoad;
