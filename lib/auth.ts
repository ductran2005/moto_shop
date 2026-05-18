import type { SupabaseClient, User } from "@supabase/supabase-js";

export type AppRole = "admin" | "user" | null;

export interface ProfileRoleResult {
  role: AppRole;
  rawRole: string | null;
  hasProfile: boolean;
  error: string | null;
}

export async function getProfileRole(
  supabase: SupabaseClient,
  user: User,
): Promise<AppRole> {
  const result = await getProfileRoleResult(supabase, user);
  return result.role;
}

export async function getProfileRoleResult(
  supabase: SupabaseClient,
  user: User,
): Promise<ProfileRoleResult> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load profile role:", error.message);
    return {
      role: null,
      rawRole: null,
      hasProfile: false,
      error: error.message,
    };
  }

  const rawRole = typeof data?.role === "string" ? data.role : null;

  return {
    role: rawRole === "admin" || rawRole === "user" ? rawRole : null,
    rawRole,
    hasProfile: Boolean(data?.id),
    error: null,
  };
}
