"use client";

import Link from "next/link";
import { StatusBadge, MoneyKRW, SecondaryButton } from "@/components/ui-kit";
import { ChevronRight, MapPin, Clock } from "lucide-react";

interface RequestPreview {
  id: string;
  category: string;
  status:
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
  datetime: string;
  location: string;
  price: number;
}

// Mock data
const mockMyRequests: RequestPreview[] = [
  {
    id: "req_1",
    category: "청소",
    status: "posted",
    datetime: "오늘 오후 2:00",
    location: "서울 강남구",
    price: 50000,
  },
  {
    id: "req_2",
    category: "빨래",
    status: "assigned",
    datetime: "내일 오전 10:00",
    location: "서울 서초구",
    price: 30000,
  },
  {
    id: "req_3",
    category: "요리",
    status: "in_progress",
    datetime: "2024.02.20 오후 3:00",
    location: "서울 송파구",
    price: 70000,
  },
];

export function MyRequestsPreview() {
  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-[#111827]">내가 올린 요청</h3>
        <Link
          href="/requests"
          className="text-xs text-[#22C55E] hover:underline"
        >
          전체 보기
        </Link>
      </div>

      {mockMyRequests.length > 0 ? (
        <div className="space-y-2">
          {mockMyRequests.map((request) => (
            <Link key={request.id} href={`/requests/${request.id}`}>
              <div className="grid grid-cols-[1fr_auto] items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <StatusBadge status={request.status} />
                    <span className="text-sm font-medium text-[#111827] truncate">
                      {request.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 shrink-0" />
                      {request.datetime}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {request.location}
                    </span>
                  </div>
                  <MoneyKRW
                    amount={request.price}
                    className="text-sm font-bold text-[#111827] mt-1"
                  />
                </div>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF] shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-[#6B7280]">
          아직 올린 요청이 없습니다
        </div>
      )}

      <div className="mt-3">
        <Link href="/requests">
          <SecondaryButton className="w-full">
            내 요청 전체 보기
          </SecondaryButton>
        </Link>
      </div>
    </div>
  );
}
