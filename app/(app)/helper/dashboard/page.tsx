"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TierBadge, ScoreChip, SecondaryButton } from "@/components/ui-kit";
import { OnlineToggleCard } from "@/components/helper/OnlineToggleCard";
import { FileText, ShoppingBag, Trophy, Wallet } from "lucide-react";

const mockHelper = {
  name: "김영희",
  tier: "GOLD" as const,
  matchingScore: 920,
  region: "서울 강남구",
};

const quickLinks = [
  {
    label: "요청 보기",
    href: "/requests",
    icon: FileText,
    description: "새로운 요청 확인",
  },
  {
    label: "내 주문",
    href: "/orders",
    icon: ShoppingBag,
    description: "진행 중인 주문",
  },
  {
    label: "랭킹",
    href: "/leaderboard",
    icon: Trophy,
    description: "내 순위 확인",
  },
  {
    label: "정산",
    href: "/me",
    icon: Wallet,
    description: "정산 내역",
  },
];

export default function HelperDashboardPage() {
  return (
    <div className="w-full max-w-full">
      <div className="p-4 space-y-4">
        {/* Profile Summary */}
        <div className="grid grid-cols-[64px_1fr] items-center gap-4 p-4 rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
          <Avatar className="w-16 h-16 shrink-0">
            <AvatarImage src="/placeholder.svg" alt={mockHelper.name} />
            <AvatarFallback className="text-xl">
              {mockHelper.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-[#111827] truncate">
              {mockHelper.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <TierBadge tier={mockHelper.tier} />
              <ScoreChip score={mockHelper.matchingScore} />
            </div>
          </div>
        </div>

        {/* Online Toggle */}
        <OnlineToggleCard initialOnline={true} region={mockHelper.region} />

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white hover:bg-[#F8FAFC] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center mb-3">
                  <link.icon className="w-5 h-5 text-[#22C55E]" />
                </div>
                <p className="font-medium text-[#111827]">{link.label}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  {link.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
          <h2 className="font-medium text-[#111827] mb-3">이번 주 활동</h2>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="min-w-0">
              <p className="text-2xl font-bold text-[#111827] tabular-nums truncate">
                5
              </p>
              <p className="text-xs text-[#6B7280]">완료</p>
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold text-[#22C55E] tabular-nums truncate">
                250,000
              </p>
              <p className="text-xs text-[#6B7280]">수입 (원)</p>
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-[#111827] tabular-nums truncate">
                3분
              </p>
              <p className="text-xs text-[#6B7280]">평균 응답</p>
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
          <h2 className="font-medium text-[#111827] mb-3">다가오는 일정</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-[1fr_auto] items-center gap-3 p-3 rounded-xl bg-[#F8FAFC]">
              <div className="min-w-0">
                <p className="font-medium text-[#111827] truncate">청소</p>
                <p className="text-xs text-[#6B7280] truncate">
                  오늘 오후 2:00 · 서울 강남구
                </p>
              </div>
              <Link href="/orders/order_123" className="shrink-0">
                <SecondaryButton size="sm">상세</SecondaryButton>
              </Link>
            </div>
            <div className="grid grid-cols-[1fr_auto] items-center gap-3 p-3 rounded-xl bg-[#F8FAFC]">
              <div className="min-w-0">
                <p className="font-medium text-[#111827] truncate">요리</p>
                <p className="text-xs text-[#6B7280] truncate">
                  내일 오전 10:00 · 서울 서초구
                </p>
              </div>
              <Link href="/orders/order_123" className="shrink-0">
                <SecondaryButton size="sm">상세</SecondaryButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
