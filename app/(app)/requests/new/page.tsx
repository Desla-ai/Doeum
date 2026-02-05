"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  PrimaryButton,
  SecondaryButton,
  TierBadge,
  ScoreChip,
} from "@/components/ui-kit";
import { BottomCTA } from "@/components/shell/BottomCTA";
import { useAppMode } from "@/components/providers/AppModeProvider";
import type { RequestData, PreferredHelper } from "@/lib/types/request";
import { toKSTISOString } from "@/lib/time/krTime";
import {
  MapPin,
  Calendar,
  Clock,
  ImagePlus,
  X,
  Search,
  Map,
  Check,
  AlertCircle,
} from "lucide-react";

const categories = [
  { id: "cleaning", label: "청소" },
  { id: "laundry", label: "빨래" },
  { id: "cooking", label: "요리" },
  { id: "organizing", label: "정리" },
  { id: "other", label: "기타" },
];

const mockAddressResults = [
  {
    id: "1",
    roadAddress: "서울 강남구 테헤란로 152",
    jibunAddress: "서울 강남구 역삼동 737",
    region: "서울 강남구",
  },
  {
    id: "2",
    roadAddress: "서울 강남구 봉은사로 524",
    jibunAddress: "서울 강남구 삼성동 159",
    region: "서울 강남구",
  },
  {
    id: "3",
    roadAddress: "서울 서초구 반포대로 235",
    jibunAddress: "서울 서초구 반포동 19-1",
    region: "서울 서초구",
  },
];

const mockPreferredHelper: PreferredHelper = {
  id: "helper_123",
  name: "김영희",
  tier: "GOLD",
  matchingScore: 920,
};

// Helper mode banner component - shown inline at top, not blocking the form
function HelperModeBanner({ onSwitchMode }: { onSwitchMode: () => void }) {
  return (
    <div className="m-4 p-4 rounded-2xl border-2 border-[#F59E0B] bg-[#FFFBEB]">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[#92400E] mb-1">
            고객 모드에서 요청을 올릴 수 있어요
          </h3>
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
  const [address, setAddress] = useState<{
    road: string;
    jibun: string;
    detail: string;
    region: string;
  } | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressSearch, setAddressSearch] = useState("");
  const [addressResults, setAddressResults] = useState(mockAddressResults);
  const [selectedAddress, setSelectedAddress] = useState<
    (typeof mockAddressResults)[0] | null
  >(null);
  const [detailAddress, setDetailAddress] = useState("");
  const [isDirectRequest, setIsDirectRequest] = useState(!!preferredHelperId);
  const [consentChecked, setConsentChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Helper mode - show form but with banner (form fields disabled)
  const showHelperBanner = isHelper;

  const handlePhotoAdd = () => {
    if (photos.length < 5) {
      setPhotos([
        ...photos,
        `/placeholder.svg?height=200&width=200&text=Photo${photos.length + 1}`,
      ]);
    }
  };

  const handlePhotoRemove = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleAddressSearch = (query: string) => {
    setAddressSearch(query);
    if (query) {
      setAddressResults(
        mockAddressResults.filter(
          (a) =>
            a.roadAddress.includes(query) || a.jibunAddress.includes(query)
        )
      );
    } else {
      setAddressResults(mockAddressResults);
    }
  };

  const handleAddressSelect = (selected: (typeof mockAddressResults)[0]) => {
    setSelectedAddress(selected);
  };

  const handleAddressSave = () => {
    if (selectedAddress) {
      setAddress({
        road: selectedAddress.roadAddress,
        jibun: selectedAddress.jibunAddress,
        detail: detailAddress,
        region: selectedAddress.region,
      });
      setIsAddressModalOpen(false);
      setSelectedAddress(null);
      setDetailAddress("");
    }
  };

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

  const handleSubmit = async () => {
    // Guard: Block submission in helper mode with inline error
    if (isHelper) {
      setValidationErrors([
        "고객 모드에서만 요청을 올릴 수 있어요. 상단에서 고객으로 전환해주세요.",
      ]);
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Generate mock request ID
    const requestId = `req_${Date.now()}`;

    // Create mock request object with shared RequestData type
    const newRequest: RequestData = {
      id: requestId,
      category: categories.find((c) => c.id === category)?.label || category,
      status: "posted",
      datetime: date,
      time: time,
      location: address?.road || "",
      region: address?.region || "",
      price: Number(price),
      description: notes,
      photos: photos,
      // Save preferredHelper object (not just ID) so detail page can display it
      ...(isDirectRequest && preferredHelperId
        ? { preferredHelper: mockPreferredHelper }
        : {}),
      createdAt: toKSTISOString(new Date()),
    };

    // Store in localStorage
    try {
      const existingRequests = JSON.parse(
        localStorage.getItem("mock_requests") || "[]"
      );
      existingRequests.push(newRequest);
      localStorage.setItem("mock_requests", JSON.stringify(existingRequests));
      // Debug log for verification
      console.log("[v0] Saved request to mock_requests:", newRequest.id, "Total:", existingRequests.length);
    } catch (e) {
      console.error("[v0] Failed to save to localStorage:", e);
    }

    setIsSubmitting(false);

    // Navigate to created request
    router.push(`/requests/${requestId}`);
  };

  return (
    <div
      className="w-full max-w-full"
      style={{
        paddingBottom: "calc(var(--bottom-tabs-h) + var(--safe-bottom) + 80px)",
      }}
    >
      {/* Debug marker - confirms this is the correct page */}
      <div className="px-4 pt-2">
        <p className="text-xs text-[#9CA3AF]">요청 작성 폼 (UI 데모)</p>
      </div>

      {/* Helper Mode Banner - shown inline at top */}
      {showHelperBanner && (
        <HelperModeBanner onSwitchMode={() => setMode("customer")} />
      )}

      <div className={`p-4 space-y-6 ${showHelperBanner ? "opacity-60" : ""}`}>
        {/* Preferred Helper Block */}
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
                <AvatarImage
                  src="/placeholder.svg"
                  alt={mockPreferredHelper.name}
                />
                <AvatarFallback>
                  {mockPreferredHelper.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-[#111827]">
                  {mockPreferredHelper.name}
                </p>
                <div className="flex items-center gap-2">
                  <TierBadge tier={mockPreferredHelper.tier} />
                  <ScoreChip score={mockPreferredHelper.matchingScore} />
                </div>
              </div>
            </div>
            <p className="text-xs text-[#6B7280] mt-2">
              이 도우미에게 지정 요청하기
            </p>
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
                  <p className="text-sm text-[#111827] truncate">
                    {address.road}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-0.5 truncate">
                    {address.jibun}
                  </p>
                  {address.detail && (
                    <p className="text-xs text-[#6B7280] truncate">
                      {address.detail}
                    </p>
                  )}
                </div>
                <Badge
                  variant="outline"
                  className="bg-white text-[#374151] border-[#E5E7EB] text-xs shrink-0 ml-2"
                >
                  {address.region}
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
              주소 찾기
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
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">
              원/건당
            </span>
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

        {/* Photos */}
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
              onCheckedChange={(checked) =>
                setConsentChecked(checked === true)
              }
              className="mt-0.5 data-[state=checked]:bg-[#22C55E] data-[state=checked]:border-[#22C55E]"
            />
            <label
              htmlFor="consent"
              className="text-sm text-[#374151] cursor-pointer"
            >
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
        <PrimaryButton
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full h-12 text-base"
        >
          {isSubmitting
            ? "등록 중..."
            : showHelperBanner
              ? "고객 모드로 전환 필요"
              : "요청 등록하기"}
        </PrimaryButton>
      </BottomCTA>

      {/* Address Search Modal */}
      <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>주소 찾기</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                value={addressSearch}
                onChange={(e) => handleAddressSearch(e.target.value)}
                placeholder="도로명, 지번, 건물명으로 검색"
                className="pl-10 rounded-xl border-[#E5E7EB]"
              />
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
              {addressResults.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => handleAddressSelect(result)}
                  className={`w-full p-3 rounded-xl text-left transition-colors ${
                    selectedAddress?.id === result.id
                      ? "bg-[#F0FDF4] border-2 border-[#22C55E]"
                      : "bg-[#F8FAFC] border border-[#E5E7EB] hover:bg-[#F1F5F9]"
                  }`}
                >
                  <p className="text-sm font-medium text-[#111827]">
                    {result.roadAddress}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    {result.jibunAddress}
                  </p>
                  {selectedAddress?.id === result.id && (
                    <div className="flex items-center gap-1 mt-1 text-[#22C55E]">
                      <Check className="w-3 h-3" />
                      <span className="text-xs">선택됨</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Map Placeholder */}
            {selectedAddress && (
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <div className="flex items-center gap-2 text-[#6B7280] mb-2">
                  <Map className="w-4 h-4" />
                  <span className="text-sm">지도에서 위치 확인</span>
                </div>
                <div className="aspect-video rounded-lg bg-[#E5E7EB] flex items-center justify-center">
                  <span className="text-sm text-[#9CA3AF]">
                    Kakao Map 영역
                  </span>
                </div>
              </div>
            )}

            {/* Detail Address */}
            {selectedAddress && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#111827]">
                  상세 주소
                </Label>
                <Input
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  placeholder="동/호수 등"
                  className="rounded-xl border-[#E5E7EB]"
                />
              </div>
            )}

            {/* Save Button */}
            <PrimaryButton
              onClick={handleAddressSave}
              disabled={!selectedAddress}
              className="w-full"
            >
              주소 저장
            </PrimaryButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
