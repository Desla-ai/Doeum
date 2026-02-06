"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FullScreenLoader } from "@/components/ui-kit";
import { createClient } from "@/utils/supabase/browser";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setAuthed(!!data.session);
      setIsLoading(false);
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoading && !authed) {
      // 로그인 후 돌아올 목적지 저장(원하면 next 파라미터로 확장 가능)
      router.replace(`/login`);
    }
  }, [authed, isLoading, router, pathname]);

  if (isLoading) return <FullScreenLoader message="로딩 중..." />;

  if (!authed) return null;

  return <>{children}</>;
}
