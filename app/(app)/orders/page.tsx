"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, MoneyKRW, EmptyState, SecondaryButton } from "@/components/ui-kit";
import { ShoppingBag, Calendar, MapPin, RefreshCw } from "lucide-react";
import { useAppMode } from "@/components/providers/AppModeProvider";

type OrderRow = {
  id: string;
  request_id: string;
  customer_id: string | null;
  helper_id: string | null;
  status: string;
  amount: number;
  address_id: string | null;
  created_at: string;
  updated_at: string | null;
};

function safeDateLabel(iso: string) {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(
      2,
      "0"
    )} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  } catch {
    return iso;
  }
}

export default function OrdersPage() {
  const { mode } = useAppMode();
  const isHelper = mode === "helper";

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const load = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/orders", { method: "GET" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error?.message || `주문 목록 로드 실패 (${res.status})`);
      setOrders((json?.data ?? []) as OrderRow[]);
    } catch (e: any) {
      console.error(e);
      setOrders([]);
      setErrorMsg(e?.message || "주문 목록을 불러오지 못했어요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const list = useMemo(() => {
    // MVP: 서버에서 viewer role을 내려주는 게 베스트.
    // 지금은 mode별로 보여주는 의미만 살리기 위해 "전체 노출" 유지.
    return orders;
  }, [orders]);

  if (!loading && list.length === 0) {
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
              <SecondaryButton>{isHelper ? "요청 찾아보기" : "요청 보러가기"}</SecondaryButton>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="p-4 pb-2 flex items-center justify-between">
        <h2 className="text-sm font-medium text-[#6B7280]">
          {isHelper ? "이번 달 작업 내역" : "이번 달 주문 내역"}
        </h2>
        <SecondaryButton onClick={load} className="h-9" disabled={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          새로고침
        </SecondaryButton>
      </div>

      {errorMsg && (
        <div className="mx-4 mb-3 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-sm text-[#DC2626]">
          {errorMsg}
        </div>
      )}

      <div className="px-4 pb-4 space-y-3">
        {list.map((order) => {
          const uiDatetime = safeDateLabel(order.created_at);
          const uiLocation = "주소 연결 예정";
          const uiCategory = "서비스";

          return (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <div className="w-full max-w-full p-4 rounded-2xl border border-[#E5E7EB] bg-white hover:bg-[#F8FAFC] transition-colors overflow-hidden">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <StatusBadge status={(order.status === "accepted" ? "assigned" : order.status) as any} />
                  <Badge
                    variant="outline"
                    className="bg-[#F0FDF4] text-[#166534] border-[#BBF7D0] text-xs rounded-lg"
                  >
                    {uiCategory}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-sm text-[#6B7280] mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{uiDatetime}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span className="break-words">{uiLocation}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <MoneyKRW amount={order.amount} className="text-lg font-bold text-[#111827] tabular-nums" />
                  <span className="text-sm text-[#22C55E] shrink-0">상세 보기 →</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
