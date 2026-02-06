"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FullScreenLoader } from "@/components/ui-kit/FullScreenLoader";
import { AuthCard } from "@/components/auth/AuthCard";
import { PrimaryButton } from "@/components/ui-kit";
import { CheckCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/browser";

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const provider = searchParams.get("provider") || "social";
  const next = searchParams.get("next") || "/home";
  const code = searchParams.get("code");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const providerLabel =
    provider === "kakao" ? "카카오" : provider === "google" ? "Google" : "소셜";

  useEffect(() => {
    const run = async () => {
      try {
        // code가 없으면(혹은 이미 세션이 있으면) 세션 확인 후 next로
        const supabase = createClient();

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setStatus("error");
            setErrorMsg(error.message);
            return;
          }
        }

        // 세션 확인
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setStatus("error");
          setErrorMsg("세션을 생성하지 못했어요. 다시 로그인해 주세요.");
          return;
        }

        setStatus("success");
        // UX: 성공 화면 300ms 보여주고 이동
        setTimeout(() => {
          router.replace(next);
          router.refresh();
        }, 300);
      } catch (e: any) {
        setStatus("error");
        setErrorMsg(e?.message ?? "알 수 없는 오류");
      }
    };

    run();
  }, [code, next, router]);

  if (status === "loading") {
    return <FullScreenLoader message={`${providerLabel} 로그인 처리 중...`} variant="default" />;
  }

  if (status === "error") {
    return (
      <AuthCard showLogo={false}>
        <div className="flex flex-col items-center text-center py-4">
          <h2 className="text-xl font-bold text-[#111827] mb-2">로그인 실패</h2>
          <p className="text-sm text-[#6B7280] mb-6 break-words">{errorMsg}</p>
          <a href="/login" className="w-full">
            <PrimaryButton className="w-full h-12">로그인으로 돌아가기</PrimaryButton>
          </a>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard showLogo={false}>
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-[#22C55E]" />
        </div>
        <h2 className="text-xl font-bold text-[#111827] mb-2">로그인 완료</h2>
        <p className="text-sm text-[#6B7280] mb-6">{providerLabel} 계정으로 로그인되었어요</p>
        <a href={next} className="w-full">
          <PrimaryButton className="w-full h-12">이동</PrimaryButton>
        </a>
      </div>
    </AuthCard>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<FullScreenLoader message="로그인 처리 중..." variant="default" />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
