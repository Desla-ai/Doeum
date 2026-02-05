"use client";

import React from "react"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/ui-kit";
import { Eye, EyeOff } from "lucide-react";

interface EmailPasswordFormProps {
  variant: "login" | "signup";
  onSubmit: (data: {
    email: string;
    password: string;
    name?: string;
    passwordConfirm?: string;
  }) => void;
  isLoading?: boolean;
  error?: string;
}

export function EmailPasswordForm({
  variant,
  onSubmit,
  isLoading = false,
  error,
}: EmailPasswordFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const isSignup = variant === "signup";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      email,
      password,
      ...(isSignup && { name, passwordConfirm }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignup && (
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-[#374151]">
            이름(닉네임)
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 rounded-xl border-[#E5E7EB] focus:border-[#22C55E] focus:ring-[#22C55E]"
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-[#374151]">
          이메일
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 rounded-xl border-[#E5E7EB] focus:border-[#22C55E] focus:ring-[#22C55E]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-sm font-medium text-[#374151]"
        >
          비밀번호
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="8자 이상 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl border-[#E5E7EB] focus:border-[#22C55E] focus:ring-[#22C55E] pr-12"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {isSignup && (
        <div className="space-y-2">
          <Label
            htmlFor="passwordConfirm"
            className="text-sm font-medium text-[#374151]"
          >
            비밀번호 확인
          </Label>
          <div className="relative">
            <Input
              id="passwordConfirm"
              type={showPasswordConfirm ? "text" : "password"}
              placeholder="비밀번호 재입력"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="h-12 rounded-xl border-[#E5E7EB] focus:border-[#22C55E] focus:ring-[#22C55E] pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
              aria-label={
                showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 표시"
              }
            >
              {showPasswordConfirm ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-[#EF4444] text-center">{error}</p>
      )}

      <PrimaryButton
        type="submit"
        className="w-full h-12"
        disabled={isLoading}
      >
        {isLoading ? "처리 중..." : isSignup ? "회원가입" : "로그인"}
      </PrimaryButton>
    </form>
  );
}
