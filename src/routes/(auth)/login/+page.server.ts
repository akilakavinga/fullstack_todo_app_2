import { message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { loginSchema } from "$lib";
import { fail, type Actions } from "@sveltejs/kit";
import { AuthApiError } from "@supabase/supabase-js";

export const load = (async ({ params }) => {
  const form = await superValidate(zod(loginSchema));
  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(loginSchema));

    if (!form.valid) {
      return fail(400, { form });
    }
    const { data: email_data } = await supabase
      .from("emails_and_usernames")
      .select()
      .eq("email", form.data.email)
      .single();

    if (!email_data) {
      message(form, { status: "error" });
      return setError(form, "email", "Email does not exist");
    }

    const { data, error } = await supabase.auth.signInWithPassword(form.data);

    if (error) {
      if (error instanceof AuthApiError) {
        message(form, { status: "error", details: JSON.stringify(error) });
        return setError(form, "password", "Incorrect password");
      } else {
        throw error;
      }
    }

    return message(form, "Success!");
  },
};
