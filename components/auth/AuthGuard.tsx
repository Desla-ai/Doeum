"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMockAuth } from "@/hooks/useMockAuth";
import { FullScreenLoader } from "@/components/ui-kit";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { authed, isLoading } = useMockAuth();
  const [timedOut, setTimedOut] = useState(false);

  // Fail-open timeout: if auth check takes too long, render children anyway
  // This ensures UI-only demo mode always works
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimedOut(true);
    }, 600); // 600ms max wait - then fail-open for UI demo

    return () => clearTimeout(timer);
  }, []);

  // Redirect to login if not authenticated (but don't block rendering)
  useEffect(() => {
    if (!isLoading && !authed && !timedOut) {
      router.replace("/login");
    }
  }, [authed, isLoading, timedOut, router]);

  // Show loader only during initial check, with strict timeout
  // After timeout or if loading completes, always render children (fail-open for UI demo)
  if (isLoading && !timedOut) {
    return <FullScreenLoader message="로딩 중..." />;
  }

  // Always render children after timeout or when authed
  // This ensures UI-only mode always shows the UI
  return <>{children}</>;
}
