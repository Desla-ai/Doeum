"use client";

import {
  TierBadge,
  ScoreChip,
  BadgeRow,
  AvatarWithStatus,
  type HelperBadge,
} from "@/components/ui-kit";
import { useAppMode } from "@/components/providers/AppModeProvider";

interface HomeHeaderCardProps {
  name: string;
  avatarUrl?: string;
  isOnline?: boolean;
  tier?: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";
  matchingScore?: number;
  badges?: HelperBadge[];
}

export function HomeHeaderCard({
  name,
  avatarUrl,
  isOnline = false,
  tier,
  matchingScore,
  badges = [],
}: HomeHeaderCardProps) {
  const { isHelper } = useAppMode();

  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4">
      <div className="grid grid-cols-[56px_1fr] gap-4">
        <AvatarWithStatus
          src={avatarUrl}
          alt={name}
          fallback={name.slice(0, 2)}
          isOnline={isHelper && isOnline}
          size="lg"
        />
        <div className="min-w-0">
          <p className="text-sm text-[#6B7280]">
            {isHelper ? "도우미 모드" : "고객 모드"}
          </p>
          <h2 className="text-lg font-bold text-[#111827] truncate">
            {name}님, 안녕하세요!
          </h2>
          {/* Show score for both customer and helper modes */}
          {matchingScore !== undefined && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {isHelper && tier && <TierBadge tier={tier} />}
              <ScoreChip score={matchingScore} />
            </div>
          )}
          {isHelper && badges.length > 0 && (
            <div className="mt-2">
              <BadgeRow badges={badges} maxVisible={3} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
