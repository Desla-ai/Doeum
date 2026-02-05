"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  StatusBadge,
  MoneyKRW,
  TierBadge,
  ScoreChip,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui-kit";
import { OrderTimelineSection } from "@/components/orders/OrderTimelineSection";
import { AutoConfirmCountdown } from "@/components/orders/AutoConfirmCountdown";
import { BottomCTA } from "@/components/shell/BottomCTA";
import {
  MapPin,
  Calendar,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";

const mockOrder = {
  id: "order_123",
  status: "done_by_helper" as const,
  category: "청소",
  datetime: "2024.02.15",
  time: "오전 10:00",
  location: "서울 강남구 역삼동 테헤란로 152",
  price: 50000,
  platformFee: 2000,
  totalPrice: 52000,
  description: "원룸 청소 부탁드려요. 화장실, 주방 포함입니다.",
  helper: {
    id: "helper_123",
    name: "김영희",
    tier: "GOLD" as const,
    matchingScore: 920,
  },
  timestamps: {
    assigned: "2024.02.14 10:30",
    escrow_held: "2024.02.14 11:00",
    in_progress: "2024.02.15 10:00",
    done_by_helper: "2024.02.15 12:30",
  },
};

// Auto confirm deadline is 24h from done_by_helper
const autoConfirmDeadline = new Date();
autoConfirmDeadline.setHours(autoConfirmDeadline.getHours() + 23);
autoConfirmDeadline.setMinutes(autoConfirmDeadline.getMinutes() + 45);

export default function OrderDetailPage() {
  const isCustomer = true;
  const showAutoConfirmCountdown = mockOrder.status === "done_by_helper";

  return (
    <div
      className="w-full max-w-full"
      style={{
        paddingBottom:
          "calc(var(--bottom-tabs-h) + var(--safe-bottom) + 120px)",
      }}
    >
      {/* Order Summary */}
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={mockOrder.status} />
          <Badge
            variant="outline"
            className="bg-[#F0FDF4] text-[#166534] border-[#BBF7D0] text-xs rounded-lg"
          >
            {mockOrder.category}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-[#6B7280]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>
              {mockOrder.datetime} {mockOrder.time}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="break-words">{mockOrder.location}</span>
          </div>
        </div>

        <p className="text-[#374151]">{mockOrder.description}</p>

        {/* Price Breakdown */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-2 overflow-hidden">
          <div className="flex justify-between text-sm gap-2">
            <span className="text-[#6B7280] shrink-0">서비스 금액</span>
            <MoneyKRW
              amount={mockOrder.price}
              className="text-[#111827] tabular-nums"
            />
          </div>
          <div className="flex justify-between text-sm gap-2">
            <span className="text-[#6B7280] shrink-0">플랫폼 수수료</span>
            <MoneyKRW
              amount={mockOrder.platformFee}
              className="text-[#111827] tabular-nums"
            />
          </div>
          <div className="border-t border-[#E5E7EB] pt-2 flex justify-between gap-2">
            <span className="font-medium text-[#111827] shrink-0">
              총 결제금액
            </span>
            <MoneyKRW
              amount={mockOrder.totalPrice}
              className="text-lg font-bold text-[#22C55E] tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* Helper Info */}
      <div className="px-4 mb-4">
        <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
          <h3 className="font-medium text-[#111827] mb-3">담당 도우미</h3>
          <div className="grid grid-cols-[48px_1fr_auto] items-center gap-3">
            <Avatar className="w-12 h-12 shrink-0">
              <AvatarImage src="/placeholder.svg" alt={mockOrder.helper.name} />
              <AvatarFallback>
                {mockOrder.helper.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium text-[#111827] truncate">
                {mockOrder.helper.name}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <TierBadge tier={mockOrder.helper.tier} />
                <ScoreChip score={mockOrder.helper.matchingScore} />
              </div>
            </div>
            <Link href={`/helpers/${mockOrder.helper.id}`} className="shrink-0">
              <SecondaryButton size="sm">프로필</SecondaryButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Auto Confirm Countdown */}
      {showAutoConfirmCountdown && (
        <div className="px-4 mb-4">
          <AutoConfirmCountdown targetTime={autoConfirmDeadline} />
        </div>
      )}

      {/* Timeline */}
      <div className="px-4 mb-4">
        <OrderTimelineSection
          currentStatus={mockOrder.status}
          timestamps={mockOrder.timestamps}
        />
      </div>

      {/* Bottom CTA Bar - Sits above BottomTabs */}
      <BottomCTA>
        <div className="space-y-2">
          {isCustomer && (
            <>
              {mockOrder.status === "assigned" && (
                <Link href={`/orders/${mockOrder.id}/checkout`}>
                  <PrimaryButton className="w-full h-12">결제하기</PrimaryButton>
                </Link>
              )}

              {mockOrder.status === "done_by_helper" && (
                <div className="flex gap-3">
                  <Link
                    href={`/orders/${mockOrder.id}/dispute`}
                    className="flex-1 min-w-0"
                  >
                    <SecondaryButton className="w-full h-12 text-[#EF4444] border-[#EF4444] hover:bg-[#FEF2F2]">
                      <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />
                      <span className="truncate">분쟁 접수</span>
                    </SecondaryButton>
                  </Link>
                  <PrimaryButton className="flex-1 min-w-0 h-12">
                    <span className="truncate">완료 확인</span>
                  </PrimaryButton>
                </div>
              )}

              <Link href="/chat/thread_123" className="block">
                <SecondaryButton className="w-full h-12">
                  <MessageCircle className="w-4 h-4 mr-2 shrink-0" />
                  채팅하기
                </SecondaryButton>
              </Link>
            </>
          )}

          {!isCustomer && (
            <>
              {mockOrder.status === "escrow_held" && (
                <PrimaryButton className="w-full h-12">작업 시작</PrimaryButton>
              )}
              {mockOrder.status === "in_progress" && (
                <PrimaryButton className="w-full h-12">작업 완료</PrimaryButton>
              )}
              <Link href="/chat/thread_123" className="block">
                <SecondaryButton className="w-full h-12">
                  <MessageCircle className="w-4 h-4 mr-2 shrink-0" />
                  채팅하기
                </SecondaryButton>
              </Link>
            </>
          )}
        </div>
      </BottomCTA>
    </div>
  );
}
