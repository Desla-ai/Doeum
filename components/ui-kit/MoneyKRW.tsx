"use client";

import { cn } from "@/lib/utils";

interface MoneyKRWProps {
  amount: number;
  className?: string;
  showUnit?: boolean;
}

export function MoneyKRW({ amount, className, showUnit = true }: MoneyKRWProps) {
  const formatted = new Intl.NumberFormat("ko-KR").format(amount);

  return (
    <span className={cn("font-medium", className)}>
      {formatted}
      {showUnit && <span className="text-[#6B7280] ml-0.5">원</span>}
    </span>
  );
}
