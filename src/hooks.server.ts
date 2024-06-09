import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import type { Theme } from "$lib/typing";
import { createServerClient } from "@supabase/ssr";
import type { Session, User } from "@supabase/supabase-js";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ resolve, event }) => {
  /* ---------------------------- Dark Mode Toggle ---------------------------- */
  console.log("hello");

  const theme = event.cookies.get("theme") as Theme;
  let finalThemeDataAttribute: string = "";
  if (theme) {
    finalThemeDataAttribute = `data-theme="${theme}"`;
  }

  /* -------------------------------------------------------------------------- */

  /* -------------------------------- Supabase -------------------------------- */

  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(key) {
          return event.cookies.get(key);
        },
        set(key, value, options) {
          return event.cookies.set(key, value, { path: "/", ...options });
        },
        remove(key, options) {
          return event.cookies.delete(key, { path: "/", ...options });
        },
      },
    }
  );

  event.locals.safeGetSession = async () => {
    const {
      data: { user },
      error: err,
    } = await event.locals.supabase.auth.getUser();

    if (err) {
      return { session: null, user: null };
    }
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();

    if (!session) {
      return { session: null, user: null };
    }

    //@ts-ignore
    delete session.user;

    return { session, user } as { session: Session; user: User };
  };

  /* -------------------------------------------------------------------------- */

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range";
    },
    transformPageChunk({ html }) {
      return html.replace("__theme__", finalThemeDataAttribute);
    },
  });
};
