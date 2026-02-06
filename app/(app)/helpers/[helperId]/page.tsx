"use client";

import Link from "next/link";
import {
  BadgeRow,
  PrimaryButton,
  SecondaryButton,
  AvatarWithStatus,
} from "@/components/ui-kit";
import { MessageCircle, AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";

export default function HelperProfilePage() {
  const params = useParams<{ helperId: string }>();
  const helperId = params?.helperId;

  return (
    <div className="w-full max-w-full pb-24">
      {/* Header (placeholder) */}
      <div className="p-4 flex flex-col items-center text-center">
        <div className="mb-3">
          <AvatarWithStatus
            src="/placeholder.svg"
            alt="도우미"
            fallback="도우"
            isOnline={false}
            size="xl"
            className="w-24 h-24"
          />
        </div>

        <h1 className="text-xl font-bold text-[#111827] truncate max-w-full">
          도우미 프로필
        </h1>

        <div className="w-full mt-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-left">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#6B7280] mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-[#111827] font-medium">프로필 데이터 준비 중</p>
              <p className="text-xs text-[#6B7280] mt-0.5">
                현재는 요청/주문/채팅 핵심 플로우를 우선 연결하고 있어요.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Badges placeholder */}
      <div className="px-4 mb-4">
        <h2 className="font-medium text-[#111827] mb-2">획득 배지</h2>
        <BadgeRow badges={[]} maxVisible={10} />
        <p className="text-xs text-[#9CA3AF] mt-2">배지 데이터 연동 전</p>
      </div>

      {/* Sticky CTAs */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E5E7EB] pb-safe">
        <div className="flex gap-3">
          <Link href="/orders" className="flex-1">
            <SecondaryButton className="w-full h-12">
              <MessageCircle className="w-4 h-4 mr-2" />
              주문에서 채팅하기
            </SecondaryButton>
          </Link>

          <Link
            href={`/requests/new?preferredHelperId=${encodeURIComponent(helperId || "")}`}
            className="flex-1"
          >
            <PrimaryButton className="w-full h-12">지정 요청하기</PrimaryButton>
          </Link>
        </div>

        <p className="text-[11px] text-[#9CA3AF] mt-2 text-center">
          채팅은 주문이 생성된 후, 주문 상세 화면에서 시작할 수 있어요.
        </p>
      </div>
    </div>
  );
}
