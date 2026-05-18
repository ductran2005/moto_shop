import { NextResponse } from "next/server";

import { getProfileRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (next) {
        return NextResponse.redirect(new URL(next, requestUrl.origin));
      }

      const role = await getProfileRole(supabase, data.user);

      const destination = role === "admin" ? "/admin" : "/";
      return NextResponse.redirect(new URL(destination, requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL("/login?error=oauth_callback", requestUrl.origin));
}
