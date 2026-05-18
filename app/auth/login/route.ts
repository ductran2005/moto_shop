import { NextResponse } from "next/server";

import { getProfileRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

interface LoginPayload {
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as LoginPayload;

  if (!email?.trim() || !password) {
    return NextResponse.json({ error: "Thieu email hoac mat khau." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message ?? "Dang nhap that bai." },
      { status: 401 },
    );
  }

  const role = await getProfileRole(supabase, data.user);

  return NextResponse.json({
    destination: role === "admin" ? "/admin" : "/",
  });
}
