"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAppMode } from "@/components/providers/AppModeProvider";
import { RequestCard } from "@/components/requests/RequestCard";
import { PrimaryButton, SecondaryButton, EmptyState } from "@/components/ui-kit";
import { Plus, RefreshCw, FileText } from "lucide-react";

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

// RequestCard가 기대하는 형태로 최소 변환
function toRequestCardData(r: RequestRow) {
  const dt = r.scheduled_at ? new Date(r.scheduled_at) : new Date(r.created_at);
  const date = `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, "0")}.${String(dt.getDate()).padStart(2, "0")}`;
  const time = `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;

  return {
    id: r.id,
    category: r.category,
    status: r.status as any,
    datetime: date,
    time,
    location: `${r.region_sigungu} ${r.region_dong}`.trim(),
    region: r.region_sigungu,
    price: r.price,
    description: r.description,
  };
}

export default function RequestsPage() {
  const { isCustomer, isHelper } = useAppMode();
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const load = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/requests", { method: "GET" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error?.message || `요청 목록 로드 실패 (${res.status})`);
      setRows((json?.data ?? []) as RequestRow[]);
    } catch (e: any) {
      console.error(e);
      setRows([]);
      setErrorMsg(e?.message || "요청 목록을 불러오지 못했어요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const requestCards = useMemo(() => rows.map(toRequestCardData), [rows]);

  if (!loading && requestCards.length === 0) {
    return (
      <div className="w-full max-w-full p-4">
        <EmptyState
          icon={<FileText className="w-8 h-8" />}
          title="요청이 없어요"
          description="요청을 올리면 여기에 표시됩니다."
          action={
            <Link href="/requests/new">
              <SecondaryButton>요청 올리기</SecondaryButton>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-[#6B7280]">
          {isHelper ? "요청 피드" : "내 요청"}
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

      {/* MVP: helper/customer 모두 일단 서버에서 접근 가능한 요청 리스트를 표시 */}
      <div className="p-4 space-y-3">
        {requestCards.map((request: any) => (
          <RequestCard key={request.id} request={request} isHelper={isHelper} />
        ))}
      </div>

      {/* Floating CTA */}
      {isCustomer && (
        <Link href="/requests/new" className="fixed bottom-24 right-4 z-50">
          <PrimaryButton className="h-14 px-5 rounded-full shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            요청 올리기
          </PrimaryButton>
        </Link>
      )}
    </div>
  );
}
