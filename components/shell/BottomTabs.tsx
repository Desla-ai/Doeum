"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, ShoppingBag, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppMode } from "@/components/providers/AppModeProvider";

const tabs = [
  {
    id: "home",
    label: "홈",
    href: "/home",
    icon: Home,
  },
  {
    id: "requests",
    label: "요청", // Will be dynamically changed
    href: "/requests",
    icon: FileText,
  },
  {
    id: "orders",
    label: "내역",
    href: "/orders",
    icon: ShoppingBag,
  },
  {
    id: "leaderboard",
    label: "랭킹",
    href: "/leaderboard",
    icon: Trophy,
  },
  {
    id: "me",
    label: "내정보",
    href: "/me",
    icon: User,
  },
];

export function BottomTabs() {
  const pathname = usePathname();
  const { mode } = useAppMode();

  // Get dynamic label for requests tab based on mode
  const getLabel = (tabId: string, defaultLabel: string) => {
    if (tabId === "requests") {
      return mode === "customer" ? "일해요" : "구해요";
    }
    return defaultLabel;
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 w-full max-w-full overflow-x-hidden bg-white border-t border-[#E5E7EB] pb-safe">
      <div className="flex items-center justify-around w-full max-w-full h-16">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href === "/home" && pathname === "/home") ||
            (tab.href === "/requests" && pathname.startsWith("/requests")) ||
            (tab.href === "/orders" && pathname.startsWith("/orders")) ||
            (tab.href === "/leaderboard" &&
              pathname.startsWith("/leaderboard")) ||
            (tab.href === "/me" && pathname.startsWith("/me"));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-0 flex-1 h-full transition-colors",
                isActive ? "text-[#22C55E]" : "text-[#9CA3AF]"
              )}
            >
              <tab.icon className="w-5 h-5 shrink-0" />
              <span className="text-xs font-medium truncate">
                {getLabel(tab.id, tab.label)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
