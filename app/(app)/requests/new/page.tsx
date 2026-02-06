"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { PrimaryButton, TierBadge, ScoreChip, SecondaryButton, EmptyState } from "@/components/ui-kit";
import { BottomCTA } from "@/components/shell/BottomCTA";
import { useAppMode } from "@/components/providers/AppModeProvider";
import {
  MapPin,
  Calendar,
  Clock,
  ImagePlus,
  X,
  Search,
  Check,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const categories = [
  { id: "cleaning", label: "청소" },
  { id: "laundry", label: "빨래" },
  { id: "cooking", label: "요리" },
  { id: "organizing", label: "정리" },
  { id: "other", label: "기타" },
];

const mockPreferredHelper = {
  id: "helper_123",
  name: "김영희",
  tier: "GOLD" as const,
  matchingScore: 920,
};

// Helper mode banner
function HelperModeBanner({ onSwitchMode }: { onSwitchMode: () => void }) {
  return (
    <div className="m-4 p-4 rounded-2xl border-2 border-[#F59E0B] bg-[#FFFBEB]">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[#92400E] mb-1">고객 모드에서 요청을 올릴 수 있어요</h3>
          <p className="text-sm text-[#B45309] mb-3">
            현재 도우미 모드입니다. 요청을 올리려면 고객 모드로 전환해주세요.
          </p>
          <PrimaryButton onClick={onSwitchMode} className="h-9 px-4 text-sm">
            고객으로 전환
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function splitRegionMinimal(regionSigungu: string, regionDong: string) {
  return { region_sigungu: regionSigungu || "", region_dong: regionDong || "" };
}

type AddressRow = {
  id: string;
  user_id: string;
  region_sigungu: string;
  region_dong: string;
  address_line: string;
  address_detail: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
};

type SelectedAddress = {
  // UI/submit에서 공통으로 쓰기 위한 형태
  id?: string; // 있으면 기존 주소
  road: string;
  jibun: string; // 현재 AddressRow에 지번이 없으니 "표시용"으로 빈 문자열 유지
  detail: string;
  region_sigungu: string;
  region_dong: string;
  lat: number | null;
  lng: number | null;
};

export default function NewRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isHelper, setMode } = useAppMode();
  const preferredHelperId = searchParams.get("preferredHelperId");

  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  // ✅ 최종적으로 요청 제출에 쓰는 주소 상태(연동 대상)
  const [address, setAddress] = useState<SelectedAddress | null>(null);

  // Address modal
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressSearch, setAddressSearch] = useState("");

  const [addrRows, setAddrRows] = useState<AddressRow[]>([]);
  const [addrLoading, setAddrLoading] = useState(false);
  const [addrError, setAddrError] = useState<string | null>(null);

  const [selectedRow, setSelectedRow] = useState<AddressRow | null>(null);
  const [detailAddress, setDetailAddress] = useState("");

  const [isDirectRequest, setIsDirectRequest] = useState(!!preferredHelperId);
  const [consentChecked, setConsentChecked] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const showHelperBanner = isHelper;

  const canSubmit = useMemo(() => {
    return (
      !isHelper &&
      !!category &&
      !!date &&
      !!time &&
      !!address &&
      !!price &&
      Number(price) > 0 &&
      consentChecked
    );
  }, [isHelper, category, date, time, address, price, consentChecked]);

  const handlePhotoAdd = () => {
    if (photos.length < 5) {
      setPhotos((prev) => [
        ...prev,
        `/placeholder.svg?height=200&width=200&text=Photo${prev.length + 1}`,
      ]);
    }
  };

  const handlePhotoRemove = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const loadAddresses = async () => {
    setAddrLoading(true);
    setAddrError(null);
    try {
      const res = await fetch("/api/addresses", { method: "GET" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error?.message || json?.error || `주소 목록 로드 실패 (${res.status})`);
      setAddrRows((json?.data ?? []) as AddressRow[]);
    } catch (e: any) {
      console.error(e);
      setAddrRows([]);
      setAddrError(e?.message || "주소 목록을 불러오지 못했어요.");
    } finally {
      setAddrLoading(false);
    }
  };

  // 모달 열릴 때 주소록 로드
  useEffect(() => {
    if (!isAddressModalOpen) return;

    // 모달 오픈 시 초기화
    setAddressSearch("");
    setSelectedRow(null);
    setDetailAddress(address?.detail || "");

    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddressModalOpen]);

  const filteredAddrRows = useMemo(() => {
    const q = addressSearch.trim();
    if (!q) return addrRows;
    return addrRows.filter((r) => {
      const a = `${r.region_sigungu} ${r.region_dong} ${r.address_line} ${r.address_detail ?? ""}`.toLowerCase();
      return a.includes(q.toLowerCase());
    });
  }, [addrRows, addressSearch]);

  const validateForm = (): boolean => {
    const errors: string[] = [];
    if (!category) errors.push("카테고리를 선택해주세요");
    if (!date) errors.push("날짜를 선택해주세요");
    if (!time) errors.push("시간을 선택해주세요");
    if (!address) errors.push("주소를 입력해주세요");
    if (!price || Number(price) <= 0) errors.push("금액을 입력해주세요");
    if (!consentChecked) errors.push("취소/분쟁 정책에 동의해주세요");
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleAddressSave = () => {
    if (!selectedRow) return;

    setAddress({
      id: selectedRow.id, // ✅ 기존 주소를 그대로 사용
      road: selectedRow.address_line,
      jibun: "", // 현재 AddressRow에 없음 (추후 DB에 jibun 컬럼 생기면 매핑 가능)
      detail: detailAddress,
      region_sigungu: selectedRow.region_sigungu,
      region_dong: selectedRow.region_dong,
      lat: selectedRow.lat ?? null,
      lng: selectedRow.lng ?? null,
    });

    setIsAddressModalOpen(false);
    setSelectedRow(null);
  };

  const handleSubmit = async () => {
    if (isHelper) {
      setValidationErrors(["고객 모드에서만 요청을 올릴 수 있어요. 상단에서 고객으로 전환해주세요."]);
      return;
    }

    if (!validateForm() || !address) return;

    setIsSubmitting(true);
    setValidationErrors([]);

    try {
      // ✅ 1) address_id 결정: 이미 선택한 주소(id 있음)이면 그대로 사용
      let address_id: string | null = address.id ?? null;

      const { region_sigungu, region_dong } = splitRegionMinimal(address.region_sigungu, address.region_dong);

      // (선택) 만약 id가 없는 주소 입력 플로우가 생긴다면 fallback으로 주소 생성
      if (!address_id) {
        const addrRes = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            region_sigungu,
            region_dong,
            address_line: address.road,
            address_detail: address.detail || "",
            lat: address.lat,
            lng: address.lng,
          }),
        });

        const addrJson = await addrRes.json().catch(() => ({}));
        if (!addrRes.ok) throw new Error(addrJson?.error?.message || `주소 저장 실패 (${addrRes.status})`);

        address_id = addrJson?.data?.id;
        if (!address_id) throw new Error("address_id missing");
      }

      // ✅ 2) 요청 생성
      const scheduled_at = `${date}T${time}:00+09:00`; // 단순 KST 구성
      const catLabel = categories.find((c) => c.id === category)?.label || category;

      const reqRes = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: catLabel,
          description: notes || "",
          price: Number(price),
          scheduled_at,
          region_sigungu,
          region_dong,
          address_id,
        }),
      });

      const reqJson = await reqRes.json().catch(() => ({}));
      if (!reqRes.ok) throw new Error(reqJson?.error?.message || `요청 생성 실패 (${reqRes.status})`);

      const requestId = reqJson?.data?.id;
      if (!requestId) throw new Error("requestId missing");

      router.push(`/requests/${requestId}`);
    } catch (e: any) {
      console.error(e);
      setValidationErrors([e?.message || "요청 등록에 실패했어요."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="w-full max-w-full"
      style={{ paddingBottom: "calc(var(--bottom-tabs-h) + var(--safe-bottom) + 80px)" }}
    >
      {/* Helper Mode Banner */}
      {showHelperBanner && <HelperModeBanner onSwitchMode={() => setMode("customer")} />}

      <div className={`p-4 space-y-6 ${showHelperBanner ? "opacity-60" : ""}`}>
        {/* Preferred Helper Block (UI only) */}
        {preferredHelperId && (
          <div className="p-4 rounded-2xl border-2 border-[#22C55E] bg-[#F0FDF4]">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-[#166534]">지정 요청</span>
              <Switch
                checked={isDirectRequest}
                onCheckedChange={setIsDirectRequest}
                className="data-[state=checked]:bg-[#22C55E]"
              />
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder.svg" alt={mockPreferredHelper.name} />
                <AvatarFallback>{mockPreferredHelper.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-[#111827]">{mockPreferredHelper.name}</p>
                <div className="flex items-center gap-2">
                  <TierBadge tier={mockPreferredHelper.tier as any} />
                  <ScoreChip score={mockPreferredHelper.matchingScore as any} />
                </div>
              </div>
            </div>
            <p className="text-xs text-[#6B7280] mt-2">이 도우미에게 지정 요청하기</p>
          </div>
        )}

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111827]">카테고리</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  category === cat.id
                    ? "bg-[#22C55E] text-white"
                    : "bg-[#F8FAFC] text-[#374151] border border-[#E5E7EB] hover:bg-[#F1F5F9]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#111827]">날짜</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10 rounded-xl border-[#E5E7EB]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#111827]">시간</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-10 rounded-xl border-[#E5E7EB]"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111827]">주소</Label>

          {address ? (
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#111827] truncate">{address.road}</p>
                  {address.region_sigungu || address.region_dong ? (
                    <p className="text-xs text-[#6B7280] mt-0.5 truncate">
                      {address.region_sigungu} {address.region_dong}
                    </p>
                  ) : null}
                  {address.detail ? <p className="text-xs text-[#6B7280] truncate">{address.detail}</p> : null}
                </div>

                <Badge
                  variant="outline"
                  className="bg-white text-[#374151] border-[#E5E7EB] text-xs shrink-0 ml-2"
                >
                  {address.region_sigungu || "내 주소"}
                </Badge>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddressModalOpen(true)}
                className="mt-2 text-[#6B7280] hover:text-[#111827]"
              >
                <MapPin className="w-3 h-3 mr-1" />
                변경하기
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsAddressModalOpen(true)}
              className="w-full h-12 rounded-xl border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8FAFC]"
            >
              <MapPin className="w-4 h-4 mr-2" />
              내 주소에서 선택
            </Button>
          )}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111827]">금액</Label>
          <div className="relative">
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="50000"
              className="pr-16 rounded-xl border-[#E5E7EB]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">원/건당</span>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111827]">상세 설명</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="작업 범위/준비물/주의사항 등을 적어주세요..."
            className="min-h-24 rounded-xl border-[#E5E7EB] resize-none"
          />
        </div>

        {/* Photos (UI only for now) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-[#111827]">사진</Label>
            <span className="text-xs text-[#6B7280]">{photos.length}/5</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-[#E5E7EB]"
              >
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handlePhotoRemove(index)}
                  className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-black/50 rounded-full text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {photos.length < 5 && (
              <button
                type="button"
                onClick={handlePhotoAdd}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center text-[#9CA3AF] hover:border-[#22C55E] hover:text-[#22C55E] transition-colors flex-shrink-0"
              >
                <ImagePlus className="w-5 h-5" />
                <span className="text-xs mt-1">추가</span>
              </button>
            )}
          </div>
        </div>

        {/* Cancellation Policy & Consent */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-4">
          <div>
            <h3 className="font-medium text-[#111827] mb-2">취소/분쟁 정책</h3>
            <ul className="text-sm text-[#6B7280] space-y-1">
              <li>• 작업 24시간 전: 전액 환불</li>
              <li>• 작업 12시간 전: 50% 환불</li>
              <li>• 작업 12시간 이내: 환불 불가</li>
            </ul>
          </div>
          <div className="flex items-start gap-3 pt-2 border-t border-[#E5E7EB]">
            <Checkbox
              id="consent"
              checked={consentChecked}
              onCheckedChange={(checked) => setConsentChecked(checked === true)}
              className="mt-0.5 data-[state=checked]:bg-[#22C55E] data-[state=checked]:border-[#22C55E]"
            />
            <label htmlFor="consent" className="text-sm text-[#374151] cursor-pointer">
              취소/분쟁 정책에 동의합니다
            </label>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA]">
            <ul className="text-sm text-[#DC2626] space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Sticky Submit Button */}
      <BottomCTA>
        <PrimaryButton onClick={handleSubmit} disabled={isSubmitting || !canSubmit} className="w-full h-12 text-base">
          {isSubmitting ? "등록 중..." : showHelperBanner ? "고객 모드로 전환 필요" : "요청 등록하기"}
        </PrimaryButton>
      </BottomCTA>

      {/* Address Modal (내 주소록 연동) */}
      <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>내 주소에서 선택</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                value={addressSearch}
                onChange={(e) => setAddressSearch(e.target.value)}
                placeholder="시/군/구, 동, 주소로 검색"
                className="pl-10 rounded-xl border-[#E5E7EB]"
              />
            </div>

            {/* 상태 영역 */}
            {addrError ? (
              <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-sm text-[#DC2626]">
                {addrError}
              </div>
            ) : null}

            <div className="flex items-center justify-between">
              <div className="text-xs text-[#6B7280]">
                {addrLoading ? "불러오는 중..." : `${filteredAddrRows.length}개 주소`}
              </div>
              <button
                type="button"
                onClick={loadAddresses}
                className="inline-flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#111827]"
                disabled={addrLoading}
              >
                <RefreshCw className="w-3 h-3" />
                새로고침
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
              {!addrLoading && filteredAddrRows.length === 0 ? (
                <div className="py-8">
                  <EmptyState
                    icon={<MapPin className="w-8 h-8" />}
                    title="저장된 주소가 없어요"
                    description="마이페이지 > 주소 설정에서 주소를 먼저 추가해 주세요."
                  />
                </div>
              ) : (
                filteredAddrRows.map((row) => (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => {
                      setSelectedRow(row);
                      // 기존 address가 있고 같은 row면 detail을 유지, 아니면 row의 detail로 초기화
                      setDetailAddress((prev) => {
                        if (address?.id === row.id) return prev || address.detail || row.address_detail || "";
                        return row.address_detail || "";
                      });
                    }}
                    className={`w-full p-3 rounded-xl text-left transition-colors ${
                      selectedRow?.id === row.id
                        ? "bg-[#F0FDF4] border-2 border-[#22C55E]"
                        : "bg-[#F8FAFC] border border-[#E5E7EB] hover:bg-[#F1F5F9]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#111827] truncate">{row.address_line}</p>
                        <p className="text-xs text-[#6B7280] mt-0.5 truncate">
                          {row.region_sigungu} {row.region_dong}
                        </p>
                        {row.address_detail ? (
                          <p className="text-xs text-[#9CA3AF] mt-0.5 truncate">{row.address_detail}</p>
                        ) : null}
                        {selectedRow?.id === row.id ? (
                          <div className="flex items-center gap-1 mt-1 text-[#22C55E]">
                            <Check className="w-3 h-3" />
                            <span className="text-xs">선택됨</span>
                          </div>
                        ) : null}
                      </div>

                      <Badge
                        variant="outline"
                        className="bg-white text-[#374151] border-[#E5E7EB] text-[11px] shrink-0"
                      >
                        {row.region_sigungu}
                      </Badge>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* 상세주소 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#111827]">상세 주소</Label>
              <Input
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                placeholder="동/호수 등"
                className="rounded-xl border-[#E5E7EB]"
                disabled={!selectedRow}
              />
              <p className="text-[11px] text-[#9CA3AF]">
                선택한 주소의 상세주소는 이번 요청에만 반영됩니다(주소록 자체 수정은 다음 단계).
              </p>
            </div>

            <PrimaryButton onClick={handleAddressSave} disabled={!selectedRow} className="w-full">
              주소 저장
            </PrimaryButton>

            <Button
              variant="ghost"
              onClick={() => router.push("/me/addresses")}
              className="w-full text-[#6B7280] hover:text-[#111827]"
              type="button"
            >
              주소 관리로 이동
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
