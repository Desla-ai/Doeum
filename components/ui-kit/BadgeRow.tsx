"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface HelperBadge {
  id: string;
  label: string;
  description?: string;
}

interface BadgeRowProps {
  badges: HelperBadge[];
  maxVisible?: number;
  className?: string;
}

export function BadgeRow({ badges, maxVisible = 3, className }: BadgeRowProps) {
  const visibleBadges = badges.slice(0, maxVisible);
  const hiddenBadges = badges.slice(maxVisible);
  const hasMore = hiddenBadges.length > 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {visibleBadges.map((badge) => (
        <Badge
          key={badge.id}
          variant="outline"
          className="bg-[#F8FAFC] text-[#374151] border-[#E5E7EB] text-xs rounded-lg px-2 py-0.5"
        >
          {badge.label}
        </Badge>
      ))}
      {hasMore && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-[#6B7280] hover:text-[#111827] hover:bg-[#F8FAFC] rounded-lg"
            >
              +{hiddenBadges.length}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-[#111827]">모든 배지</h4>
              <div className="flex flex-wrap gap-1.5">
                {badges.map((badge) => (
                  <Badge
                    key={badge.id}
                    variant="outline"
                    className="bg-[#F8FAFC] text-[#374151] border-[#E5E7EB] text-xs rounded-lg px-2 py-0.5"
                    title={badge.description}
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
