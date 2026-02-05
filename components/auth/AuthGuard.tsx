"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { FullScreenLoader } from "@/components/ui-kit";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { authed, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !authed) {
      router.replace("/login");
    }
  }, [authed, isLoading, router]);

  if (isLoading) {
    return <FullScreenLoader message="로딩 중..." />;
  }

  if (!authed) {
    return <FullScreenLoader message="로그인 페이지로 이동 중..." />;
  }

  return <>{children}</>;
}
