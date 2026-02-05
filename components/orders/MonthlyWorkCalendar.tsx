"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock, CheckCircle } from "lucide-react";
import { MonthlySummaryBar } from "./MonthlySummaryBar";
import {
  parseLooseKoreanDateTimeToDateKST,
  getKSTDateKey,
  getKSTDateParts,
} from "@/lib/time/krTime";

interface Order {
  id: string;
  category: string;
  status:
    | "assigned"
    | "escrow_held"
    | "in_progress"
    | "done_by_helper"
    | "confirmed_by_customer"
    | "auto_confirmed"
    | "paid_out"
    | "disputed";
  datetime: string;
  location: string;
  price: number;
  role?: "customer" | "helper";
}

interface MonthlyWorkCalendarProps {
  orders: Order[];
  /** Current app mode */
  mode: "customer" | "helper";
  /** Label for count stat - e.g., "일한 횟수" or "고용 횟수" */
  countLabel: string;
  /** Label for amount stat - e.g., "수익" or "지불한 임금" */
  amountLabel: string;
  /** Statuses that count for aggregation */
  relevantStatuses: string[];
  /** Debug flag to test large amounts */
  debugBigAmount?: boolean;
}

// Parse datetime string like "2024.02.15 오전 10:00" to Date (using KST utility)
function parseDateTime(datetime: string): Date {
  return parseLooseKoreanDateTimeToDateKST(datetime) || new Date();
}

// Completed statuses that show "paid out" indicator
const PAID_OUT_STATUS = "paid_out";

// In-progress statuses for indicator
const IN_PROGRESS_STATUSES = [
  "in_progress",
  "escrow_held",
  "done_by_helper",
  "assigned",
];

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

export function MonthlyWorkCalendar({
  orders,
  mode,
  countLabel,
  amountLabel,
  relevantStatuses,
  debugBigAmount = false,
}: MonthlyWorkCalendarProps) {
  // Initialize to 2024-02 based on mock data
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 1, 1)); // Feb 2024
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Group orders by date (using KST date key for consistency)
  const ordersByDate = useMemo(() => {
    const map = new Map<string, Order[]>();
    for (const order of orders) {
      const date = parseDateTime(order.datetime);
      const key = getKSTDateKey(date);
      const existing = map.get(key) || [];
      existing.push(order);
      map.set(key, existing);
    }
    return map;
  }, [orders]);

  // Calculate monthly stats (using KST parts for accurate month comparison)
  const monthlyStats = useMemo(() => {
    const currentParts = getKSTDateParts(currentMonth);
    const targetYear = currentParts.year;
    const targetMonth = currentParts.month;

    let relevantCount = 0;
    let relevantAmount = 0;
    let inProgressCount = 0;
    let paidOutCount = 0;

    for (const order of orders) {
      const date = parseDateTime(order.datetime);
      const parts = getKSTDateParts(date);
      if (parts.year === targetYear && parts.month === targetMonth) {
        if (relevantStatuses.includes(order.status)) {
          relevantCount++;
          relevantAmount += order.price;
          if (order.status === PAID_OUT_STATUS) {
            paidOutCount++;
          }
        } else if (IN_PROGRESS_STATUSES.includes(order.status)) {
          inProgressCount++;
        }
      }
    }

    // Debug override for testing large amounts
    if (debugBigAmount) {
      relevantAmount = 9_999_999;
    }

    return { relevantCount, relevantAmount, inProgressCount, paidOutCount };
  }, [orders, currentMonth, relevantStatuses, debugBigAmount]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Adjust for Monday start (0 = Sunday -> shift to make Monday = 0)
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6; // Sunday becomes 6

    const days: (Date | null)[] = [];

    // Add empty slots before first day
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    // Add all days of month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  }, [currentMonth]);

  // Get orders for a specific date (using KST date key)
  const getOrdersForDate = (date: Date) => {
    const key = getKSTDateKey(date);
    return ordersByDate.get(key) || [];
  };

  // Check if date has relevant work (based on mode's relevant statuses)
  const hasRelevantWork = (date: Date) => {
    const dateOrders = getOrdersForDate(date);
    return dateOrders.some((o) => relevantStatuses.includes(o.status));
  };

  // Check if date has paid out
  const hasPaidOut = (date: Date) => {
    const dateOrders = getOrdersForDate(date);
    return dateOrders.some((o) => o.status === PAID_OUT_STATUS);
  };

  // Check if date has in-progress work
  const hasInProgressWork = (date: Date) => {
    const dateOrders = getOrdersForDate(date);
    return dateOrders.some((o) => IN_PROGRESS_STATUSES.includes(o.status));
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
    setSelectedDate(null);
  };

  // Selected date stats
  const selectedDateStats = useMemo(() => {
    if (!selectedDate) return null;

    const dateOrders = getOrdersForDate(selectedDate);
    const relevantOrders = dateOrders.filter((o) =>
      relevantStatuses.includes(o.status)
    );
    const totalAmount = relevantOrders.reduce((sum, o) => sum + o.price, 0);

    return {
      totalOrders: dateOrders.length,
      relevantOrders: relevantOrders.length,
      totalAmount,
    };
  }, [selectedDate, ordersByDate, relevantStatuses]);

  const isToday = (date: Date) => {
    return getKSTDateKey(date) === getKSTDateKey(new Date());
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return getKSTDateKey(date) === getKSTDateKey(selectedDate);
  };

  // Mode-specific labels for legend
  const completedLabel = mode === "helper" ? "완료" : "결제완료";
  const paidOutLabel = mode === "helper" ? "정산완료" : "확정완료";
  const inProgressLabel = "진행중";

  return (
    <div className="w-full max-w-full bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#6B7280]" />
            </button>
            <span className="text-lg font-bold text-[#111827] min-w-[120px] text-center">
              {getKSTDateParts(currentMonth).year}년{" "}
              {getKSTDateParts(currentMonth).month}월
            </span>
            <button
              type="button"
              onClick={goToNextMonth}
              className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>
          <span className="text-xs text-[#9CA3AF]">
            {debugBigAmount && "(테스트 모드)"}
          </span>
        </div>

        {/* Summary Stats with 1:2 ratio layout */}
        <MonthlySummaryBar
          countLabel={countLabel}
          amountLabel={amountLabel}
          count={monthlyStats.relevantCount}
          amount={monthlyStats.relevantAmount}
        />

        {/* Progress chips */}
        {(monthlyStats.inProgressCount > 0 ||
          monthlyStats.paidOutCount > 0) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {monthlyStats.inProgressCount > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-[#FEF3C7] rounded-full">
                <Clock className="w-3 h-3 text-[#D97706]" />
                <span className="text-xs text-[#92400E]">
                  진행중 {monthlyStats.inProgressCount}건
                </span>
              </div>
            )}
            {monthlyStats.paidOutCount > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-[#DCFCE7] rounded-full">
                <CheckCircle className="w-3 h-3 text-[#16A34A]" />
                <span className="text-xs text-[#166534]">
                  {paidOutLabel} {monthlyStats.paidOutCount}건
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day, idx) => (
            <div
              key={day}
              className={`text-center text-xs font-medium py-1 ${
                idx === 5
                  ? "text-[#3B82F6]"
                  : idx === 6
                    ? "text-[#EF4444]"
                    : "text-[#6B7280]"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, idx) => {
            if (!date) {
              return <div key={`empty-${idx}`} className="aspect-square" />;
            }

            const dayOfWeek = date.getDay();
            const isSaturday = dayOfWeek === 6;
            const isSunday = dayOfWeek === 0;
            const relevant = hasRelevantWork(date);
            const paidOut = hasPaidOut(date);
            const inProgress = hasInProgressWork(date);
            const today = isToday(date);
            const selected = isSelected(date);

            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => setSelectedDate(date)}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-colors relative ${
                  selected
                    ? "bg-[#22C55E] text-white"
                    : today
                      ? "bg-[#F3F4F6]"
                      : relevant
                        ? "bg-[#F0FDF4]"
                        : "hover:bg-[#F8FAFC]"
                }`}
              >
                <span
                  className={`text-sm ${
                    selected
                      ? "text-white font-bold"
                      : today
                        ? "text-[#111827] font-bold"
                        : isSunday
                          ? "text-[#EF4444]"
                          : isSaturday
                            ? "text-[#3B82F6]"
                            : "text-[#374151]"
                  }`}
                >
                  {date.getDate()}
                </span>

                {/* Indicators */}
                {!selected && (relevant || inProgress) && (
                  <div className="flex gap-0.5 mt-0.5">
                    {paidOut && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                    )}
                    {relevant && !paidOut && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    )}
                    {inProgress && !relevant && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Summary */}
      {selectedDate && selectedDateStats && selectedDateStats.totalOrders > 0 && (
        <div className="px-4 pb-4">
          <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
            <p className="text-xs text-[#6B7280] mb-1">
              {getKSTDateParts(selectedDate).month}월{" "}
              {getKSTDateParts(selectedDate).day}일
            </p>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-[#111827] truncate">
                {mode === "helper" ? "작업" : "주문"}{" "}
                {selectedDateStats.totalOrders}건
                {selectedDateStats.relevantOrders > 0 &&
                  ` (${completedLabel} ${selectedDateStats.relevantOrders}건)`}
              </span>
              {selectedDateStats.totalAmount > 0 && (
                <span className="text-sm font-bold text-[#22C55E] tabular-nums shrink-0">
                  {selectedDateStats.totalAmount.toLocaleString("ko-KR")}원
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <span>{completedLabel}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <span>{paidOutLabel}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span>{inProgressLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
