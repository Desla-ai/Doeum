"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  StatusBadge,
  MoneyKRW,
  EmptyState,
  SecondaryButton,
} from "@/components/ui-kit";
import { MonthlyWorkCalendar } from "@/components/orders/MonthlyWorkCalendar";
import { ShoppingBag, Calendar, MapPin } from "lucide-react";
import { useAppMode } from "@/components/providers/AppModeProvider";

// DEBUG FLAG: Set to true to test 7-digit amount display
const DEBUG_BIG_AMOUNT = true;

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
  /** Role indicates whether this order is from customer or helper perspective */
  role: "customer" | "helper";
}

// Mock orders with role field for proper mode-based filtering
const mockOrders: Order[] = [
  // Helper orders (user worked as helper and earned money)
  {
    id: "order_123",
    category: "청소",
    status: "done_by_helper",
    datetime: "2024.02.15 오전 10:00",
    location: "서울 강남구 역삼동",
    price: 50000,
    role: "helper",
  },
  {
    id: "order_126",
    category: "정리정돈",
    status: "confirmed_by_customer",
    datetime: "2024.02.14 오전 11:00",
    location: "서울 마포구 연남동",
    price: 45000,
    role: "helper",
  },
  {
    id: "order_127",
    category: "청소",
    status: "paid_out",
    datetime: "2024.02.10 오전 9:00",
    location: "서울 송파구 잠실동",
    price: 60000,
    role: "helper",
  },
  // Big amount order for testing (helper earned a lot)
  {
    id: "order_big",
    category: "대청소",
    status: "paid_out",
    datetime: "2024.02.12 오전 10:00",
    location: "서울 용산구 한남동",
    price: 9_500_000, // Large amount for testing overflow
    role: "helper",
  },
  // Customer orders (user hired helpers and paid money)
  {
    id: "order_124",
    category: "요리",
    status: "in_progress",
    datetime: "2024.02.16 오후 6:00",
    location: "서울 서초구 반포동",
    price: 80000,
    role: "customer",
  },
  {
    id: "order_125",
    category: "빨래",
    status: "escrow_held",
    datetime: "2024.02.17 오후 2:00",
    location: "서울 강남구 삼성동",
    price: 30000,
    role: "customer",
  },
  {
    id: "order_128",
    category: "청소",
    status: "confirmed_by_customer",
    datetime: "2024.02.13 오후 3:00",
    location: "서울 강남구 청담동",
    price: 55000,
    role: "customer",
  },
];

// Statuses that count as "confirmed/completed" for helper revenue
const HELPER_REVENUE_STATUSES = [
  "confirmed_by_customer",
  "auto_confirmed",
  "paid_out",
];

// Statuses that count as "paid" for customer expenses (escrow or later)
const CUSTOMER_EXPENSE_STATUSES = [
  "escrow_held",
  "in_progress",
  "done_by_helper",
  "confirmed_by_customer",
  "auto_confirmed",
  "paid_out",
];

export default function OrdersPage() {
  const { mode } = useAppMode();
  const isHelper = mode === "helper";

  // Filter orders based on mode
  const filteredOrders = mockOrders.filter((order) =>
    isHelper ? order.role === "helper" : order.role === "customer"
  );

  // Labels based on mode
  const countLabel = isHelper ? "일한 횟수" : "고용 횟수";
  const amountLabel = isHelper ? "수익" : "지불한 임금";

  // Status filter for counting/summing based on mode
  const relevantStatuses = isHelper
    ? HELPER_REVENUE_STATUSES
    : CUSTOMER_EXPENSE_STATUSES;

  if (filteredOrders.length === 0) {
    return (
      <div className="w-full max-w-full">
        <EmptyState
          icon={<ShoppingBag className="w-8 h-8" />}
          title={isHelper ? "일한 내역이 없어요" : "주문이 없어요"}
          description={
            isHelper
              ? "요청에 지원하고 일을 시작하면 여기에 표시됩니다."
              : "요청을 올리고 도우미를 선택하면 여기에 표시됩니다."
          }
          action={
            <Link href="/requests">
              <SecondaryButton>
                {isHelper ? "요청 찾아보기" : "요청 보러가기"}
              </SecondaryButton>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* Monthly Calendar Section */}
      <div className="p-4 pb-2">
        <MonthlyWorkCalendar
          orders={filteredOrders}
          mode={mode}
          countLabel={countLabel}
          amountLabel={amountLabel}
          relevantStatuses={relevantStatuses}
          debugBigAmount={DEBUG_BIG_AMOUNT}
        />
      </div>

      {/* Section Divider */}
      <div className="px-4 py-3">
        <h2 className="text-sm font-medium text-[#6B7280]">
          {isHelper ? "이번 달 작업 내역" : "이번 달 주문 내역"}
        </h2>
      </div>

      {/* Order Cards List */}
      <div className="px-4 pb-4 space-y-3">
        {filteredOrders.map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`}>
            <div className="w-full max-w-full p-4 rounded-2xl border border-[#E5E7EB] bg-white hover:bg-[#F8FAFC] transition-colors overflow-hidden">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <StatusBadge status={order.status} />
                <Badge
                  variant="outline"
                  className="bg-[#F0FDF4] text-[#166534] border-[#BBF7D0] text-xs rounded-lg"
                >
                  {order.category}
                </Badge>
              </div>

              <div className="space-y-1.5 text-sm text-[#6B7280] mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{order.datetime}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="break-words">{order.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <MoneyKRW
                  amount={order.price}
                  className="text-lg font-bold text-[#111827] tabular-nums"
                />
                <span className="text-sm text-[#22C55E] shrink-0">
                  상세 보기 →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
