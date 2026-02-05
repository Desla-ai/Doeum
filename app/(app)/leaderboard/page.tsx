"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TierBadge,
  ScoreChip,
  BadgeRow,
  SecondaryButton,
  AvatarWithStatus,
  type HelperBadge,
} from "@/components/ui-kit";
import { Info, MapPin, Trophy, Globe, Clock } from "lucide-react";
import { formatKSTShortTime } from "@/lib/time/krTime";

interface RankEntry {
  rank: number;
  id: string;
  name: string;
  avatarUrl?: string;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";
  matchingScore: number;
  badges: HelperBadge[];
}

// Mock current user ID - in real app this would come from auth
const MY_USER_ID = "helper_me";

interface RankEntryWithMe extends RankEntry {
  isMe?: boolean;
}

// Regional rankings (서울 강남구)
const initialRegionRankings: RankEntryWithMe[] = [
  {
    rank: 1,
    id: "helper_125",
    name: "박지민",
    tier: "DIAMOND",
    matchingScore: 980,
    badges: [
      { id: "b1", label: "최다완료" },
      { id: "b2", label: "응답왕" },
      { id: "b3", label: "성실왕" },
    ],
  },
  {
    rank: 2,
    id: "helper_123",
    name: "김영희",
    tier: "GOLD",
    matchingScore: 950,
    badges: [
      { id: "b1", label: "단골왕" },
      { id: "b2", label: "성실왕" },
    ],
  },
  {
    rank: 3,
    id: "helper_124",
    name: "이철수",
    tier: "PLATINUM",
    matchingScore: 930,
    badges: [
      { id: "b1", label: "프로도우미" },
      { id: "b2", label: "응답왕" },
    ],
  },
  {
    rank: 4,
    id: MY_USER_ID,
    name: "홍길동",
    tier: "GOLD",
    matchingScore: 920,
    badges: [
      { id: "b1", label: "응답왕" },
      { id: "b2", label: "단골왕" },
    ],
    isMe: true,
  },
  {
    rank: 5,
    id: "helper_129",
    name: "윤하늘",
    tier: "GOLD",
    matchingScore: 890,
    badges: [
      { id: "b1", label: "단골왕" },
      { id: "b2", label: "친절왕" },
    ],
  },
  {
    rank: 6,
    id: "helper_130",
    name: "장서연",
    tier: "SILVER",
    matchingScore: 860,
    badges: [{ id: "b1", label: "성실왕" }],
  },
];

// Global rankings (전체)
const initialGlobalRankings: RankEntryWithMe[] = [
  {
    rank: 1,
    id: "helper_200",
    name: "최강민",
    tier: "DIAMOND",
    matchingScore: 995,
    badges: [
      { id: "b1", label: "전국1위" },
      { id: "b2", label: "최다완료" },
      { id: "b3", label: "응답왕" },
    ],
  },
  {
    rank: 2,
    id: "helper_201",
    name: "정수현",
    tier: "DIAMOND",
    matchingScore: 988,
    badges: [
      { id: "b1", label: "프로도우미" },
      { id: "b2", label: "성실왕" },
    ],
  },
  {
    rank: 3,
    id: "helper_125",
    name: "박지민",
    tier: "DIAMOND",
    matchingScore: 980,
    badges: [
      { id: "b1", label: "최다완료" },
      { id: "b2", label: "응답왕" },
    ],
  },
  {
    rank: 128,
    id: MY_USER_ID,
    name: "홍길동",
    tier: "GOLD",
    matchingScore: 920,
    badges: [
      { id: "b1", label: "응답왕" },
      { id: "b2", label: "단골왕" },
    ],
    isMe: true,
  },
  {
    rank: 129,
    id: "helper_202",
    name: "김태희",
    tier: "GOLD",
    matchingScore: 918,
    badges: [{ id: "b1", label: "친절왕" }],
  },
  {
    rank: 130,
    id: "helper_203",
    name: "이준호",
    tier: "GOLD",
    matchingScore: 915,
    badges: [{ id: "b1", label: "성실왕" }],
  },
];

// Helper to format time as HH:MM (using KST utility)
function formatTime(date: Date): string {
  return formatKSTShortTime(date);
}

// Helper to recompute rankings with small score variations (demo)
function recomputeRankings(rankings: RankEntryWithMe[]): RankEntryWithMe[] {
  // Apply small random score changes (±1 to ±5)
  const updated = rankings.map((entry) => ({
    ...entry,
    matchingScore: Math.max(
      0,
      Math.min(1000, entry.matchingScore + Math.floor(Math.random() * 11) - 5)
    ),
  }));

  // Sort by score descending
  updated.sort((a, b) => b.matchingScore - a.matchingScore);

  // Reassign ranks, keeping "isMe" entries at their logical position
  return updated.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

export default function LeaderboardPage() {
  const searchParams = useSearchParams();
  const showMyRank = searchParams.get("me") === "1";
  const [scope, setScope] = useState<"region" | "global">("region");
  const myRankRef = useRef<HTMLDivElement>(null);

  // Rankings state (mutable for demo refresh)
  const [regionRankings, setRegionRankings] = useState(initialRegionRankings);
  const [globalRankings, setGlobalRankings] = useState(initialGlobalRankings);

  // Last updated timestamp
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date>(() => new Date());

  // Get current rankings based on scope
  const rankings = scope === "region" ? regionRankings : globalRankings;

  // Demo: Refresh rankings every 2 hours (7200000ms)
  // For demo purposes, we also allow manual trigger or shorter interval for testing
  const refreshRankings = useCallback(() => {
    setRegionRankings((prev) => recomputeRankings(prev));
    setGlobalRankings((prev) => recomputeRankings(prev));
    setLastUpdatedAt(new Date());
  }, []);

  useEffect(() => {
    // Set up 2-hour interval for auto-refresh
    const intervalId = setInterval(refreshRankings, 2 * 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [refreshRankings]);

  // Auto-scroll to my rank when ?me=1 is present
  useEffect(() => {
    if (showMyRank && myRankRef.current) {
      setTimeout(() => {
        myRankRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  }, [showMyRank, scope]);

  const getRankStyle = (rank: number) => {
    if (rank === 1)
      return "bg-gradient-to-r from-[#FEF9C3] to-[#FDE047] text-[#A16207]";
    if (rank === 2) return "bg-[#F3F4F6] text-[#374151]";
    if (rank === 3) return "bg-[#FED7AA] text-[#C2410C]";
    return "bg-[#F8FAFC] text-[#6B7280]";
  };

  return (
    <div className="w-full max-w-full">
      {/* Header Controls */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-[#E5E7EB] p-4 space-y-3">
        {/* Scope Tabs: 현재 지역 / 전체 */}
        <Tabs
          value={scope}
          onValueChange={(v) => setScope(v as "region" | "global")}
          className="w-full"
        >
          <TabsList className="w-full h-10 bg-[#F8FAFC] rounded-xl p-1">
            <TabsTrigger
              value="region"
              className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              현재 지역
            </TabsTrigger>
            <TabsTrigger
              value="global"
              className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              전체
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Region Badge & Refresh Info & Info Button */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: Region/Global indicator */}
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            {scope === "region" ? (
              <>
                <MapPin className="w-4 h-4 text-[#6B7280] shrink-0" />
                <Badge
                  variant="outline"
                  className="bg-white text-[#374151] border-[#E5E7EB] text-xs rounded-lg"
                >
                  서울 강남구
                </Badge>
                <span className="text-xs text-[#9CA3AF]">(자동 적용)</span>
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 text-[#6B7280] shrink-0" />
                <Badge
                  variant="outline"
                  className="bg-white text-[#374151] border-[#E5E7EB] text-xs rounded-lg"
                >
                  전체
                </Badge>
              </>
            )}
          </div>

          {/* Right: Refresh info + Info button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Refresh indicator */}
            <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
              <Clock className="w-3 h-3" />
              <span>마지막 갱신 {formatTime(lastUpdatedAt)}</span>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-[#6B7280] hover:text-[#111827]"
                >
                  <Info className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-[#111827]">
                    랭킹 산정 기준
                  </DialogTitle>
                  <DialogDescription className="text-[#6B7280]">
                    매칭점수 기반 랭킹 시스템
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 text-sm text-[#374151]">
                  <p>매칭점수는 다음 요소를 종합하여 산정됩니다:</p>
                  <ul className="list-disc list-inside space-y-1 text-[#6B7280]">
                    <li>완료 건수 및 완료율</li>
                    <li>응답 속도</li>
                    <li>재요청률 (단골 고객)</li>
                    <li>노쇼율 및 분쟁율</li>
                    <li>활동 기간 및 꾸준함</li>
                  </ul>
                  <p className="text-xs text-[#9CA3AF] pt-2">
                    랭킹은 2시간마다 갱신됩니다.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Rankings List */}
      <div className="p-4 space-y-3">
        {rankings.map((entry) => (
          <div
            key={entry.id}
            ref={entry.isMe ? myRankRef : undefined}
            className={`w-full max-w-full p-4 rounded-2xl border-2 overflow-hidden transition-all ${
              entry.isMe && showMyRank
                ? "border-[#22C55E] bg-[#F0FDF4] ring-2 ring-[#22C55E]/20"
                : "border-[#E5E7EB] bg-white"
            }`}
          >
            {/* Mobile: Stack layout */}
            <div className="grid grid-cols-[auto_1fr] gap-3 sm:hidden">
              {/* Left: Rank + Avatar */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${getRankStyle(
                    entry.rank
                  )}`}
                >
                  {entry.rank <= 3 ? (
                    <Trophy className="w-4 h-4" />
                  ) : (
                    entry.rank
                  )}
                </div>
                <AvatarWithStatus
                  src={entry.avatarUrl}
                  alt={entry.name}
                  fallback={entry.name.slice(0, 2)}
                  size="md"
                />
              </div>

              {/* Right: Info + Action */}
              <div className="min-w-0 flex flex-col">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-[#111827] truncate">
                    {entry.name}
                  </p>
                  {entry.isMe && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-[#22C55E] text-white rounded-full shrink-0">
                      내 순위
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <TierBadge tier={entry.tier} />
                  <ScoreChip score={entry.matchingScore} />
                </div>
                {entry.badges.length > 0 && (
                  <div className="mb-2">
                    <BadgeRow badges={entry.badges} maxVisible={2} />
                  </div>
                )}
                <Link
                  href={`/helpers/${entry.id}`}
                  className="self-start mt-auto"
                >
                  <SecondaryButton size="sm">프로필</SecondaryButton>
                </Link>
              </div>
            </div>

            {/* Desktop: Row layout */}
            <div className="hidden sm:grid sm:grid-cols-[32px_48px_1fr_auto] sm:items-center sm:gap-3">
              {/* Rank */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${getRankStyle(
                  entry.rank
                )}`}
              >
                {entry.rank <= 3 ? (
                  <Trophy className="w-4 h-4" />
                ) : (
                  entry.rank
                )}
              </div>

              {/* Avatar */}
              <AvatarWithStatus
                src={entry.avatarUrl}
                alt={entry.name}
                fallback={entry.name.slice(0, 2)}
                size="md"
              />

              {/* Info */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-[#111827] truncate">
                    {entry.name}
                  </p>
                  {entry.isMe && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-[#22C55E] text-white rounded-full shrink-0">
                      내 순위
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <TierBadge tier={entry.tier} />
                  <ScoreChip score={entry.matchingScore} />
                </div>
                {entry.badges.length > 0 && (
                  <BadgeRow badges={entry.badges} maxVisible={2} />
                )}
              </div>

              {/* Action */}
              <Link href={`/helpers/${entry.id}`} className="shrink-0">
                <SecondaryButton size="sm">프로필</SecondaryButton>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
