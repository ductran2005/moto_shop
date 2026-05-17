"use client";

import { useState, type ReactNode } from "react";
import { Smartphone } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

interface SocialButton {
  label: string;
  icon: ReactNode;
}

const SOCIAL_BUTTONS: SocialButton[] = [
  {
    label: "Google",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
        <path
          fill="#4285F4"
          d="M21.82 12.2c0-.72-.06-1.25-.2-1.8H12v3.47h5.65a4.84 4.84 0 0 1-2.1 3.18l-.02.12 3.06 2.36.21.02c1.95-1.8 3.02-4.45 3.02-7.35Z"
        />
        <path
          fill="#34A853"
          d="M12 22c2.75 0 5.06-.9 6.75-2.45l-3.22-2.5c-.86.6-2.02 1.02-3.53 1.02-2.69 0-4.97-1.8-5.78-4.3l-.11.01-3.18 2.46-.04.11C4.57 19.72 7.97 22 12 22Z"
        />
        <path
          fill="#FBBC05"
          d="M6.22 13.77A6.02 6.02 0 0 1 5.9 12c0-.62.12-1.22.3-1.78l-.01-.12-3.22-2.5-.1.05A10 10 0 0 0 2 12c0 1.56.37 3.03 1.03 4.35l3.19-2.58Z"
        />
        <path
          fill="#EA4335"
          d="M12 5.93c1.94 0 3.25.84 4 1.54l2.92-2.84C17.05 2.9 14.75 2 12 2 7.97 2 4.57 4.28 2.87 7.65l3.33 2.57c.81-2.49 3.09-4.29 5.8-4.29Z"
        />
      </svg>
    ),
  },
  {
    label: "Facebook",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
        <path
          fill="#1877F2"
          d="M24 12.07C24 5.42 18.63 0 12 0S0 5.42 0 12.07C0 18.08 4.39 23.06 10.13 24v-8.45H7.08v-3.48h3.05V9.41c0-3.02 1.8-4.69 4.55-4.69 1.32 0 2.7.24 2.7.24v2.97h-1.52c-1.5 0-1.97.93-1.97 1.88v2.26h3.35l-.54 3.48h-2.81V24C19.61 23.06 24 18.08 24 12.07Z"
        />
      </svg>
    ),
  },
  {
    label: "Apple",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-white">
        <path d="M15.39 12.74c.03 3.2 2.8 4.27 2.83 4.28-.02.08-.44 1.5-1.46 2.96-.88 1.27-1.8 2.54-3.25 2.57-1.42.03-1.88-.84-3.51-.84-1.63 0-2.14.81-3.48.87-1.4.05-2.47-1.4-3.36-2.67C1.34 17.29-.04 12.54 1.83 9.28c.93-1.62 2.6-2.64 4.4-2.67 1.37-.03 2.67.92 3.51.92.84 0 2.42-1.14 4.08-.97.7.03 2.66.28 3.92 2.13-.1.06-2.34 1.36-2.35 4.05ZM12.73 4.8c.74-.9 1.24-2.15 1.1-3.4-1.07.04-2.37.71-3.14 1.6-.69.8-1.3 2.08-1.14 3.3 1.19.09 2.43-.61 3.18-1.5Z" />
      </svg>
    ),
  },
  {
    label: "OTP",
    icon: <Smartphone aria-hidden="true" className="size-5 text-[#e31e24]" />,
  },
];

export function SocialLogin() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleSocialLogin(label: string) {
    if (label !== "Google") {
      return;
    }

    setError("");
    setLoadingProvider(label);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signInError) {
      setLoadingProvider(null);
      setError(signInError.message);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        {SOCIAL_BUTTONS.map(({ label, icon }) => (
          <button
            key={label}
            type="button"
            aria-label={`Dang nhap voi ${label}`}
            aria-busy={loadingProvider === label}
            onClick={() => void handleSocialLogin(label)}
            disabled={loadingProvider !== null}
            className="flex h-[52px] items-center justify-center gap-2 rounded-lg border border-[#2a2a2a] bg-transparent text-sm font-medium text-white transition-colors hover:bg-[#1f1f1f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {icon}
            {label === "OTP" ? <span className="text-xs font-semibold text-[#e31e24]">OTP</span> : null}
          </button>
        ))}
      </div>

      {error ? <p className="mt-3 text-sm text-[#ff6a70]">{error}</p> : null}
    </div>
  );
}

export default SocialLogin;
