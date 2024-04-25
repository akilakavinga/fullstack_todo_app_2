import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals: { safeGetSession } }) => {
  const { user, session } = await safeGetSession();
  return { user, session };
}) satisfies LayoutServerLoad;
