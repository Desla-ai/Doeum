"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  EmptyState,
  type HelperBadge,
} from "@/components/ui-kit";
import { BottomCTA } from "@/components/shell/BottomCTA";
import { RequestNotFound } from "@/components/requests/RequestNotFound";
import { useAppMode } from "@/components/providers/AppModeProvider";
import { MapPin, Calendar, MessageCircle, Check, X, FileText, AlertCircle, RefreshCw } from "lucide-react";

type RequestRow = {
  id: string;
  customer_id: string;
  category: string;
  description: string;
  price: number;
  scheduled_at: string | null;
  region_sigungu: string;
  region_dong: string;
  address_id: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type ProposalRow = {
  id: string;
  request_id: string;
  helper_id: string;
  message: string;
  proposed_price: number | null;
  status: string;
  created_at: string;
  updated_at: string;
};

// UI용 Proposal
interface ProposalUI {
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

function formatKST(iso: string) {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(
      d.getHours()
    ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  } catch {
    return iso;
  }
}

export default function RequestDetailPage() {
  const router = useRouter();
  const params = useParams<{ requestId: string }>();
  const searchParams = useSearchParams();
  const requestId = params.requestId;
  const applyMode = searchParams.get("apply") === "1";

  const { isCustomer, isHelper } = useAppMode();

  const [request, setRequest] = useState<RequestRow | null>(null);
  const [proposals, setProposals] = useState<ProposalRow[]>([]);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [applyPrice, setApplyPrice] = useState("");
  const [applyError, setApplyError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/requests/${requestId}`, { method: "GET" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error?.message || `요청 로드 실패 (${res.status})`);
      setRequest(json?.data?.request as RequestRow);
      setProposals((json?.data?.proposals ?? []) as ProposalRow[]);
    } catch (e: any) {
      console.error(e);
      setRequest(null);
      setProposals([]);
      setErrorMsg(e?.message || "요청을 불러오지 못했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  useEffect(() => {
    if (applyMode && isHelper && !isLoading && request) {
      setIsApplyDialogOpen(true);
    }
  }, [applyMode, isHelper, isLoading, request]);

  const proposalUiList: ProposalUI[] = useMemo(() => {
    // profiles join이 없으니 helperName은 임시
    return proposals.map((p) => ({
      id: p.id,
      helperId: p.helper_id,
      helperName: "도우미",
      tier: "BRONZE",
      matchingScore: 500,
      badges: [],
      message: p.message,
      proposedPrice: p.proposed_price ?? undefined,
      createdAt: formatKST(p.created_at),
    }));
  }, [proposals]);

  const handlePriceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setApplyPrice(numericValue);
  };

  const formatPriceDisplay = (value: string) => {
    if (!value) return "";
    return Number(value).toLocaleString();
  };

  const handleSubmitApplication = async () => {
    setApplyError("");
    if (!applyMessage.trim() || applyMessage.trim().length < 5) {
      setApplyError("메시지는 최소 5자 이상 입력해주세요.");
      return;
    }
    const priceNum = applyPrice ? Number(applyPrice) : undefined;
    if (priceNum !== undefined && priceNum < 1000) {
      setApplyError("금액은 최소 1,000원 이상이어야 합니다.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(`/api/requests/${requestId}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: applyMessage.trim(),
          proposed_price: priceNum ?? null,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error?.message || `지원 실패 (${res.status})`);

      // 성공하면 다시 로드(정합성)
      await load();

      setApplyMessage("");
      setApplyPrice("");
      setIsApplyDialogOpen(false);
      setHasSubmitted(true);
    } catch (e: any) {
      console.error(e);
      setApplyError(e?.message || "지원에 실패했어요.");
    } finally {
      setBusy(false);
    }
  };

  const selectProposal = async (proposalId: string) => {
    setBusy(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/requests/${requestId}/select-proposal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposal_id: proposalId }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || json?.error?.message || `도우미 선택 실패 (${res.status})`);

      const orderId: string | undefined = json?.data?.order?.id;
      if (!orderId) throw new Error("order id missing in response");

      // 주문 상세로 이동 (여기서부터 '주문 기반 채팅' 버튼이 동작)
      router.push(`/orders/${orderId}`);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e?.message || "도우미 선택에 실패했어요.");
    } finally {
      setBusy(false);
    }
  };


  if (isLoading) {
    return (
      <div className="w-full max-w-full p-4 text-center">
        <p className="text-[#6B7280]">요청 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="w-full max-w-full p-4 space-y-3">
        {errorMsg ? (
          <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-sm text-[#DC2626]">
            {errorMsg}
          </div>
        ) : (
          <RequestNotFound />
        )}

        <div className="flex gap-2">
          <SecondaryButton onClick={load} className="h-10">
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </SecondaryButton>
          <Link href="/requests">
            <SecondaryButton className="h-10">목록으로</SecondaryButton>
          </Link>
        </div>
      </div>
    );
  }

  const dt = request.scheduled_at ? new Date(request.scheduled_at) : new Date(request.created_at);
  const datetime = `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, "0")}.${String(dt.getDate()).padStart(
    2,
    "0"
  )}`;
  const time = `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
  const location = `${request.region_sigungu} ${request.region_dong}`.trim() || request.region_sigungu;

  return (
    <div
      className="w-full max-w-full"
      style={{ paddingBottom: "calc(var(--bottom-tabs-h) + var(--safe-bottom) + 80px)" }}
    >
      {hasSubmitted && isHelper && (
        <div className="mx-4 mt-4 p-4 rounded-2xl border-2 border-[#22C55E] bg-[#F0FDF4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#22C55E] flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-[#166534]">지원이 완료되었어요!</p>
              <p className="text-sm text-[#15803D]">고객이 확인하면 연락이 갈 거예요</p>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mx-4 mt-4 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-sm text-[#DC2626]">
          {errorMsg}
        </div>
      )}

      {/* Request Summary */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <StatusBadge status={request.status as any} />
          <Badge
            variant="outline"
            className="bg-[#F0FDF4] text-[#166534] border-[#BBF7D0] text-xs rounded-lg"
          >
            {request.category}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-[#6B7280]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>
              {datetime} {time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB]">
          <MoneyKRW amount={request.price} className="text-2xl font-bold text-[#111827]" />
          <span className="text-sm text-[#6B7280] ml-1">/건당</span>
        </div>

        {request.description && <p className="text-[#374151] leading-relaxed">{request.description}</p>}

        {/* Photos (현재 서버 저장 안 하므로 표시만 유지하지 않음) */}
      </div>

      {/* Customer View: Proposals List */}
      {isCustomer && proposalUiList.length > 0 && (
        <div className="p-4 space-y-3">
          <h2 className="font-medium text-[#111827]">지원한 도우미 ({proposalUiList.length})</h2>

          {proposalUiList.map((proposal) => (
            <div key={proposal.id} className="p-4 rounded-2xl border border-[#E5E7EB] bg-white">
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12 shrink-0">
                  <AvatarImage src={proposal.helperAvatar || "/placeholder.svg"} alt={proposal.helperName} />
                  <AvatarFallback>{proposal.helperName.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#111827]">{proposal.helperName}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <TierBadge tier={proposal.tier as any} />
                    <ScoreChip score={proposal.matchingScore as any} />
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
                <p className="text-xs text-[#9CA3AF] mt-1">{proposal.createdAt}</p>
              </div>

              <div className="flex gap-2 mt-4">
                {/* 채팅은 주문 생성 후 */}
                <SecondaryButton className="w-full flex-1" disabled>
                  <MessageCircle className="w-4 h-4 mr-1" />
                  채팅(주문 후 가능)
                </SecondaryButton>

                <PrimaryButton className="w-full flex-1" disabled={busy} onClick={() => selectProposal(proposal.id)}>
                  이 도우미 선택
                </PrimaryButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {isCustomer && proposalUiList.length === 0 && (
        <div className="p-4">
          <EmptyState
            icon={<MessageCircle className="w-8 h-8" />}
            title="아직 지원한 도우미가 없어요"
            description="조금만 기다리면 도우미들이 지원할 거예요."
          />
        </div>
      )}

      {/* Apply Dialog for Helpers */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-32px)] rounded-2xl">
          <DialogHeader>
            <DialogTitle>지원하기</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {applyError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA]">
                <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
                <p className="text-sm text-[#DC2626]">{applyError}</p>
              </div>
            )}

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
              <p className="text-xs text-[#6B7280]">최소 5자 이상 ({applyMessage.length}자)</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#111827]">금액 역제안 (선택)</label>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={formatPriceDisplay(applyPrice)}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="예: 55,000"
                  className="pr-12 rounded-xl"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">원</span>
              </div>
              <p className="text-xs text-[#6B7280]">
                요청 금액: {request.price.toLocaleString()}원 · 비워두면 요청 금액으로 지원됩니다
              </p>
            </div>

            <PrimaryButton onClick={handleSubmitApplication} className="w-full h-12" disabled={busy}>
              지원서 보내기
            </PrimaryButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom CTA */}
      <BottomCTA>
        {isHelper && !hasSubmitted ? (
          <div className="flex gap-3">
            <Link href="/requests" className="flex-1">
              <SecondaryButton className="w-full h-12">
                <FileText className="w-4 h-4 mr-2" />
                목록
              </SecondaryButton>
            </Link>
            <PrimaryButton onClick={() => setIsApplyDialogOpen(true)} className="flex-1 h-12">
              지원서 보내기
            </PrimaryButton>
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
