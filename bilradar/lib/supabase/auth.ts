import "server-only";
import type { User } from "@supabase/supabase-js";
import { createClient } from "./server";
import { isSupabaseConfigured } from "./config";
import { ADMIN_EMAILS } from "@/lib/config";

export interface AuthState {
  configured: boolean;
  user: User | null;
  isAdmin: boolean;
}

/**
 * Henter innlogget bruker og avgjør om vedkommende er admin.
 * Admin = e-post i ADMIN_EMAILS ELLER profiles.is_admin = true.
 */
export async function getAuthState(): Promise<AuthState> {
  if (!isSupabaseConfigured()) {
    return { configured: false, user: null, isAdmin: false };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { configured: true, user: null, isAdmin: false };

  let isAdmin = ADMIN_EMAILS.includes((user.email ?? "").toLowerCase());
  if (!isAdmin) {
    const { data } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();
    isAdmin = Boolean(data?.is_admin);
  }

  return { configured: true, user, isAdmin };
}
