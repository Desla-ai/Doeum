"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/app/(app)/lib/supabase/browser";

interface SocialLoginButtonsProps {
  action?: "login" | "signup";
}

export function SocialLoginButtons({
  action = "login",
}: SocialLoginButtonsProps) {
  const actionText = action === "login" ? "계속하기" : "가입하기";
  const [loading, setLoading] = useState<"kakao" | "google" | null>(null);

  const handleOAuth = async (provider: "kakao" | "google") => {
    setLoading(provider);
    try {
      const supabase = createSupabaseBrowser();

      // Build the redirect URL based on the current origin
      const redirectTo = `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
        },
      });

      if (error) {
        console.error("OAuth error:", error.message);
        setLoading(null);
      }
      // If no error, the browser will redirect to the provider's login page
    } catch (err) {
      console.error("OAuth error:", err);
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Kakao Login */}
      <button
        type="button"
        onClick={() => handleOAuth("kakao")}
        disabled={loading !== null}
        className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#FEE500] text-[#191919] font-medium hover:bg-[#FDD835] transition-colors disabled:opacity-60"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 3C6.48 3 2 6.48 2 10.5c0 2.52 1.68 4.74 4.2 6.03-.18.66-.66 2.4-.75 2.76-.12.48.18.48.36.36.15-.09 2.34-1.56 3.3-2.19.63.09 1.26.12 1.89.12 5.52 0 10-3.48 10-7.5S17.52 3 12 3z" />
        </svg>
        <span>{loading === "kakao" ? "연결 중..." : `카카오로 ${actionText}`}</span>
      </button>

      {/* Google Login */}
      <button
        type="button"
        onClick={() => handleOAuth("google")}
        disabled={loading !== null}
        className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-white border border-[#E5E7EB] text-[#374151] font-medium hover:bg-[#F8FAFC] transition-colors disabled:opacity-60"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <span>{loading === "google" ? "연결 중..." : `Google로 ${actionText}`}</span>
      </button>
    </div>
  );
}
