"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type OrderStatus =
  | "posted"
  | "assigned"
  | "escrow_held"
  | "in_progress"
  | "done_by_helper"
  | "confirmed_by_customer"
  | "auto_confirmed"
  | "paid_out"
  | "disputed"
  | "cancelled";

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  posted: {
    label: "등록됨",
    className: "bg-[#F8FAFC] text-[#6B7280] border-[#E5E7EB]",
  },
  assigned: {
    label: "매칭됨",
    className: "bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]",
  },
  escrow_held: {
    label: "결제완료",
    className: "bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]",
  },
  in_progress: {
    label: "진행중",
    className: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
  },
  done_by_helper: {
    label: "완료대기",
    className: "bg-[#E0E7FF] text-[#3730A3] border-[#C7D2FE]",
  },
  confirmed_by_customer: {
    label: "확정됨",
    className: "bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]",
  },
  auto_confirmed: {
    label: "자동확정",
    className: "bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]",
  },
  paid_out: {
    label: "정산완료",
    className: "bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]",
  },
  disputed: {
    label: "분쟁중",
    className: "bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]",
  },
  cancelled: {
    label: "취소됨",
    className: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]",
  },
};

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium text-xs rounded-lg px-2 py-0.5",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
