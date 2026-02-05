"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrimaryButton, SecondaryButton } from "@/components/ui-kit";
import { CheckCircle } from "lucide-react";

type VerifyStep = 1 | 2 | "success";

const banks = [
  { value: "kb", label: "KB국민은행" },
  { value: "shinhan", label: "신한은행" },
  { value: "woori", label: "우리은행" },
  { value: "hana", label: "하나은행" },
  { value: "nh", label: "NH농협은행" },
  { value: "ibk", label: "IBK기업은행" },
  { value: "kakao", label: "카카오뱅크" },
  { value: "toss", label: "토스뱅크" },
];

export default function VerifyAccountPage() {
  const [step, setStep] = useState<VerifyStep>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1 form
  const [bank, setBank] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  // Step 2 form
  const [verificationCode, setVerificationCode] = useState("");

  const handleSendVerification = async () => {
    setIsLoading(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep(2);
  };

  const handleVerify = async () => {
    setIsLoading(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep("success");
  };

  const handleResend = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    // In real app, would resend verification
  };

  if (step === "success") {
    return (
      <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB]">
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-[#22C55E]" />
          </div>
          <h2 className="text-xl font-bold text-[#111827] mb-2">
            계좌 인증이 완료됐어요
          </h2>
          <p className="text-sm text-[#6B7280] mb-6">
            이제 에스크로 결제를 이용할 수 있어요
          </p>

          <Link href="/home" className="w-full">
            <PrimaryButton className="w-full h-12">홈으로 이동</PrimaryButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <BrandLogo size={40} showWordmark={false} />
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-[#111827] text-center mb-2">
        계좌 1원 인증
      </h1>
      <p className="text-sm text-[#6B7280] text-center mb-6">
        입력하신 계좌로 1원이 입금되며, 입금자명(인증코드)을 입력해 인증합니다.
      </p>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            step >= 1
              ? "bg-[#22C55E] text-white"
              : "bg-[#E5E7EB] text-[#6B7280]"
          }`}
        >
          1
        </div>
        <div
          className={`w-12 h-0.5 ${step >= 2 ? "bg-[#22C55E]" : "bg-[#E5E7EB]"}`}
        />
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            step >= 2
              ? "bg-[#22C55E] text-white"
              : "bg-[#E5E7EB] text-[#6B7280]"
          }`}
        >
          2
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex justify-between text-xs text-[#6B7280] mb-6 px-2">
        <span className={step === 1 ? "text-[#22C55E] font-medium" : ""}>
          계좌 정보 입력
        </span>
        <span className={step === 2 ? "text-[#22C55E] font-medium" : ""}>
          인증코드 확인
        </span>
      </div>

      {/* Form Card */}
      <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB]">
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#374151]">
                은행 선택
              </Label>
              <Select value={bank} onValueChange={setBank}>
                <SelectTrigger className="h-12 rounded-xl border-[#E5E7EB]">
                  <SelectValue placeholder="은행을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#374151]">
                예금주명
              </Label>
              <Input
                placeholder="홍길동"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="h-12 rounded-xl border-[#E5E7EB]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#374151]">
                계좌번호
              </Label>
              <Input
                placeholder="- 없이 입력"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="h-12 rounded-xl border-[#E5E7EB]"
                inputMode="numeric"
              />
            </div>

            <PrimaryButton
              className="w-full h-12 mt-4"
              onClick={handleSendVerification}
              disabled={!bank || !accountHolder || !accountNumber || isLoading}
            >
              {isLoading ? "처리 중..." : "1원 보내기"}
            </PrimaryButton>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
              <p className="text-sm text-[#166534] text-center">
                1원이 입금되면 입금자명에 표시된
                <br />
                <strong>4자리 코드</strong>를 입력하세요
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#374151]">
                인증코드 (4자리)
              </Label>
              <Input
                placeholder="0000"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(e.target.value.slice(0, 4))
                }
                className="h-12 rounded-xl border-[#E5E7EB] text-center text-xl tracking-[0.5em] font-mono"
                inputMode="numeric"
                maxLength={4}
              />
            </div>

            <PrimaryButton
              className="w-full h-12"
              onClick={handleVerify}
              disabled={verificationCode.length !== 4 || isLoading}
            >
              {isLoading ? "인증 중..." : "인증 완료"}
            </PrimaryButton>

            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              className="w-full text-sm text-[#6B7280] hover:text-[#22C55E] transition-colors"
            >
              인증코드 재전송
            </button>
          </div>
        )}
      </div>

      {/* Skip Link */}
      <div className="mt-6 text-center">
        <Link
          href="/home"
          className="text-sm text-[#6B7280] hover:text-[#22C55E] transition-colors"
        >
          나중에 인증하기
        </Link>
      </div>
    </div>
  );
}
