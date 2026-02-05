"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { EmailPasswordForm } from "@/components/auth/EmailPasswordForm";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { useMockAuth } from "@/hooks/useMockAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useMockAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError("");

    // Mock login - simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Set mock auth and redirect
    login();
    router.replace("/home");
  };

  return (
    <AuthCard title="로그인">
      <EmailPasswordForm
        variant="login"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />

      {/* Forgot Password Link */}
      <div className="mt-4 text-center">
        <Link
          href="#"
          className="text-sm text-[#6B7280] hover:text-[#22C55E] transition-colors"
        >
          비밀번호를 잊으셨나요?
        </Link>
      </div>

      <AuthDivider />

      <SocialLoginButtons action="login" />

      {/* Signup Link */}
      <p className="mt-6 text-center text-sm text-[#6B7280]">
        계정이 없으신가요?{" "}
        <Link
          href="/signup"
          className="text-[#22C55E] font-medium hover:underline"
        >
          회원가입
        </Link>
      </p>

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-[#9CA3AF] text-center leading-relaxed">
        로그인하면{" "}
        <Link href="#" className="underline hover:text-[#6B7280]">
          이용약관
        </Link>{" "}
        및{" "}
        <Link href="#" className="underline hover:text-[#6B7280]">
          개인정보처리방침
        </Link>
        에 동의하게 됩니다.
      </p>
    </AuthCard>
  );
}
