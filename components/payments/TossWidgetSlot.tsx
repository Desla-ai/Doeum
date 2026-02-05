"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface TossWidgetSlotProps {
  isLoading?: boolean;
  className?: string;
}

export function TossWidgetSlot({
  isLoading = true,
  className,
}: TossWidgetSlotProps) {
  return (
    <div
      className={`p-6 rounded-2xl border border-[#E5E7EB] bg-white ${className}`}
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <div className="flex justify-center pt-4">
            <span className="text-sm text-[#9CA3AF]">
              토스 결제 위젯 영역
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <p className="text-[#6B7280] text-sm">토스 결제 위젯이 로드됩니다</p>
          <p className="text-xs text-[#9CA3AF] mt-1">
            TossPayments Widget Integration
          </p>
        </div>
      )}
    </div>
  );
}
