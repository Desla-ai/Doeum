"use client";

import { useAppMode } from "@/components/providers/AppModeProvider";
import { HomeHeaderCard } from "@/components/home/HomeHeaderCard";
import { QuickActions } from "@/components/home/QuickActions";
import { CustomerHomePanel } from "@/components/home/CustomerHomePanel";
import { HelperHomePanel } from "@/components/home/HelperHomePanel";
import type { HelperBadge } from "@/components/ui-kit";

// Mock user data
const mockUser = {
  name: "홍길동",
  avatarUrl: "/placeholder.svg",
  isOnline: true,
  tier: "GOLD" as const,
  matchingScore: 920,
  badges: [
    { id: "b1", label: "응답왕", description: "평균 응답 5분 이내" },
    { id: "b2", label: "단골왕", description: "재요청률 80% 이상" },
    { id: "b3", label: "성실왕", description: "완료율 95% 이상" },
  ] as HelperBadge[],
};

export default function HomePage() {
  const { isHelper } = useAppMode();

  return (
    <div className="w-full max-w-full">
      <div className="p-4 space-y-4">
        {/* Shared Header Card */}
        <HomeHeaderCard
          name={mockUser.name}
          avatarUrl={mockUser.avatarUrl}
          isOnline={mockUser.isOnline}
          tier={mockUser.tier}
          matchingScore={mockUser.matchingScore}
          badges={mockUser.badges}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Mode-specific Panels */}
        {isHelper ? <HelperHomePanel /> : <CustomerHomePanel />}
      </div>
    </div>
  );
}
