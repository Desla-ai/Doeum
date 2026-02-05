"use client";

import React from "react";

import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import { useAppMode } from "@/components/providers/AppModeProvider";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

// Main tabs where ModeToggle should appear
const mainTabRoutes = ["/home", "/requests", "/orders", "/leaderboard", "/me"];

const routeTitles: Record<string, string> = {
  "/home": "홈",
  "/requests": "요청",
  "/requests/new": "요청 올리기",
  "/orders": "주문",
  "/leaderboard": "랭킹",
  "/me": "내 정보",
  "/me/profile": "프로필 수정",
  "/me/addresses": "주소 관리",
  "/me/payments": "결제 수단",
  "/me/notifications": "알림 설정",
  "/me/support": "고객센터",
  "/helper/dashboard": "도우미 대시보드",
};

export function TopBar({ title, showBack, rightAction }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isCustomer } = useAppMode();

  // Determine if we should show back button
  const isNestedRoute =
    showBack ??
    (pathname.split("/").filter(Boolean).length > 1 &&
      !pathname.match(/^\/(home|requests|orders|leaderboard|me)$/));

  // Check if this is a main tab route where ModeToggle should show
  const isMainTab = mainTabRoutes.includes(pathname);

  // Dynamic title for /requests based on mode
  const getTitle = () => {
    if (title) return title;

    // Mode-aware title for /requests
    if (pathname === "/requests") {
      return isCustomer ? "일해요" : "구해요";
    }

    return (
      routeTitles[pathname] ??
      (pathname.includes("/requests/") && pathname !== "/requests/new"
        ? "요청 상세"
        : pathname.includes("/orders/") && pathname.includes("/checkout")
          ? "결제하기"
          : pathname.includes("/orders/") && pathname.includes("/dispute")
            ? "분쟁 접수"
            : pathname.includes("/orders/")
              ? "주문 상세"
              : pathname.includes("/helpers/")
                ? "도우미 프로필"
                : pathname.includes("/chat/")
                  ? "채팅"
                  : "집사")
    );
  };

  const displayTitle = getTitle();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2 min-w-0">
          {isNestedRoute && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-9 w-9 shrink-0 rounded-xl text-[#111827] hover:bg-[#F8FAFC]"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="sr-only">뒤로가기</span>
            </Button>
          )}
          <h1 className="text-lg font-semibold text-[#111827] truncate">
            {displayTitle}
          </h1>
        </div>

        <div className="shrink-0">
          {rightAction ?? (isMainTab ? <ModeToggle /> : null)}
        </div>
      </div>
    </header>
  );
}
