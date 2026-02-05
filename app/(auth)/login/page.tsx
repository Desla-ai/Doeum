"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <AuthCard title="로그인">
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 text-center">
          {error === "auth_callback_error"
            ? "로그인에 실패했어요. 다시 시도해주세요."
            : error === "missing_env"
              ? "서버 설정 오류입니다. 관리자에게 문의하세요."
              : "오류가 발생했어요."}
        </div>
      )}

      <SocialLoginButtons action="login" />

      <AuthDivider />

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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
