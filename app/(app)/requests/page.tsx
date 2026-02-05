"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppMode } from "@/components/providers/AppModeProvider";
import {
  RequestCard,
  type RequestData,
} from "@/components/requests/RequestCard";
import { OnlineHelpersShowcase } from "@/components/helpers/OnlineHelpersShowcase";
import { PrimaryButton, SecondaryButton } from "@/components/ui-kit";
import { Plus } from "lucide-react";
import type { HelperData } from "@/components/helpers/HelperCard";

// Mock data for requests
const mockRequests: RequestData[] = [
  {
    id: "req_123",
    category: "청소",
    status: "posted",
    datetime: "2024.02.15",
    time: "오전 10:00",
    location: "서울 강남구 역삼동",
    price: 50000,
    description: "원룸 청소 부탁드려요. 화장실, 주방 포함입니다.",
  },
  {
    id: "req_124",
    category: "빨래",
    status: "assigned",
    datetime: "2024.02.16",
    time: "오후 2:00",
    location: "서울 서초구 반포동",
    price: 30000,
    description: "빨래 + 다림질 부탁드립니다.",
  },
  {
    id: "req_125",
    category: "요리",
    status: "posted",
    datetime: "2024.02.17",
    time: "오후 6:00",
    location: "서울 강남구 삼성동",
    price: 80000,
    description: "저녁 식사 준비 (4인분)",
  },
  {
    id: "req_126",
    category: "청소",
    status: "escrow_held",
    datetime: "2024.02.18",
    time: "오전 9:00",
    location: "서울 송파구 잠실동",
    price: 70000,
    description: "이사 전 입주청소 부탁드립니다.",
  },
  {
    id: "req_127",
    category: "정리정돈",
    status: "posted",
    datetime: "2024.02.19",
    time: "오후 1:00",
    location: "서울 마포구 연남동",
    price: 45000,
    description: "옷장 정리 도움이 필요해요.",
  },
  {
    id: "req_128",
    category: "청소",
    status: "in_progress",
    datetime: "2024.02.20",
    time: "오전 11:00",
    location: "서울 용산구 이태원동",
    price: 60000,
    description: "사무실 청소 (주 1회)",
  },
  {
    id: "req_129",
    category: "심부름",
    status: "posted",
    datetime: "2024.02.21",
    time: "오후 3:00",
    location: "서울 강동구 천호동",
    price: 25000,
    description: "마트 장보기 대행",
  },
  {
    id: "req_130",
    category: "청소",
    status: "done_by_helper",
    datetime: "2024.02.22",
    time: "오전 10:00",
    location: "서울 강북구 미아동",
    price: 55000,
    description: "대청소 (베란다 포함)",
  },
  {
    id: "req_131",
    category: "요리",
    status: "posted",
    datetime: "2024.02.23",
    time: "오후 12:00",
    location: "서울 중구 명동",
    price: 90000,
    description: "점심 도시락 준비 (10인분)",
  },
  {
    id: "req_132",
    category: "빨래",
    status: "posted",
    datetime: "2024.02.24",
    time: "오후 4:00",
    location: "서울 동대문구 회기동",
    price: 35000,
    description: "세탁 + 수선 필요",
  },
];

// Mock data for helpers
const mockHelpers: HelperData[] = [
  {
    id: "helper_123",
    name: "김영희",
    tier: "GOLD",
    matchingScore: 92,
    services: ["청소", "정리정돈", "빨래"],
    badges: [
      { id: "b1", label: "응답왕", description: "평균 응답 5분 이내" },
      { id: "b2", label: "단골왕", description: "재요청률 80% 이상" },
      { id: "b3", label: "성실왕", description: "완료율 95% 이상" },
      { id: "b4", label: "친절왕", description: "칭찬 100회 이상" },
    ],
    isOnline: true,
  },
  {
    id: "helper_124",
    name: "이철수",
    tier: "PLATINUM",
    matchingScore: 88,
    services: ["청소", "요리"],
    badges: [
      { id: "b1", label: "프로도우미", description: "경력 3년 이상" },
      { id: "b2", label: "성실왕", description: "완료율 95% 이상" },
    ],
    isOnline: true,
  },
  {
    id: "helper_125",
    name: "박지민",
    tier: "DIAMOND",
    matchingScore: 95,
    services: ["청소", "빨래", "요리", "정리정돈"],
    badges: [
      { id: "b1", label: "최다완료", description: "누적 500건 이상" },
      { id: "b2", label: "응답왕", description: "평균 응답 5분 이내" },
      { id: "b3", label: "성실왕", description: "완료율 95% 이상" },
      { id: "b4", label: "친절왕", description: "칭찬 100회 이상" },
      { id: "b5", label: "단골왕", description: "재요청률 80% 이상" },
    ],
    isOnline: true,
  },
  {
    id: "helper_126",
    name: "정수연",
    tier: "SILVER",
    matchingScore: 78,
    services: ["청소", "심부름"],
    badges: [
      { id: "b1", label: "신규도우미", description: "활동 1개월 미만" },
    ],
    isOnline: true,
  },
  {
    id: "helper_127",
    name: "최민준",
    tier: "GOLD",
    matchingScore: 85,
    services: ["요리", "심부름"],
    badges: [
      { id: "b1", label: "요리전문가", description: "요리 분야 전문" },
      { id: "b2", label: "응답왕", description: "평균 응답 5분 이내" },
    ],
    isOnline: true,
  },
  {
    id: "helper_128",
    name: "강서윤",
    tier: "BRONZE",
    matchingScore: 72,
    services: ["빨래", "정리정돈"],
    badges: [
      { id: "b1", label: "신규도우미", description: "활동 1개월 미만" },
    ],
    isOnline: true,
  },
  {
    id: "helper_129",
    name: "윤하늘",
    tier: "GOLD",
    matchingScore: 89,
    services: ["청소", "빨래"],
    badges: [
      { id: "b1", label: "단골왕", description: "재요청률 80% 이상" },
      { id: "b2", label: "성실왕", description: "완료율 95% 이상" },
      { id: "b3", label: "친절왕", description: "칭찬 100회 이상" },
    ],
    isOnline: true,
  },
];

export default function RequestsPage() {
  const { isCustomer, isHelper } = useAppMode();
  const [isLoading, setIsLoading] = useState(false);
  const [helpers, setHelpers] = useState(mockHelpers);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh - shuffle helpers
    setTimeout(() => {
      setHelpers([...helpers].sort(() => Math.random() - 0.5));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-full">
      {/* Mode-aware Content */}
      {isCustomer ? (
        // Customer Mode: Show online helpers directory (일해요)
        <div className="p-4">
          <OnlineHelpersShowcase
            helpers={helpers}
            region="서울 강남구"
            isLoading={isLoading}
            onRefresh={handleRefresh}
          />
        </div>
      ) : (
        // Helper Mode: Show service request feed (구해요)
        // Only show "posted" status requests - other statuses are visible in /orders
        (() => {
          const helperFeedRequests = mockRequests.filter(
            (r) => r.status === "posted"
          );

          if (helperFeedRequests.length === 0) {
            return (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-[#9CA3AF]" />
                </div>
                <h2 className="text-lg font-bold text-[#111827] mb-2">
                  현재 등록된 요청이 없어요
                </h2>
                <p className="text-sm text-[#6B7280]">
                  잠시 후 다시 확인해주세요
                </p>
              </div>
            );
          }

          return (
            <div className="p-4 space-y-3">
              {helperFeedRequests.map((request) => (
                <RequestCard key={request.id} request={request} isHelper />
              ))}
            </div>
          );
        })()
      )}

      {/* Mode-aware Floating CTA */}
      {isCustomer ? (
        // Customer: "요청 올리기" button
        <Link href="/requests/new" className="fixed bottom-24 right-4 z-50">
          <PrimaryButton className="h-14 px-5 rounded-full shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            요청 올리기
          </PrimaryButton>
        </Link>
      ) : (
        // Helper: "내역 보기" button (minimal, clean UI)
        <Link href="/orders" className="fixed bottom-24 right-4 z-50">
          <SecondaryButton className="h-12 px-4 rounded-full shadow-lg bg-white border-[#E5E7EB]">
            내역 보기
          </SecondaryButton>
        </Link>
      )}
    </div>
  );
}
