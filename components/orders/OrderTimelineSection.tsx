"use client";

import { Timeline, type TimelineItem } from "@/components/ui-kit";

type OrderStatus =
  | "assigned"
  | "escrow_held"
  | "in_progress"
  | "done_by_helper"
  | "confirmed_by_customer"
  | "auto_confirmed"
  | "paid_out";

interface OrderTimelineSectionProps {
  currentStatus: OrderStatus;
  timestamps?: Record<string, string>;
}

const statusOrder: OrderStatus[] = [
  "assigned",
  "escrow_held",
  "in_progress",
  "done_by_helper",
  "confirmed_by_customer",
  "paid_out",
];

const statusLabels: Record<OrderStatus, string> = {
  assigned: "도우미 매칭됨",
  escrow_held: "결제 완료 (에스크로)",
  in_progress: "작업 진행 중",
  done_by_helper: "작업 완료 (도우미)",
  confirmed_by_customer: "고객 확정",
  auto_confirmed: "자동 확정",
  paid_out: "정산 완료",
};

export function OrderTimelineSection({
  currentStatus,
  timestamps = {},
}: OrderTimelineSectionProps) {
  const currentIndex = statusOrder.indexOf(
    currentStatus === "auto_confirmed" ? "confirmed_by_customer" : currentStatus
  );

  const timelineItems: TimelineItem[] = statusOrder.map((status, index) => {
    let itemStatus: "completed" | "current" | "upcoming";

    if (index < currentIndex) {
      itemStatus = "completed";
    } else if (index === currentIndex) {
      itemStatus = "current";
    } else {
      itemStatus = "upcoming";
    }

    return {
      id: status,
      label:
        currentStatus === "auto_confirmed" && status === "confirmed_by_customer"
          ? "자동 확정"
          : statusLabels[status],
      timestamp: timestamps[status],
      status: itemStatus,
    };
  });

  return (
    <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white">
      <h3 className="font-medium text-[#111827] mb-4">주문 진행 상태</h3>
      <Timeline items={timelineItems} />
    </div>
  );
}
