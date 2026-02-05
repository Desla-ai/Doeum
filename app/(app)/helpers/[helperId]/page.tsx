"use client";

import { AvatarFallback } from "@/components/ui/avatar"

import { AvatarImage } from "@/components/ui/avatar"

import { Avatar } from "@/components/ui/avatar"

import Link from "next/link";
import {
  TierBadge,
  ScoreChip,
  BadgeRow,
  PrimaryButton,
  SecondaryButton,
  AvatarWithStatus,
  type HelperBadge,
} from "@/components/ui-kit";
import {
  MessageCircle,
  Briefcase,
  AlertCircle,
  Zap,
  Clock,
} from "lucide-react";

const mockHelper = {
  id: "helper_123",
  name: "김영희",
  avatarUrl: "/placeholder.svg",
  tier: "GOLD" as const,
  matchingScore: 920,
  isOnline: true,
  region: "서울 강남구",
  services: ["청소", "정리정돈", "빨래"],
  badges: [
    { id: "b1", label: "응답왕", description: "평균 응답 5분 이내" },
    { id: "b2", label: "단골왕", description: "재요청률 80% 이상" },
    { id: "b3", label: "성실왕", description: "완료율 95% 이상" },
    { id: "b4", label: "친절왕", description: "칭찬 100회 이상" },
    { id: "b5", label: "프로도우미", description: "경력 3년 이상" },
  ] as HelperBadge[],
  stats: {
    completedJobs: 234,
    noShowRate: 0.5,
    disputeRate: 1.2,
    avgResponseTime: "3분",
  },
};

export default function HelperProfilePage() {
  return (
    <div className="w-full max-w-full pb-24">
      {/* Profile Header */}
      <div className="p-4 flex flex-col items-center text-center">
        <div className="mb-3">
          <AvatarWithStatus
            src={mockHelper.avatarUrl}
            alt={mockHelper.name}
            fallback={mockHelper.name.slice(0, 2)}
            isOnline={mockHelper.isOnline}
            size="xl"
            className="w-24 h-24"
          />
        </div>

        <h1 className="text-xl font-bold text-[#111827] truncate max-w-full">
          {mockHelper.name}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-2 mb-3">
          <TierBadge tier={mockHelper.tier} />
          <ScoreChip score={mockHelper.matchingScore} />
        </div>

        {/* Online Status Info */}
        <div className="w-full p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-left overflow-hidden">
          <div className="flex items-center gap-2 text-[#166534] mb-1">
            <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse shrink-0" />
            <span className="font-medium text-sm">현재 온라인</span>
          </div>
          <p className="text-xs text-[#6B7280]">
            수동 설정 + 15분 무활동 시 자동 오프라인
          </p>
          <p className="text-xs text-[#6B7280]">
            온라인 유지: 60초마다 활동 신호(heartbeat)
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="px-4 mb-4">
        <h2 className="font-medium text-[#111827] mb-2">제공 서비스</h2>
        <div className="flex flex-wrap gap-2">
          {mockHelper.services.map((service) => (
            <span
              key={service}
              className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB] text-sm text-[#374151]"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* Stats (No ratings!) */}
      <div className="px-4 mb-4">
        <h2 className="font-medium text-[#111827] mb-2">활동 통계</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] overflow-hidden">
            <div className="flex items-center gap-2 text-[#6B7280] mb-1">
              <Briefcase className="w-4 h-4 shrink-0" />
              <span className="text-xs truncate">완료 건수</span>
            </div>
            <p className="text-lg font-bold text-[#111827] tabular-nums">
              {mockHelper.stats.completedJobs}건
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] overflow-hidden">
            <div className="flex items-center gap-2 text-[#6B7280] mb-1">
              <Zap className="w-4 h-4 shrink-0" />
              <span className="text-xs truncate">평균 응답</span>
            </div>
            <p className="text-lg font-bold text-[#111827] tabular-nums">
              {mockHelper.stats.avgResponseTime}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] overflow-hidden">
            <div className="flex items-center gap-2 text-[#6B7280] mb-1">
              <Clock className="w-4 h-4 shrink-0" />
              <span className="text-xs truncate">노쇼율</span>
            </div>
            <p className="text-lg font-bold text-[#111827] tabular-nums">
              {mockHelper.stats.noShowRate}%
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] overflow-hidden">
            <div className="flex items-center gap-2 text-[#6B7280] mb-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="text-xs truncate">분쟁율</span>
            </div>
            <p className="text-lg font-bold text-[#111827] tabular-nums">
              {mockHelper.stats.disputeRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="px-4 mb-4">
        <h2 className="font-medium text-[#111827] mb-2">획득 배지</h2>
        <BadgeRow badges={mockHelper.badges} maxVisible={10} />
      </div>

      {/* Activity Region */}
      <div className="px-4 mb-4">
        <h2 className="font-medium text-[#111827] mb-2">활동 지역</h2>
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
          <p className="text-[#374151]">{mockHelper.region}</p>
        </div>
      </div>

      {/* Sticky CTAs */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E5E7EB] pb-safe">
        <div className="flex gap-3">
          <Link href="/chat/thread_123" className="flex-1">
            <SecondaryButton className="w-full h-12">
              <MessageCircle className="w-4 h-4 mr-2" />
              채팅하기
            </SecondaryButton>
          </Link>
          <Link
            href={`/requests/new?preferredHelperId=${mockHelper.id}`}
            className="flex-1"
          >
            <PrimaryButton className="w-full h-12">지정 요청하기</PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
