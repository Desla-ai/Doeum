"use client";

import { MoneyKRW } from "@/components/ui-kit";

interface MonthlySummaryBarProps {
  /** Label for count tile - e.g., "일한 횟수" or "고용 횟수" */
  countLabel: string;
  /** Label for amount tile - e.g., "수익" or "지불한 임금" */
  amountLabel: string;
  /** Count value */
  count: number;
  /** Amount value in KRW */
  amount: number;
}

/**
 * Monthly summary bar with 1:2 tile ratio (count:amount) to prevent overflow
 * on large amounts (7+ digits like 9,999,999원)
 */
export function MonthlySummaryBar({
  countLabel,
  amountLabel,
  count,
  amount,
}: MonthlySummaryBarProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Count Tile - 1 column */}
      <div className="col-span-1 p-3 bg-[#F0FDF4] rounded-xl overflow-hidden">
        <p className="text-xs text-[#6B7280] mb-1 truncate">{countLabel}</p>
        <div className="min-w-0 text-right">
          <span className="text-xl font-bold text-[#111827] tabular-nums leading-none">
            {count}
          </span>
          <span className="text-sm font-medium text-[#6B7280] ml-0.5">건</span>
        </div>
      </div>

      {/* Amount Tile - 2 columns */}
      <div className="col-span-2 p-3 bg-[#F0FDF4] rounded-xl overflow-hidden">
        <p className="text-xs text-[#6B7280] mb-1 truncate">{amountLabel}</p>
        <div className="min-w-0 text-right">
          <MoneyKRW
            amount={amount}
            className="text-xl font-bold text-[#111827] tabular-nums leading-none truncate"
          />
        </div>
      </div>
    </div>
  );
}
