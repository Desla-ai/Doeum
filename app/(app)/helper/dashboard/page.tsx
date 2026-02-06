"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SecondaryButton, EmptyState, PrimaryButton } from "@/components/ui-kit";
import { FileText, ShoppingBag, Trophy, Wallet, RefreshCw } from "lucide-react";

type Profile = {
  id: string;
  name: string;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";
  matching_score: number;
  is_online: boolean;
  region_sigungu: string;
  region_dong: string;
};

const quickLinks = [
  { label: "요청 보기", href: "/requests", icon: FileText, description: "새로운 요청 확인" },
  { label: "내 주문", href: "/orders", icon: ShoppingBag, description: "진행 중인 주문" },
  { label: "랭킹", href: "/leaderboard", icon: Trophy, description: "내 순위 확인" },
  { label: "정산", href: "/me", icon: Wallet, description: "정산 내역" },
];

export default function HelperDashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingOnline, setSavingOnline] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profiles/me");
      const json = await res.json().catch(() => ({}));
      if (res.ok) setProfile(json.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleOnline = async () => {
    if (!profile) return;
    setSavingOnline(true);
    try {
      const res = await fetch("/api/profiles/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_online: !profile.is_online }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) setProfile(json.data);
    } finally {
      setSavingOnline(false);
    }
  };

  if (loading && !profile) {
    return <div className="p-4 text-sm text-[#6B7280]">대시보드 불러오는 중...</div>;
  }

  if (!profile) {
    return (
      <div className="p-4">
        <EmptyState
          icon={<Trophy className="w-8 h-8" />}
          title="프로필을 불러오지 못했어요"
          description="로그인 상태와 Supabase 설정을 확인해주세요."
          action={
            <PrimaryButton onClick={load}>
              <RefreshCw className="w-4 h-4 mr-2" />
              다시 시도
            </PrimaryButton>
          }
        />
      </div>
    );
  }

  const region = `${profile.region_sigungu} ${profile.region_dong}`.trim();

  return (
    <div className="w-full max-w-full">
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-[64px_1fr] items-center gap-4 p-4 rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
          <Avatar className="w-16 h-16 shrink-0">
            <AvatarImage src="/placeholder.svg" alt={profile.name} />
            <AvatarFallback className="text-xl">{profile.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-[#111827] truncate">{profile.name}</h1>
            <p className="text-xs text-[#6B7280] mt-1">
              지역: {region || "(미설정)"} · 점수: {profile.matching_score}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white">
          <div className="flex items-center justify-between">
            <p className="font-medium text-[#111827]">온라인 상태</p>
            <SecondaryButton onClick={toggleOnline} disabled={savingOnline}>
              {profile.is_online ? "온라인 → 오프라인" : "오프라인 → 온라인"}
            </SecondaryButton>
          </div>
          <p className="text-xs text-[#6B7280] mt-2">
            이 토글은 profiles.is_online에 저장됩니다.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white hover:bg-[#F8FAFC] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center mb-3">
                  <link.icon className="w-5 h-5 text-[#22C55E]" />
                </div>
                <p className="font-medium text-[#111827]">{link.label}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{link.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
