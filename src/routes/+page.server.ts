import type { Theme } from "$lib/typing";
import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  async change_theme({ cookies, url }) {
    const { theme, redirectTo } = Object.fromEntries(url.searchParams) as {
      theme: Theme;
      redirectTo: string;
    };
    cookies.set("theme", theme, { path: "/", maxAge: 60 * 60 * 24 * 365 });

    return redirect(303, redirectTo);
  },

  async sign_out({ locals: { supabase } }) {
    const { error: err } = await supabase.auth.signOut();

    if (err) {
      console.error(err);
    }

    return redirect(303, "/login");
  },
};
