"use client";

import { cn } from "@/lib/utils";
import { Check, Circle } from "lucide-react";

export interface TimelineItem {
  id: string;
  label: string;
  description?: string;
  timestamp?: string;
  status: "completed" | "current" | "upcoming";
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2",
                item.status === "completed" &&
                  "bg-[#22C55E] border-[#22C55E] text-white",
                item.status === "current" &&
                  "bg-white border-[#22C55E] text-[#22C55E]",
                item.status === "upcoming" &&
                  "bg-[#F8FAFC] border-[#E5E7EB] text-[#9CA3AF]"
              )}
            >
              {item.status === "completed" ? (
                <Check className="w-4 h-4" />
              ) : (
                <Circle className="w-3 h-3" fill="currentColor" />
              )}
            </div>
            {index < items.length - 1 && (
              <div
                className={cn(
                  "w-0.5 flex-1 min-h-8",
                  item.status === "completed" ? "bg-[#22C55E]" : "bg-[#E5E7EB]"
                )}
              />
            )}
          </div>
          <div className="pb-6 pt-1">
            <p
              className={cn(
                "font-medium text-sm",
                item.status === "upcoming" ? "text-[#9CA3AF]" : "text-[#111827]"
              )}
            >
              {item.label}
            </p>
            {item.description && (
              <p className="text-xs text-[#6B7280] mt-0.5">{item.description}</p>
            )}
            {item.timestamp && (
              <p className="text-xs text-[#9CA3AF] mt-1">{item.timestamp}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
