import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals: { safeGetSession } }) => {
  const { user } = await safeGetSession();

  if (!user) return redirect(303, "/login");

  return { user, session: null };
}) satisfies LayoutServerLoad;
