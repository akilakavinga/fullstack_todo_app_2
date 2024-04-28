import { error, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { fail, setError, superValidate, withFiles } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { avatarSchema, profileSchema } from "$lib";

// export const csr = false;

export const load = (async ({ locals: { supabase, safeGetSession } }) => {
  const profileForm = await superValidate(zod(profileSchema));
  const avatarForm = await superValidate(zod(avatarSchema));

  const { user } = await safeGetSession();
  const { data: profile } = await supabase
    .from("profiles")
    .select()
    .eq("id", user.id)
    .single();

  if (!profile) {
    throw error(404, "Profile not found");
  }

  return { profileForm, avatarForm, profile };
}) satisfies PageServerLoad;

export const actions: Actions = {
  async update_profile({ request, locals: { supabase, safeGetSession } }) {
    console.log("---- Update Profile");
    const form = await superValidate(request, zod(profileSchema));
    const { username, website, avatar_url } = form.data;

    if (!username && !website) {
      return { form };
    }

    if (!form.valid) {
      return fail(404, { form });
    }

    if (username) {
      const { data: usernameData } = await supabase
        .from("emails_and_usernames")
        .select("username")
        .eq("username", username)
        .single();

      if (usernameData) {
        return setError(form, "username", "Username already in use");
      }
    }

    const { user } = await safeGetSession();

    const { error: err } = await supabase.from("profiles").upsert({
      id: user.id,
      avatar_url: "",
      username: username,
      website: website,
      updated_at: new Date().toISOString(),
    });

    if (err) {
      return fail(400, { form });
    }

    return { form };
  },

  async update_avatar({ request, locals: { supabase, safeGetSession } }) {
    const form = await superValidate(request, zod(avatarSchema));

    if (!form.valid) {
      return fail(404, withFiles({ form }));
    }
    const { avatar } = form.data;
    const fileExt = avatar.name.split(".").pop();
    const filePath = `${Math.random()}.${fileExt}`;

    const { error: err } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatar);

    if (err) {
      return fail(400, withFiles({ form }));
    }

    const { user } = await safeGetSession();

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      avatar_url: filePath,
    });

    if (error) {
      return fail(400, withFiles({ form }));
    }

    const { error: userErr } = await supabase.auth.updateUser({
      data: { avatar_url: filePath },
    });

    if (userErr) {
      return fail(400, withFiles({ form }));
    }

    return withFiles({ form });
  },
};
