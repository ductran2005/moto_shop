"use server";

import { redirect } from "next/navigation";

import { getProfileRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

interface LoginInput {
  email: string;
  password: string;
}

export async function login(input: LoginInput) {
  const email = input.email.trim();
  const password = input.password;

  if (!email || !password) {
    return { error: "Thieu email hoac mat khau." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Khong tim thay nguoi dung sau khi dang nhap." };
  }

  const role = await getProfileRole(supabase, user);

  redirect(role === "admin" ? "/admin" : "/");
}
