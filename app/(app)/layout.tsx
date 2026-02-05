"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { AppModeProvider } from "@/components/providers/AppModeProvider";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Chat pages need internal scroll management (fixed header/composer, scrolling messages)
  const isChatRoute = pathname?.startsWith("/chat/");
  const scrollMode = isChatRoute ? "page" : "shell";

  return (
    <AuthGuard>
      <AppModeProvider>
        <AppShell scrollMode={scrollMode}>{children}</AppShell>
      </AppModeProvider>
    </AuthGuard>
  );
}
