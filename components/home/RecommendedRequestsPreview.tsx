"use client";

import Link from "next/link";
import { MoneyKRW } from "@/components/ui-kit";
import { ChevronRight, MapPin, Clock, Sparkles } from "lucide-react";

interface RecommendedRequest {
  id: string;
  category: string;
  datetime: string;
  location: string;
  price: number;
  matchReason: string;
}

// Mock data - sorted by internal algorithm, no user sort UI
const mockRecommendedRequests: RecommendedRequest[] = [
  {
    id: "rec_1",
    category: "청소",
    datetime: "오늘 오후 5:00",
    location: "서울 강남구",
    price: 55000,
    matchReason: "전문 분야 일치",
  },
  {
    id: "rec_2",
    category: "빨래",
    datetime: "내일 오전 9:00",
    location: "서울 강남구",
    price: 35000,
    matchReason: "근처 위치",
  },
  {
    id: "rec_3",
    category: "정리정돈",
    datetime: "2024.02.21 오후 1:00",
    location: "서울 서초구",
    price: 45000,
    matchReason: "높은 매칭 점수",
  },
];

export function RecommendedRequestsPreview() {
  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#22C55E]" />
          <h3 className="font-medium text-[#111827]">추천 요청</h3>
        </div>
        <Link
          href="/requests"
          className="text-xs text-[#22C55E] hover:underline"
        >
          더보기
        </Link>
      </div>

      {mockRecommendedRequests.length > 0 ? (
        <div className="space-y-2">
          {mockRecommendedRequests.map((request) => (
            <Link key={request.id} href={`/requests/${request.id}`}>
              <div className="grid grid-cols-[1fr_auto] items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-[#111827] truncate">
                      {request.category}
                    </span>
                    <span className="text-xs text-[#22C55E] font-medium">
                      {request.matchReason}
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
          추천 요청이 없습니다
        </div>
      )}
    </div>
  );
}
