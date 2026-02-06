"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
import { MapPin, Calendar, MessageCircle, AlertTriangle, RefreshCw } from "lucide-react";

type OrderRow = {
  id: string;
  request_id: string;
  customer_id: string | null;
  helper_id: string | null;
  status:
    | "accepted"
    | "escrow_held"
    | "in_progress"
    | "done_by_helper"
    | "confirmed_by_customer"
    | "paid_out"
    | "disputed"
    | "cancelled";
  amount: number;
  address_id: string | null;
  created_at: string;
  updated_at: string | null;
};

type WorkEventRow = {
  id: string;
  order_id: string;
  actor_id: string | null;
  event_type: string;
  from_status: string | null;
  to_status: string | null;
  payload: any;
  created_at: string;
};

function safeKSTLabel(iso: string) {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
      d.getDate()
    ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  } catch {
    return iso;
  }
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ orderId: string }>();
  const orderId = params?.orderId;

  const [order, setOrder] = useState<OrderRow | null>(null);
  const [events, setEvents] = useState<WorkEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const load = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const [orderRes, evRes] = await Promise.all([
        fetch(`/api/orders/${orderId}`, { method: "GET" }),
        fetch(`/api/orders/${orderId}/work-events`, { method: "GET" }),
      ]);

      const orderJson = await orderRes.json().catch(() => ({}));
      if (!orderRes.ok) throw new Error(orderJson?.error?.message || `주문 로드 실패 (${orderRes.status})`);

      const evJson = await evRes.json().catch(() => ({}));
      const evData: WorkEventRow[] = evRes.ok ? (evJson?.data ?? []) : [];

      setOrder(orderJson.data as OrderRow);
      setEvents(evData);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e?.message || "주문 정보를 불러오지 못했어요.");
      setOrder(null);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  const timestamps = useMemo(() => {
    // OrderTimelineSection이 기대하는 키(assigned/escrow_held/...)는 프론트 데모 기준이었고,
    // DB는 accepted를 쓰므로, 여기서 accepted -> assigned로 매핑해서 UI를 살린다.
    const map: Record<string, string> = {};
    for (const ev of events) {
      if (!ev.to_status) continue;
      const k = ev.to_status === "accepted" ? "assigned" : ev.to_status;
      if (!map[k]) map[k] = safeKSTLabel(ev.created_at);
    }
    // 이벤트가 비어도 최소 created_at 정도는 넣어두기(깨짐 방지)
    if (order?.created_at && !map["assigned"]) map["assigned"] = safeKSTLabel(order.created_at);
    return map;
  }, [events, order]);

  // 24h auto confirm: done_by_helper 시점 기준이 베스트지만, MVP에선 "지금+24h"로 표기만 유지
  const autoConfirmDeadline = useMemo(() => {
    const d = new Date();
    d.setHours(d.getHours() + 24);
    return d;
  }, []);

  const showAutoConfirmCountdown = order?.status === "done_by_helper";

  // MVP: 고객/도우미 구분은 서버에서 viewer role을 내려주는 게 베스트.
  // 지금은 "버튼을 최대한 안전하게"만: 둘 다에 채팅/분쟁은 허용, 상태변경은 최소.
  const isCustomer = true;

  const patchStatus = async (to_status: OrderRow["status"], event_type = "status_change") => {
    if (!orderId) return;
    setBusy(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to_status, event_type }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error?.message || `상태 업데이트 실패 (${res.status})`);
      setOrder(json.data as OrderRow);
      // work-events도 갱신
      await load();
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e?.message || "상태 변경에 실패했어요.");
    } finally {
      setBusy(false);
    }
  };

  const goToChat = async () => {
    if (!orderId) return;
    setBusy(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/chat/threads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error?.message || `채팅방 생성 실패 (${res.status})`);
      const threadId = json?.data?.id;
      if (!threadId) throw new Error("threadId missing");
      router.push(`/chat/${threadId}`);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e?.message || "채팅방으로 이동할 수 없어요.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-full p-4">
        <p className="text-sm text-[#6B7280]">주문 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full max-w-full p-4 space-y-3">
        <p className="text-sm text-[#EF4444]">{errorMsg || "주문을 찾을 수 없어요."}</p>
        <div className="flex gap-2">
          <SecondaryButton onClick={() => load()} className="h-10">
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </SecondaryButton>
          <Link href="/orders">
            <SecondaryButton className="h-10">목록으로</SecondaryButton>
          </Link>
        </div>
      </div>
    );
  }

  // UI용 값(실제 request join/addresses join은 다음 단계에서)
  const uiCategory = "서비스";
  const uiDatetime = safeKSTLabel(order.created_at);
  const uiLocation = "주소 정보 연결 예정";
  const platformFee = 0;
  const totalPrice = order.amount + platformFee;

  return (
    <div
      className="w-full max-w-full"
      style={{ paddingBottom: "calc(var(--bottom-tabs-h) + var(--safe-bottom) + 120px)" }}
    >
      {errorMsg && (
        <div className="mx-4 mt-4 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-sm text-[#DC2626]">
          {errorMsg}
        </div>
      )}

      {/* Order Summary */}
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* StatusBadge는 프론트 상태명을 기대하므로 accepted -> assigned로 한번 변환 */}
          <StatusBadge status={(order.status === "accepted" ? "assigned" : order.status) as any} />
          <Badge
            variant="outline"
            className="bg-[#F0FDF4] text-[#166534] border-[#BBF7D0] text-xs rounded-lg"
          >
            {uiCategory}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-[#6B7280]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{uiDatetime}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="break-words">{uiLocation}</span>
          </div>
        </div>

        <p className="text-[#374151]">
          요청 상세(description)는 request 조인 후 표시됩니다. (MVP: 주문/채팅 흐름 우선)
        </p>

        {/* Price Breakdown */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-2 overflow-hidden">
          <div className="flex justify-between text-sm gap-2">
            <span className="text-[#6B7280] shrink-0">서비스 금액</span>
            <MoneyKRW amount={order.amount} className="text-[#111827] tabular-nums" />
          </div>
          <div className="flex justify-between text-sm gap-2">
            <span className="text-[#6B7280] shrink-0">플랫폼 수수료</span>
            <MoneyKRW amount={platformFee} className="text-[#111827] tabular-nums" />
          </div>
          <div className="border-t border-[#E5E7EB] pt-2 flex justify-between gap-2">
            <span className="font-medium text-[#111827] shrink-0">총 결제금액</span>
            <MoneyKRW amount={totalPrice} className="text-lg font-bold text-[#22C55E] tabular-nums" />
          </div>
        </div>
      </div>

      {/* Helper Info (MVP placeholder) */}
      <div className="px-4 mb-4">
        <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
          <h3 className="font-medium text-[#111827] mb-3">담당 도우미</h3>
          <div className="grid grid-cols-[48px_1fr_auto] items-center gap-3">
            <Avatar className="w-12 h-12 shrink-0">
              <AvatarImage src="/placeholder.svg" alt="도우미" />
              <AvatarFallback>도우</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium text-[#111827] truncate">
                {order.helper_id ? "도우미" : "미지정"}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <TierBadge tier={"BRONZE" as any} />
                <ScoreChip score={500 as any} />
              </div>
            </div>
            <Link href={order.helper_id ? `/helpers/${order.helper_id}` : "/helpers/helper_123"} className="shrink-0">
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
          currentStatus={(order.status === "accepted" ? "assigned" : order.status) as any}
          timestamps={timestamps as any}
        />
      </div>

      {/* Bottom CTA */}
      <BottomCTA>
        <div className="space-y-2">
          {isCustomer ? (
            <>
              {/* 결제는 Toss 마지막이므로 일단 버튼 비활성/안내 */}
              {(order.status === "accepted" || order.status === "escrow_held") && (
                <Link href={`/orders/${order.id}/checkout`}>
                  <PrimaryButton className="w-full h-12" disabled={busy}>
                    결제하기(추후)
                  </PrimaryButton>
                </Link>
              )}

              {order.status === "done_by_helper" && (
                <div className="flex gap-3">
                  <Link href={`/orders/${order.id}/dispute`} className="flex-1 min-w-0">
                    <SecondaryButton className="w-full h-12 text-[#EF4444] border-[#EF4444] hover:bg-[#FEF2F2]">
                      <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />
                      <span className="truncate">분쟁 접수</span>
                    </SecondaryButton>
                  </Link>

                  <PrimaryButton
                    className="flex-1 min-w-0 h-12"
                    disabled={busy}
                    onClick={() => patchStatus("confirmed_by_customer", "customer_confirm")}
                  >
                    <span className="truncate">완료 확인</span>
                  </PrimaryButton>
                </div>
              )}

              <SecondaryButton className="w-full h-12" onClick={goToChat} disabled={busy}>
                <MessageCircle className="w-4 h-4 mr-2 shrink-0" />
                채팅하기
              </SecondaryButton>
            </>
          ) : (
            <>
              {order.status === "escrow_held" && (
                <PrimaryButton className="w-full h-12" disabled={busy} onClick={() => patchStatus("in_progress", "start_work")}>
                  작업 시작
                </PrimaryButton>
              )}
              {order.status === "in_progress" && (
                <PrimaryButton className="w-full h-12" disabled={busy} onClick={() => patchStatus("done_by_helper", "done_work")}>
                  작업 완료
                </PrimaryButton>
              )}

              <SecondaryButton className="w-full h-12" onClick={goToChat} disabled={busy}>
                <MessageCircle className="w-4 h-4 mr-2 shrink-0" />
                채팅하기
              </SecondaryButton>
            </>
          )}
        </div>
      </BottomCTA>
    </div>
  );
}
