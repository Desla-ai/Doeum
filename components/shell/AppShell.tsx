"use client";

import React from "react";

import { TopBar } from "./TopBar";
import { BottomTabs } from "./BottomTabs";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  hideBottomTabs?: boolean;
  /**
   * scrollMode: "shell" | "page"
   * - "shell" (default): main has overflow-y-auto, pages scroll within main
   * - "page": main has overflow-hidden, page manages its own scroll (for chat)
   */
  scrollMode?: "shell" | "page";
}

export function AppShell({
  children,
  title,
  showBack,
  rightAction,
  hideBottomTabs = false,
  scrollMode = "shell",
}: AppShellProps) {
  // Determine main classes based on scrollMode
  const mainClasses =
    scrollMode === "page"
      ? "flex-1 min-h-0 overflow-hidden w-full max-w-full flex flex-col"
      : `flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar w-full max-w-full ${
          hideBottomTabs ? "" : "pb-20"
        }`;

  return (
    <div className="h-dvh w-full max-w-full bg-white flex flex-col overflow-hidden">
      <TopBar title={title} showBack={showBack} rightAction={rightAction} />
      <main className={mainClasses}>{children}</main>
      {!hideBottomTabs && <BottomTabs />}
    </div>
  );
}
