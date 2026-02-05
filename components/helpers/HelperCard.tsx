"use client";

import { AvatarFallback } from "@/components/ui/avatar"

import { AvatarImage } from "@/components/ui/avatar"

import { Avatar } from "@/components/ui/avatar"

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  TierBadge,
  ScoreChip,
  BadgeRow,
  PrimaryButton,
  SecondaryButton,
  AvatarWithStatus,
  type HelperBadge,
} from "@/components/ui-kit";

type Tier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";

export interface HelperData {
  id: string;
  name: string;
  avatarUrl?: string;
  tier: Tier;
  matchingScore: number;
  services: string[];
  badges: HelperBadge[];
  isOnline?: boolean;
}

interface HelperCardProps {
  helper: HelperData;
}

export function HelperCard({ helper }: HelperCardProps) {
  return (
    <div className="w-full max-w-full p-4 rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
      {/* Grid: Avatar | Info */}
      <div className="grid grid-cols-[48px_1fr] gap-3">
        {/* Avatar */}
        <AvatarWithStatus
          src={helper.avatarUrl}
          alt={helper.name}
          fallback={helper.name.slice(0, 2)}
          isOnline={helper.isOnline}
          size="md"
        />

        {/* Info */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
            <span className="font-medium text-[#111827] truncate">
              {helper.name}
            </span>
            {helper.isOnline && (
              <span className="text-xs text-[#22C55E] shrink-0">온라인</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <TierBadge tier={helper.tier} />
            <ScoreChip score={helper.matchingScore} />
          </div>

          <div className="flex flex-wrap gap-1 mb-2">
            {helper.services.slice(0, 3).map((service) => (
              <Badge
                key={service}
                variant="outline"
                className="bg-[#F8FAFC] text-[#374151] border-[#E5E7EB] text-xs rounded-lg px-2 py-0.5"
              >
                {service}
              </Badge>
            ))}
          </div>

          <BadgeRow badges={helper.badges} maxVisible={2} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Link
          href={`/helpers/${helper.id}`}
          className="flex-1 min-w-[100px]"
        >
          <SecondaryButton className="w-full">프로필 보기</SecondaryButton>
        </Link>
        <Link
          href={`/requests/new?preferredHelperId=${helper.id}`}
          className="flex-1 min-w-[100px]"
        >
          <PrimaryButton className="w-full">지정 요청하기</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}
