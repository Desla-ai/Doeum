"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  variant?: "card" | "list" | "profile" | "helper";
  count?: number;
  className?: string;
}

export function LoadingSkeleton({
  variant = "card",
  count = 1,
  className,
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === "helper") {
    return (
      <div className={cn("space-y-3", className)}>
        {items.map((i) => (
          <div
            key={i}
            className="p-4 rounded-2xl border border-[#E5E7EB] bg-white"
          >
            <div className="flex items-start gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 flex-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("space-y-3", className)}>
        {items.map((i) => (
          <div
            key={i}
            className="p-4 rounded-2xl border border-[#E5E7EB] bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-3" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("space-y-2", className)}>
        {items.map((i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "profile") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex flex-col items-center">
          <Skeleton className="w-24 h-24 rounded-full mb-3" />
          <Skeleton className="h-6 w-32 mb-2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return null;
}
