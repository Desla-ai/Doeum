"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FullScreenLoader } from "@/components/ui-kit/FullScreenLoader";
import { AuthCard } from "@/components/auth/AuthCard";
import { PrimaryButton } from "@/components/ui-kit";
import { CheckCircle } from "lucide-react";

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider") || "unknown";
  const [status, setStatus] = useState<"loading" | "success">("loading");

  const providerLabel =
    provider === "kakao"
      ? "카카오"
      : provider === "google"
        ? "Google"
        : "소셜";

  useEffect(() => {
    // Mock auth callback - simulate processing
    const timer = setTimeout(() => {
      setStatus("success");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (status === "loading") {
    return (
      <FullScreenLoader
        message={`${providerLabel} 로그인 처리 중...`}
        variant="default"
      />
    );
  }

  return (
    <AuthCard showLogo={false}>
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-[#22C55E]" />
        </div>
        <h2 className="text-xl font-bold text-[#111827] mb-2">로그인 완료</h2>
        <p className="text-sm text-[#6B7280] mb-6">
          {providerLabel} 계정으로 로그인되었어요
        </p>

        <Link href="/home" className="w-full">
          <PrimaryButton className="w-full h-12">홈으로 이동</PrimaryButton>
        </Link>
      </div>
    </AuthCard>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <FullScreenLoader message="로그인 처리 중..." variant="default" />
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
