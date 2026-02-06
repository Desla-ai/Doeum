"use client";

import { useEffect, useState } from "react";
import { useAppMode } from "@/components/providers/AppModeProvider";
import { HomeHeaderCard } from "@/components/home/HomeHeaderCard";
import { QuickActions } from "@/components/home/QuickActions";
import { CustomerHomePanel } from "@/components/home/CustomerHomePanel";
import { HelperHomePanel } from "@/components/home/HelperHomePanel";
import { Info } from "lucide-react";

type Profile = {
  id: string;
  name: string;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";
  matching_score: number;
  is_online: boolean;
};

export default function HomePage() {
  const { isHelper } = useAppMode();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/profiles/me");
      const json = await res.json().catch(() => ({}));
      if (res.ok) setProfile(json.data);
    })();
  }, []);

  const name = profile?.name ?? "사용자";
  const tier = (profile?.tier ?? "BRONZE") as any;
  const matchingScore = profile?.matching_score ?? 500;

  return (
    <div className="w-full max-w-full">
      <div className="p-4 space-y-4">
        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB]">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-[#6B7280] mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#111827]">로그인 정보 기반으로 표시됩니다</p>
              <p className="text-xs text-[#6B7280] mt-0.5">
                홈 헤더는 profiles(me)에서 가져옵니다.
              </p>
            </div>
          </div>
        </div>

        <HomeHeaderCard
          name={name}
          avatarUrl={"/placeholder.svg"}
          isOnline={profile?.is_online ?? true}
          tier={tier}
          matchingScore={matchingScore as any}
          badges={[]}
        />

        <QuickActions />
        {isHelper ? <HelperHomePanel /> : <CustomerHomePanel />}
      </div>
    </div>
  );
}
