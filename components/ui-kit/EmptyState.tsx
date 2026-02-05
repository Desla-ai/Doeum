"use client";

import React from "react"

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#F8FAFC] text-[#9CA3AF] mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-[#111827] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[#6B7280] max-w-xs mb-4">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
