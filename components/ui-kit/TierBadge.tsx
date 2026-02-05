"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Tier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";

const tierConfig: Record<
  Tier,
  { label: string; className: string; icon: string }
> = {
  BRONZE: {
    label: "브론즈",
    className: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
    icon: "🥉",
  },
  SILVER: {
    label: "실버",
    className: "bg-[#F3F4F6] text-[#374151] border-[#D1D5DB]",
    icon: "🥈",
  },
  GOLD: {
    label: "골드",
    className: "bg-[#FEF9C3] text-[#A16207] border-[#FDE047]",
    icon: "🥇",
  },
  PLATINUM: {
    label: "플래티넘",
    className: "bg-[#E0E7FF] text-[#3730A3] border-[#C7D2FE]",
    icon: "💎",
  },
  DIAMOND: {
    label: "다이아",
    className: "bg-[#DBEAFE] text-[#1E40AF] border-[#93C5FD]",
    icon: "💠",
  },
};

interface TierBadgeProps {
  tier: Tier;
  className?: string;
  showIcon?: boolean;
}

export function TierBadge({ tier, className, showIcon = true }: TierBadgeProps) {
  const config = tierConfig[tier];

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold text-xs rounded-lg px-2 py-0.5",
        config.className,
        className
      )}
    >
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </Badge>
  );
}
