// See https://kit.svelte.dev/docs/types#app

import type { Database } from "$lib/database";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient<Database>;
      safeGetSession: () => Promise<{
        session: Session | null;
        user: User | null;
      }>;
    }
    interface PageData {
      user?: User | null;
      session?: Session | null;
      supabase?: SupabaseClient;
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
