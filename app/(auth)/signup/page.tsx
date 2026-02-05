"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { EmailPasswordForm } from "@/components/auth/EmailPasswordForm";
import { AgreementCheckbox } from "@/components/auth/AgreementCheckbox";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { PrimaryButton, SecondaryButton } from "@/components/ui-kit";
import { useMockAuth } from "@/hooks/useMockAuth";
import { CheckCircle } from "lucide-react";

type SignupStep = "form" | "success";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useMockAuth();
  const [step, setStep] = useState<SignupStep>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [agreements, setAgreements] = useState([
    { id: "terms", label: "이용약관 동의", required: true, checked: false },
    {
      id: "privacy",
      label: "개인정보처리방침 동의",
      required: true,
      checked: false,
    },
    {
      id: "marketing",
      label: "마케팅 수신 동의",
      required: false,
      checked: false,
    },
  ]);

  const handleAgreementChange = (id: string, checked: boolean) => {
    setAgreements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked } : item))
    );
  };

  const requiredAgreementsChecked = agreements
    .filter((a) => a.required)
    .every((a) => a.checked);

  const handleSubmit = async (data: {
    email: string;
    password: string;
    name?: string;
    passwordConfirm?: string;
  }) => {
    if (!requiredAgreementsChecked) {
      setError("필수 약관에 동의해주세요.");
      return;
    }

    if (data.password !== data.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);
    setError("");

    // Mock signup - simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Set mock auth on successful signup
    login();

    // Show success state
    setStep("success");
    setIsLoading(false);
  };

  if (step === "success") {
    return (
      <AuthCard showLogo={false}>
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-[#22C55E]" />
          </div>
          <h2 className="text-xl font-bold text-[#111827] mb-2">
            가입이 완료됐어요
          </h2>
          <p className="text-sm text-[#6B7280] mb-6">
            이제 도움 서비스를 이용할 수 있어요
          </p>

          <div className="w-full space-y-3">
            <Link href="/verify/account" className="block">
              <PrimaryButton className="w-full h-12">
                계좌 1원 인증하기
              </PrimaryButton>
            </Link>
            <Link href="/home" className="block">
              <SecondaryButton className="w-full h-12">
                나중에 하기
              </SecondaryButton>
            </Link>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="회원가입">
      <EmailPasswordForm
        variant="signup"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />

      {/* Agreements */}
      <div className="mt-6 p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
        <AgreementCheckbox items={agreements} onChange={handleAgreementChange} />
      </div>

      {/* Login Link */}
      <p className="mt-6 text-center text-sm text-[#6B7280]">
        이미 계정이 있나요?{" "}
        <Link
          href="/login"
          className="text-[#22C55E] font-medium hover:underline"
        >
          로그인
        </Link>
      </p>

      <AuthDivider />

      <SocialLoginButtons action="signup" />
    </AuthCard>
  );
}
