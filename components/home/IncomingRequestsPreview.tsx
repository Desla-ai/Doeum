"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MoneyKRW, SecondaryButton } from "@/components/ui-kit";
import { ChevronRight, MapPin, Clock, UserCheck, Mail } from "lucide-react";

interface IncomingRequest {
  id: string;
  type: "direct" | "invited" | "proposal";
  category: string;
  datetime: string;
  location: string;
  price: number;
  customerName: string;
}

// Mock data
const mockIncomingRequests: IncomingRequest[] = [
  {
    id: "inc_1",
    type: "direct",
    category: "청소",
    datetime: "오늘 오후 4:00",
    location: "서울 강남구",
    price: 50000,
    customerName: "박지민",
  },
  {
    id: "inc_2",
    type: "invited",
    category: "요리",
    datetime: "내일 오전 11:00",
    location: "서울 서초구",
    price: 80000,
    customerName: "김민수",
  },
  {
    id: "inc_3",
    type: "proposal",
    category: "정리정돈",
    datetime: "2024.02.22 오후 2:00",
    location: "서울 송파구",
    price: 40000,
    customerName: "이수진",
  },
];

const typeConfig = {
  direct: {
    label: "지정 요청",
    icon: UserCheck,
    bgColor: "bg-[#F0FDF4]",
    textColor: "text-[#166534]",
    borderColor: "border-[#BBF7D0]",
  },
  invited: {
    label: "초대",
    icon: Mail,
    bgColor: "bg-[#EFF6FF]",
    textColor: "text-[#1E40AF]",
    borderColor: "border-[#BFDBFE]",
  },
  proposal: {
    label: "제안 대기",
    icon: Clock,
    bgColor: "bg-[#FEF3C7]",
    textColor: "text-[#92400E]",
    borderColor: "border-[#FDE68A]",
  },
};

export function IncomingRequestsPreview() {
  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-[#111827]">받은 요청</h3>
        <Link
          href="/requests"
          className="text-xs text-[#22C55E] hover:underline"
        >
          전체 보기
        </Link>
      </div>

      {mockIncomingRequests.length > 0 ? (
        <div className="space-y-2">
          {mockIncomingRequests.map((request) => {
            const config = typeConfig[request.type];
            const TypeIcon = config.icon;

            return (
              <Link key={request.id} href={`/requests/${request.id}`}>
                <div className="grid grid-cols-[1fr_auto] items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className={`${config.bgColor} ${config.textColor} ${config.borderColor} text-xs rounded-lg`}
                      >
                        <TypeIcon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
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
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#6B7280]">
                        {request.customerName}님
                      </span>
                      <span className="text-xs text-[#9CA3AF]">·</span>
                      <MoneyKRW
                        amount={request.price}
                        className="text-sm font-bold text-[#111827]"
                      />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-[#6B7280]">
          받은 요청이 없습니다
        </div>
      )}

      <div className="mt-3">
        <Link href="/requests">
          <SecondaryButton className="w-full">
            받은 요청 전체 보기
          </SecondaryButton>
        </Link>
      </div>
    </div>
  );
}
