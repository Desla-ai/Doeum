"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton, SecondaryButton, EmptyState } from "@/components/ui-kit";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Plus, RefreshCw, Crosshair } from "lucide-react";

declare global {
  interface Window {
    kakao: any;
  }
}

function useKakaoMapScript() {
  const [ready, setReady] = useState(false);
  const key = process.env.NEXT_PUBLIC_KAKAO_MAP_JS_KEY;

  useEffect(() => {
    if (!key) return;

    // already loaded
    if (typeof window !== "undefined" && window.kakao?.maps) {
      setReady(true);
      return;
    }

    const scriptId = "kakao-map-sdk";
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(() => setReady(true));
    };
    document.head.appendChild(script);
  }, [key]);

  return { ready, hasKey: !!key };
}

type AddressRow = {
  id: string;
  user_id: string;
  region_sigungu: string;
  region_dong: string;
  address_line: string;
  address_detail: string;
  lat: number | null;
  lng: number | null;
  created_at: string;
};

export default function AddressesPage() {
  const { toast } = useToast();
  const { ready: mapReady, hasKey } = useKakaoMapScript();

  const [rows, setRows] = useState<AddressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [regionSigungu, setRegionSigungu] = useState("");
  const [regionDong, setRegionDong] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [addressDetail, setAddressDetail] = useState("");

  // map state
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [pickedLatLng, setPickedLatLng] = useState<{ lat: number; lng: number } | null>(null);

  const canSubmit = useMemo(() => {
    return !!regionSigungu.trim() && !!regionDong.trim() && !!addressLine.trim();
  }, [regionSigungu, regionDong, addressLine]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/addresses", { method: "GET" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error?.message || json?.error || `주소 목록 로드 실패 (${res.status})`);
      setRows((json?.data ?? []) as AddressRow[]);
    } catch (e: any) {
      console.error(e);
      setRows([]);
      toast({
        title: "주소를 불러오지 못했어요",
        description: e?.message || "잠시 후 다시 시도해 주세요.",
        variant: "destructive" as any,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // init map when dialog opens
  useEffect(() => {
    if (!isAddDialogOpen) return;
    if (!mapReady) return;
    if (!mapElRef.current) return;

    const kakao = window.kakao;
    const center = new kakao.maps.LatLng(37.5665, 126.9780); // 서울 시청
    const map = new kakao.maps.Map(mapElRef.current, { center, level: 5 });
    mapRef.current = map;

    const marker = new kakao.maps.Marker({ position: center });
    marker.setMap(map);
    markerRef.current = marker;

    setPickedLatLng({ lat: 37.5665, lng: 126.9780 });

    kakao.maps.event.addListener(map, "click", function (mouseEvent: any) {
      const latlng = mouseEvent.latLng;
      const lat = latlng.getLat();
      const lng = latlng.getLng();
      marker.setPosition(latlng);
      setPickedLatLng({ lat, lng });
    });
  }, [isAddDialogOpen, mapReady]);

  const handleAdd = async () => {
    if (!canSubmit) return;

    setSaving(true);
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region_sigungu: regionSigungu.trim(),
          region_dong: regionDong.trim(),
          address_line: addressLine.trim(),
          address_detail: addressDetail.trim(),
          lat: pickedLatLng?.lat ?? null,
          lng: pickedLatLng?.lng ?? null,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error?.message || json?.error || `주소 저장 실패 (${res.status})`);

      toast({ title: "주소가 추가됐어요" });

      setRegionSigungu("");
      setRegionDong("");
      setAddressLine("");
      setAddressDetail("");
      setPickedLatLng(null);
      setIsAddDialogOpen(false);

      await load();
    } catch (e: any) {
      console.error(e);
      toast({
        title: "주소 추가 실패",
        description: e?.message || "잠시 후 다시 시도해 주세요.",
        variant: "destructive" as any,
      });
    } finally {
      setSaving(false);
    }
  };

  const centerToMarker = () => {
    if (!mapRef.current || !markerRef.current) return;
    const kakao = window.kakao;
    const pos = markerRef.current.getPosition();
    mapRef.current.setCenter(new kakao.maps.LatLng(pos.getLat(), pos.getLng()));
  };

  return (
    <div className="w-full max-w-full p-4 space-y-4">
      <div className="flex gap-2">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <PrimaryButton className="flex-1 h-12">
              <Plus className="w-4 h-4 mr-2" />
              주소 추가
            </PrimaryButton>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#111827]">새 주소 추가</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-[#374151]">시/군/구</Label>
                <Input
                  value={regionSigungu}
                  onChange={(e) => setRegionSigungu(e.target.value)}
                  placeholder="예: 성남시 분당구"
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#374151]">동</Label>
                <Input
                  value={regionDong}
                  onChange={(e) => setRegionDong(e.target.value)}
                  placeholder="예: 정자동"
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#374151]">주소</Label>
                <Input
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="도로명 주소"
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#374151]">
                  상세주소 <span className="text-[#9CA3AF]">(선택)</span>
                </Label>
                <Input
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  placeholder="동/호수 등"
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#374151]">지도에서 위치 선택</Label>

                {!hasKey ? (
                  <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-sm text-[#DC2626]">
                    NEXT_PUBLIC_KAKAO_MAP_JS_KEY가 설정되지 않았어요.
                  </div>
                ) : !mapReady ? (
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-sm text-[#6B7280]">
                    지도 로딩 중...
                  </div>
                ) : (
                  <>
                    <div ref={mapElRef} className="w-full h-48 rounded-xl overflow-hidden border border-[#E5E7EB]" />
                    <div className="flex items-center justify-between text-xs text-[#6B7280] mt-2">
                      <span>
                        선택 좌표:{" "}
                        {pickedLatLng ? `${pickedLatLng.lat.toFixed(6)}, ${pickedLatLng.lng.toFixed(6)}` : "(미선택)"}
                      </span>
                      <button
                        type="button"
                        onClick={centerToMarker}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#F0FDF4] text-[#22C55E]"
                      >
                        <Crosshair className="w-3 h-3" />
                        센터
                      </button>
                    </div>
                    <p className="text-[11px] text-[#9CA3AF]">지도 클릭으로 마커를 이동해 좌표를 저장합니다.</p>
                  </>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <SecondaryButton className="flex-1" disabled={saving}>
                  취소
                </SecondaryButton>
              </DialogClose>
              <PrimaryButton onClick={handleAdd} disabled={!canSubmit || saving} className="flex-1">
                {saving ? "저장 중..." : "추가"}
              </PrimaryButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <SecondaryButton className="h-12 px-4" onClick={load} disabled={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          새로고침
        </SecondaryButton>
      </div>

      {loading ? (
        <div className="p-4 text-sm text-[#6B7280]">주소를 불러오는 중...</div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<MapPin className="w-8 h-8" />}
          title="등록된 주소가 없어요"
          description="주소를 추가하면 요청 시 빠르게 사용할 수 있어요"
        />
      ) : (
        <div className="space-y-3">
          {rows.map((addr) => (
            <div key={addr.id} className="p-4 rounded-2xl border border-[#E5E7EB] bg-white">
              <div className="flex items-start gap-3 min-w-0">
                <MapPin className="w-5 h-5 text-[#6B7280] mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#111827]">
                    {addr.region_sigungu} {addr.region_dong}
                  </p>
                  <p className="text-sm text-[#374151] break-words">{addr.address_line}</p>
                  {!!addr.address_detail && <p className="text-sm text-[#6B7280] break-words">{addr.address_detail}</p>}
                  {addr.lat != null && addr.lng != null && (
                    <p className="text-xs text-[#9CA3AF] mt-2">
                      좌표: {addr.lat.toFixed(6)}, {addr.lng.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
