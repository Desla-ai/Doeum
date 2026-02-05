"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  StatusBadge,
  MoneyKRW,
  TierBadge,
  ScoreChip,
  BadgeRow,
  PrimaryButton,
  SecondaryButton,
  type HelperBadge,
} from "@/components/ui-kit";
import { BottomCTA } from "@/components/shell/BottomCTA";
import { RequestNotFound } from "@/components/requests/RequestNotFound";
import { useAppMode } from "@/components/providers/AppModeProvider";
import { type RequestData, isValidRequestData } from "@/lib/types/request";
import { MapPin, Calendar, MessageCircle, Check, X, FileText, AlertCircle } from "lucide-react";

const defaultMockRequest: RequestData = {
  id: "req_123",
  category: "청소",
  status: "posted",
  datetime: "2024.02.15",
  time: "오전 10:00",
  location: "서울 강남구 역삼동 테헤란로 152",
  region: "서울 강남구",
  price: 50000,
  description:
    "원룸 청소 부탁드려요. 화장실, 주방 포함입니다. 약 20평 정도이고, 베란다도 같이 해주시면 감사하겠습니다.",
  photos: ["/placeholder.svg?height=200&width=200"],
  preferredHelper: {
    id: "helper_123",
    name: "김영희",
    tier: "GOLD",
    matchingScore: 920,
  },
};

interface Proposal {
  id: string;
  helperId: string;
  helperName: string;
  helperAvatar?: string;
  tier: string;
  matchingScore: number;
  badges: HelperBadge[];
  message: string;
  proposedPrice?: number;
  createdAt: string;
}

const initialMockProposals: Proposal[] = [
  {
    id: "prop_1",
    helperId: "helper_124",
    helperName: "이철수",
    tier: "PLATINUM",
    matchingScore: 880,
    badges: [
      { id: "b1", label: "프로도우미" },
      { id: "b2", label: "성실왕" },
    ],
    message: "안녕하세요! 청소 경력 5년입니다. 꼼꼼하게 해드릴게요.",
    createdAt: "방금 전",
  },
  {
    id: "prop_2",
    helperId: "helper_125",
    helperName: "박지민",
    tier: "DIAMOND",
    matchingScore: 950,
    badges: [
      { id: "b1", label: "최다완료" },
      { id: "b2", label: "응답왕" },
      { id: "b3", label: "성실왕" },
      { id: "b4", label: "친절왕" },
    ],
    message: "친절하고 꼼꼼한 청소 전문가입니다. 만족하실 거예요!",
    proposedPrice: 55000,
    createdAt: "5분 전",
  },
];

// Mock current helper info (for demo submissions)
const mockMyHelperInfo = {
  id: "helper_me",
  name: "홍길동",
  tier: "GOLD",
  matchingScore: 920,
  badges: [
    { id: "b1", label: "응답왕" },
    { id: "b2", label: "단골왕" },
  ],
};

export default function RequestDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const requestId = params.requestId as string;
  const applyMode = searchParams.get("apply") === "1";

  const { isCustomer, isHelper } = useAppMode();

  const [request, setRequest] = useState<RequestData | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>(initialMockProposals);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [applyPrice, setApplyPrice] = useState("");
  const [applyError, setApplyError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isNewlyCreated, setIsNewlyCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Open apply dialog on entry if ?apply=1 and helper mode
  useEffect(() => {
    if (applyMode && isHelper && !isLoading && request) {
      setIsApplyDialogOpen(true);
    }
  }, [applyMode, isHelper, isLoading, request]);

  // Load request data
  useEffect(() => {
    setIsLoading(true);

    try {
      const rawData = localStorage.getItem("mock_requests");
      const storedRequests = JSON.parse(rawData || "[]");

      const foundRequest = storedRequests.find(
        (r: Record<string, unknown>) => r.id === requestId
      );

      if (foundRequest && isValidRequestData(foundRequest)) {
        setRequest(foundRequest);
        setIsNewlyCreated(true);
        setIsLoading(false);
        return;
      }
    } catch {
      // Ignore localStorage errors
    }

    if (requestId === "req_123") {
      setRequest(defaultMockRequest);
    }

    setIsLoading(false);
  }, [requestId]);

  // Format price input (numbers only, with comma formatting display)
  const handlePriceChange = (value: string) => {
    // Remove non-digits
    const numericValue = value.replace(/[^0-9]/g, "");
    setApplyPrice(numericValue);
  };

  // Format number with commas for display
  const formatPriceDisplay = (value: string) => {
    if (!value) return "";
    return Number(value).toLocaleString();
  };

  // Submit application
  const handleSubmitApplication = () => {
    setApplyError("");

    // Validate message (required, min 5 chars)
    if (!applyMessage.trim() || applyMessage.trim().length < 5) {
      setApplyError("메시지는 최소 5자 이상 입력해주세요.");
      return;
    }

    // Validate price if provided (min 1000)
    const priceNum = applyPrice ? Number(applyPrice) : undefined;
    if (priceNum !== undefined && priceNum < 1000) {
      setApplyError("금액은 최소 1,000원 이상이어야 합니다.");
      return;
    }

    // Create new proposal
    const newProposal: Proposal = {
      id: `prop_${Date.now()}`,
      helperId: mockMyHelperInfo.id,
      helperName: mockMyHelperInfo.name,
      tier: mockMyHelperInfo.tier,
      matchingScore: mockMyHelperInfo.matchingScore,
      badges: mockMyHelperInfo.badges,
      message: applyMessage.trim(),
      proposedPrice: priceNum,
      createdAt: "방금 전",
    };

    // Add to proposals list
    setProposals((prev) => [newProposal, ...prev]);

    // Reset form and close dialog
    setApplyMessage("");
    setApplyPrice("");
    setIsApplyDialogOpen(false);
    setHasSubmitted(true);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-full p-4 text-center">
        <p className="text-[#6B7280]">요청 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!request) {
    return <RequestNotFound />;
  }

  return (
    <div
      className="w-full max-w-full"
      style={{
        paddingBottom: "calc(var(--bottom-tabs-h) + var(--safe-bottom) + 80px)",
      }}
    >
      {/* Success Banner after submission */}
      {hasSubmitted && isHelper && (
        <div className="mx-4 mt-4 p-4 rounded-2xl border-2 border-[#22C55E] bg-[#F0FDF4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#22C55E] flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-[#166534]">지원이 완료되었어요!</p>
              <p className="text-sm text-[#15803D]">
                고객이 확인하면 연락이 갈 거예요
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Request Summary */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <StatusBadge status={request.status} />
          <Badge
            variant="outline"
            className="bg-[#F0FDF4] text-[#166534] border-[#BBF7D0] text-xs rounded-lg"
          >
            {request.category}
          </Badge>
          {isNewlyCreated && (
            <Badge className="bg-[#22C55E] text-white text-xs">새 요청</Badge>
          )}
        </div>

        <div className="space-y-2 text-sm text-[#6B7280]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>
              {request.datetime} {request.time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{request.location}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB]">
          <MoneyKRW
            amount={request.price}
            className="text-2xl font-bold text-[#111827]"
          />
          <span className="text-sm text-[#6B7280] ml-1">/건당</span>
        </div>

        {request.description && (
          <p className="text-[#374151] leading-relaxed">{request.description}</p>
        )}

        {/* Photos */}
        {request.photos && request.photos.length > 0 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {request.photos.map((photo, index) => (
              <div
                key={index}
                className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-[#E5E7EB]"
              >
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Direct Request Banner - Customer view only, with preferred helper */}
      {isCustomer && request.preferredHelper && !isNewlyCreated && (
        <div className="mx-4 p-4 rounded-2xl border-2 border-[#22C55E] bg-[#F0FDF4]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-[#166534]">지정 요청</span>
            <Badge className="bg-[#22C55E] text-white">대기중</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src="/placeholder.svg"
                alt={request.preferredHelper.name}
              />
              <AvatarFallback>
                {request.preferredHelper.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#111827]">
                {request.preferredHelper.name}
              </p>
              <div className="flex items-center gap-2">
                <TierBadge tier={request.preferredHelper.tier} />
                <ScoreChip score={request.preferredHelper.matchingScore} />
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <SecondaryButton className="flex-1">
              <X className="w-4 h-4 mr-1" />
              거절
            </SecondaryButton>
            <Link href="/orders/order_123" className="flex-1">
              <PrimaryButton className="w-full">
                <Check className="w-4 h-4 mr-1" />
                수락
              </PrimaryButton>
            </Link>
          </div>
        </div>
      )}

      {/* Customer View: Proposals List */}
      {isCustomer && !isNewlyCreated && proposals.length > 0 && (
        <div className="p-4 space-y-3">
          <h2 className="font-medium text-[#111827]">
            지원한 도우미 ({proposals.length})
          </h2>

          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="p-4 rounded-2xl border border-[#E5E7EB] bg-white"
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12 shrink-0">
                  <AvatarImage
                    src={proposal.helperAvatar || "/placeholder.svg"}
                    alt={proposal.helperName}
                  />
                  <AvatarFallback>
                    {proposal.helperName.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#111827]">
                    {proposal.helperName}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <TierBadge tier={proposal.tier} />
                    <ScoreChip score={proposal.matchingScore} />
                  </div>
                  <BadgeRow badges={proposal.badges} maxVisible={2} />
                </div>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-[#F8FAFC]">
                <p className="text-sm text-[#374151]">{proposal.message}</p>
                {proposal.proposedPrice && (
                  <p className="text-sm text-[#111827] font-medium mt-2">
                    제안 금액: <MoneyKRW amount={proposal.proposedPrice} />
                  </p>
                )}
                <p className="text-xs text-[#9CA3AF] mt-1">
                  {proposal.createdAt}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <Link
                  href={`/chat/thread_${proposal.helperId}`}
                  className="flex-1"
                >
                  <SecondaryButton className="w-full">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    채팅
                  </SecondaryButton>
                </Link>
                <Link href="/orders/order_123" className="flex-1">
                  <PrimaryButton className="w-full">
                    이 도우미 선택
                  </PrimaryButton>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Dialog for Helpers */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-32px)] rounded-2xl">
          <DialogHeader>
            <DialogTitle>지원하기</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Error message */}
            {applyError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA]">
                <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
                <p className="text-sm text-[#DC2626]">{applyError}</p>
              </div>
            )}

            {/* Message field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#111827]">
                지원 메시지 <span className="text-[#DC2626]">*</span>
              </label>
              <Textarea
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                placeholder="간단히 소개와 작업 방식, 가능 시간을 적어주세요."
                className="min-h-24 rounded-xl"
              />
              <p className="text-xs text-[#6B7280]">
                최소 5자 이상 ({applyMessage.length}자)
              </p>
            </div>

            {/* Price field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#111827]">
                금액 역제안 (선택)
              </label>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={formatPriceDisplay(applyPrice)}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="예: 55,000"
                  className="pr-12 rounded-xl"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                  원
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">
                요청 금액: {request.price.toLocaleString()}원 · 비워두면 요청
                금액으로 지원됩니다
              </p>
            </div>

            <PrimaryButton
              onClick={handleSubmitApplication}
              className="w-full h-12"
            >
              지원서 보내기
            </PrimaryButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom CTA */}
      <BottomCTA>
        {isCustomer && isNewlyCreated ? (
          <div className="flex gap-3">
            <Link href="/requests" className="flex-1">
              <SecondaryButton className="w-full h-12">
                <FileText className="w-4 h-4 mr-2" />
                목록으로
              </SecondaryButton>
            </Link>
            <Link href="/orders" className="flex-1">
              <PrimaryButton className="w-full h-12">내역 보기</PrimaryButton>
            </Link>
          </div>
        ) : isHelper && !hasSubmitted ? (
          <div className="flex gap-3">
            <Link href="/requests" className="flex-1">
              <SecondaryButton className="w-full h-12">
                <FileText className="w-4 h-4 mr-2" />
                목록
              </SecondaryButton>
            </Link>
            <PrimaryButton
              onClick={() => setIsApplyDialogOpen(true)}
              className="flex-1 h-12"
            >
              지원서 보내기
            </PrimaryButton>
          </div>
        ) : isHelper && hasSubmitted ? (
          <div className="flex gap-3">
            <Link href="/requests" className="flex-1">
              <SecondaryButton className="w-full h-12">
                다른 요청 보기
              </SecondaryButton>
            </Link>
            <Link href="/orders" className="flex-1">
              <PrimaryButton className="w-full h-12">내 지원 현황</PrimaryButton>
            </Link>
          </div>
        ) : (
          <Link href="/requests" className="w-full">
            <SecondaryButton className="w-full h-12">
              <FileText className="w-4 h-4 mr-2" />
              목록으로
            </SecondaryButton>
          </Link>
        )}
      </BottomCTA>
    </div>
  );
}
