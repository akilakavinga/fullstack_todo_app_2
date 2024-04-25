import { error, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Session, User } from "@supabase/supabase-js";

export const load = (async ({ locals: { supabase } }) => {
  const { data: todos } = await supabase
    .from("todos")
    .select()
    .order("inserted_at", { ascending: false });
  return { todos };
}) satisfies PageServerLoad;

export const actions: Actions = {
  async add_todo({ locals: { supabase, safeGetSession }, request }) {
    const { user } = (await safeGetSession()) as {
      session: Session | null;
      user: User | null;
    };

    if (!user) {
      error(404, "User Not Found!");
    }

    const { task } = Object.fromEntries(await request.formData()) as {
      task: string;
    };
    const user_id = user.id;

    const {
      data,
      error: insertError,
      status: insertStatus,
    } = await supabase
      .from("todos")
      .insert({ task, user_id })
      .select()
      .single();

    if (insertError) {
      error(insertStatus, insertError);
    }

    return data;
  },

  async edit_task({ locals: { supabase }, url }) {
    let { id, new_task } = Object.fromEntries(url.searchParams);

    const {
      data: taskData,
      error: taskError,
      status: taskStatus,
    } = await supabase
      .from("todos")
      .update({ task: new_task })
      .eq("id", id)
      .select()
      .single();

    if (taskError) {
      error(taskStatus, taskError);
    }

    return { data: taskData };
  },

  async complete_todo({ locals: { supabase }, url }) {
    let { id, is_complete } = Object.fromEntries(url.searchParams);

    const { error: updateError, status: updateStatus } = await supabase
      .from("todos")
      .update({ is_complete: is_complete === "true" })
      .eq("id", id);

    if (updateError) {
      error(updateStatus, updateError);
    }

    return { data: "success" };
  },

  async delete_todo({ locals: { supabase }, url }) {
    const { id } = Object.fromEntries(url.searchParams);

    const { error: deleteError, status: deleteStatus } = await supabase
      .from("todos")
      .delete()
      .eq("id", id);

    if (deleteError) {
      error(deleteStatus, deleteError);
    }
    return { data: "success" };
  },
};
