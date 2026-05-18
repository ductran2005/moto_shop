import { NextResponse } from "next/server";

import { getProfileRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }

  const role = await getProfileRole(supabase, user);

  const destination = role === "admin" ? "/admin" : "/";
  return NextResponse.redirect(new URL(destination, requestUrl.origin));
}
