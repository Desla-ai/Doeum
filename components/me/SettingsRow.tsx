"use client";

import React from "react"

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SettingsRowProps {
  icon: LucideIcon;
  label: string;
  href: string;
  description?: string;
  isFirst?: boolean;
  isLast?: boolean;
}

export function SettingsRow({
  icon: Icon,
  label,
  href,
  description,
  isFirst = false,
  isLast = false,
}: SettingsRowProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center justify-between p-4 hover:bg-[#F8FAFC] active:bg-[#F1F5F9] transition-colors",
          !isLast && "border-b border-[#E5E7EB]"
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Icon className="w-5 h-5 text-[#6B7280] shrink-0" />
          <div className="min-w-0">
            <span className="text-[#111827] block truncate">{label}</span>
            {description && (
              <span className="text-xs text-[#9CA3AF] block truncate">
                {description}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#9CA3AF] shrink-0" />
      </div>
    </Link>
  );
}

interface SettingsGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function SettingsGroup({ children, className }: SettingsGroupProps) {
  return (
    <div
      className={cn(
        "w-full max-w-full rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}
