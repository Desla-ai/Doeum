"use client";

import { cn } from "@/lib/utils";

interface ScoreChipProps {
  score: number;
  className?: string;
}

export function ScoreChip({ score, className }: ScoreChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 bg-[#F0FDF4] text-[#166534] rounded-lg text-sm font-medium shrink-0",
        className
      )}
    >
      <span className="text-[#22C55E] shrink-0">●</span>
      <span className="text-xs text-[#6B7280] shrink-0">매칭점수</span>
      <span className="font-bold tabular-nums">{score}</span>
    </div>
  );
}
