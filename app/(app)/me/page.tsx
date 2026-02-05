"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PrimaryButton } from "@/components/ui-kit";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { SettingsRow, SettingsGroup } from "@/components/me/SettingsRow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Info,
  AlertTriangle,
} from "lucide-react";

const mockUser = {
  name: "홍길동",
  email: "hong@example.com",
};

// Mock score summary - structured for easy DB replacement
const mockScoreSummary = {
  score: 920, // 0-1000 scale
  rank: 128,
  percentile: 3.2,
  weeklyChange: 12, // positive = up, negative = down
  tier: "GOLD" as const,
  recentStats: {
    completed: 8,
    noShow: 0,
    disputes: 0,
  },
};

// Tier display config - text colors only (no chip/badge per spec)
const tierConfig: Record<string, { label: string; textColor: string }> = {
  BRONZE: { label: "브론즈", textColor: "text-[#92400E]" },
  SILVER: { label: "실버", textColor: "text-[#374151]" },
  GOLD: { label: "골드", textColor: "text-[#A16207]" },
  PLATINUM: { label: "플래티넘", textColor: "text-[#3730A3]" },
  DIAMOND: { label: "다이아", textColor: "text-[#1E40AF]" },
};

const menuItems = [
  {
    icon: User,
    label: "프로필 수정",
    href: "/me/profile",
  },
  {
    icon: MapPin,
    label: "주소 관리",
    href: "/me/addresses",
  },
  {
    icon: CreditCard,
    label: "결제 수단",
    href: "/me/payments",
  },
  {
    icon: Bell,
    label: "알림 설정",
    href: "/me/notifications",
  },
  {
    icon: HelpCircle,
    label: "고객센터",
    href: "/me/support",
  },
];

const scoringCriteria = [
  { label: "완료 건수", description: "요청을 성공적으로 완료한 횟수" },
  { label: "응답 속도", description: "요청에 대한 평균 응답 시간" },
  { label: "노쇼 횟수", description: "예정된 서비스를 불참한 횟수 (감점)" },
  { label: "분쟁 횟수", description: "고객과의 분쟁 발생 횟수 (감점)" },
  { label: "인증 여부", description: "신원 및 계좌 인증 완료 여부" },
  { label: "최근 활동", description: "최근 7일 내 활동 빈도" },
];

export default function MePage() {
  const [isCriteriaOpen, setIsCriteriaOpen] = useState(false);
  const isPositiveChange = mockScoreSummary.weeklyChange >= 0;
  const tierInfo = tierConfig[mockScoreSummary.tier] || tierConfig.BRONZE;

  // Warning colors for noShow/disputes (0 = neutral, 1+ = warning)
  const getWarningStyle = (count: number) => {
    if (count === 0) return { color: "text-[#6B7280]", icon: false };
    if (count <= 2) return { color: "text-[#F59E0B]", icon: true };
    return { color: "text-[#EF4444]", icon: true };
  };

  const noShowStyle = getWarningStyle(mockScoreSummary.recentStats.noShow);
  const disputeStyle = getWarningStyle(mockScoreSummary.recentStats.disputes);

  return (
    <div className="w-full max-w-full">
      {/* Profile Header - Simplified */}
      <div className="p-4">
        <div className="w-full max-w-full grid grid-cols-[64px_1fr] items-center gap-4 p-4 rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
          <Avatar className="w-16 h-16 shrink-0">
            <AvatarImage src="/placeholder.svg" alt={mockUser.name} />
            <AvatarFallback className="text-xl">
              {mockUser.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-[#111827] truncate">
              {mockUser.name}
            </h1>
            <p className="text-sm text-[#6B7280] truncate">{mockUser.email}</p>
          </div>
        </div>
      </div>

      {/* Rich Matching Score Card */}
      <div className="px-4 mb-4">
        <div className="w-full max-w-full rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
          {/* Header Row */}
          <div className="flex items-center justify-between p-4 pb-3">
            <span className="font-semibold text-[#111827]">내 매칭점수</span>
            <span className="px-3 py-1 text-sm font-bold text-white bg-[#22C55E] rounded-full">
              {mockScoreSummary.score}점
            </span>
          </div>

          {/* Metrics Grid 2x3 */}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Row 1: 내 순위, 상위 */}
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <p className="text-xs text-[#6B7280] mb-1">내 순위</p>
                <p className="text-lg font-bold text-[#111827]">
                  {mockScoreSummary.rank.toLocaleString()}등
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <p className="text-xs text-[#6B7280] mb-1">상위</p>
                <p className="text-lg font-bold text-[#22C55E]">
                  {mockScoreSummary.percentile}%
                </p>
              </div>

              {/* Row 2: 티어, 변동(주간) */}
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <p className="text-xs text-[#6B7280] mb-1">티어</p>
                <p className={`text-lg font-bold ${tierInfo.textColor}`}>
                  {tierInfo.label}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <p className="text-xs text-[#6B7280] mb-1">변동(주간)</p>
                <div className="flex items-center gap-1">
                  {isPositiveChange ? (
                    <TrendingUp className="w-4 h-4 text-[#22C55E]" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-[#EF4444]" />
                  )}
                  <p
                    className={`text-lg font-bold ${isPositiveChange ? "text-[#22C55E]" : "text-[#EF4444]"}`}
                  >
                    {isPositiveChange ? "+" : ""}
                    {mockScoreSummary.weeklyChange}
                  </p>
                </div>
              </div>

              {/* Row 3: 노쇼(최근 7일), 분쟁(최근 7일) */}
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <p className="text-xs text-[#6B7280] mb-1">노쇼(최근 7일)</p>
                <div className="flex items-center gap-1">
                  {noShowStyle.icon && (
                    <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  )}
                  <p className={`text-lg font-bold ${noShowStyle.color}`}>
                    {mockScoreSummary.recentStats.noShow}건
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <p className="text-xs text-[#6B7280] mb-1">분쟁(최근 7일)</p>
                <div className="flex items-center gap-1">
                  {disputeStyle.icon && (
                    <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  )}
                  <p className={`text-lg font-bold ${disputeStyle.color}`}>
                    {mockScoreSummary.recentStats.disputes}건
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row - Simplified to just completed */}
          <div className="px-4 pb-3">
            <p className="text-xs text-[#6B7280]">
              최근 7일 완료 {mockScoreSummary.recentStats.completed}건
            </p>
          </div>

          {/* Info Row */}
          <div className="px-4 pb-4">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
              <Info className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
              <p className="text-xs text-[#166534]">
                랭킹은 매칭점수와 공정 노출 정책을 반영해 산정돼요
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="px-4 pb-4 space-y-2">
            <Link href="/leaderboard?me=1" className="block">
              <PrimaryButton className="w-full h-11">
                랭킹에서 내 순위 보기
              </PrimaryButton>
            </Link>

            <Dialog open={isCriteriaOpen} onOpenChange={setIsCriteriaOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="w-full py-2 text-sm text-[#6B7280] hover:text-[#111827] transition-colors"
                >
                  산정 기준 보기
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-sm mx-auto">
                <DialogHeader>
                  <DialogTitle>매칭점수 산정 기준</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 mt-4">
                  {scoringCriteria.map((item) => (
                    <div
                      key={item.label}
                      className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]"
                    >
                      <p className="font-medium text-[#111827] text-sm">
                        {item.label}
                      </p>
                      <p className="text-xs text-[#6B7280] mt-1">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4">
        <SettingsGroup>
          {menuItems.map((item, index) => (
            <SettingsRow
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isFirst={index === 0}
              isLast={index === menuItems.length - 1}
            />
          ))}
        </SettingsGroup>
      </div>

      {/* Logout */}
      <div className="px-4 mt-4">
        <LogoutButton />
      </div>
    </div>
  );
}
