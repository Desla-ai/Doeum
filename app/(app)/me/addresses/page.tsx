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
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { MapPin, Plus, Trash2, Crosshair, RefreshCw } from "lucide-react";

type Address = {
  id: string;
  user_id: string;
  region_sigungu: string;
  region_dong: string;
  address_line: string;
  address_detail?: string | null;
  lat?: number | null;
  lng?: number | null;
  created_at?: string;
};

declare global {
  interface Window {
    kakao?: any;
    daum?: any;
  }
}

const KAKAO_SDK_ID = "kakao-map-sdk";

function useKakaoMapScript() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_JS_KEY;

  useEffect(() => {
    if (!appKey) {
      setError("NEXT_PUBLIC_KAKAO_MAP_JS_KEY가 설정되지 않았어요.");
      setReady(false);
      return;
    }

    const ensureLoaded = () => {
      const k = window.kakao;
      if (!k?.maps?.load) return;

      try {
        k.maps.load(() => {
          setReady(true);
        });
      } catch (e: any) {
        console.error("[kakao-map] maps.load failed", e);
        setError(String(e));
        setReady(false);
      }
    };

    // 이미 준비된 경우
    if (window.kakao?.maps?.Map && window.kakao?.maps?.services?.Geocoder) {
      setReady(true);
      return;
    }

    const existing = document.getElementById(KAKAO_SDK_ID) as HTMLScriptElement | null;
    if (existing) {
      const t = window.setTimeout(() => ensureLoaded(), 50);
      return () => window.clearTimeout(t);
    }

    const script = document.createElement("script");
    script.id = KAKAO_SDK_ID;
    script.async = true;

    // ✅ Geocoder(services) 사용을 위해 libraries=services 필수
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;

    script.onload = () => ensureLoaded();
    script.onerror = () => {
      setError("Kakao Maps SDK 로드에 실패했어요. (네트워크/도메인 등록/키 확인)");
      setReady(false);
    };

    document.head.appendChild(script);
  }, [appKey]);

  return { ready, error };
}

function pickRegionFromCoord2RegionCode(results: any[]) {
  if (!Array.isArray(results) || results.length === 0) return null;

  const h = results.find((r) => r?.region_type === "H");
  const b = results.find((r) => r?.region_type === "B");
  const r = h || b || results[0];

  const depth1 = r?.region_1depth_name ?? "";
  const depth2 = r?.region_2depth_name ?? "";
  const depth3 = r?.region_3depth_name ?? "";

  const region_sigungu = `${depth1} ${depth2}`.trim();
  const region_dong = `${depth3}`.trim();

  return { region_sigungu, region_dong };
}

/**
 * coord2Address 결과에서 "도로명 주소 우선"으로 address_line 채우기
 * - 샘플에서 result[0].road_address.address_name(도로명), result[0].address.address_name(지번) 사용 [Source]
 */
function pickAddressLineFromCoord2Address(results: any[]) {
  if (!Array.isArray(results) || results.length === 0) return null;

  const first = results[0];
  const road = first?.road_address?.address_name as string | undefined;
  const jibun = first?.address?.address_name as string | undefined;

  // 도로명 우선, 없으면 지번
  return (road?.trim() || jibun?.trim() || "").trim() || null;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [regionSigungu, setRegionSigungu] = useState("");
  const [regionDong, setRegionDong] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [addressDetail, setAddressDetail] = useState("");

  // Map refs/state
  const { ready: mapReady, error: mapError } = useKakaoMapScript();
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);

  const [pickedLatLng, setPickedLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      regionSigungu.trim().length > 0 &&
      regionDong.trim().length > 0 &&
      addressLine.trim().length > 0
    );
  }, [regionSigungu, regionDong, addressLine]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/addresses", { method: "GET" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "주소 목록을 불러오지 못했어요.");
      setAddresses(json?.data ?? []);
    } catch (e: any) {
      console.error(e);
      toast({
        title: "로드 실패",
        description: String(e?.message || e),
        variant: "destructive" as any,
      });
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  useEffect(() => {
    if (isAddDialogOpen) return;
    mapRef.current = null;
    markerRef.current = null;
    geocoderRef.current = null;
    setPickedLatLng(null);
    setGeoLoading(false);
  }, [isAddDialogOpen]);

  // ✅ 모달 열릴 때 지도 생성 (폴링)
  useEffect(() => {
    if (!isAddDialogOpen) return;
    if (!mapReady) return;

    let alive = true;
    let t: number | null = null;

    const tryInit = () => {
      if (!alive) return;

      const kakao = window.kakao;
      const el =
        mapElRef.current ?? (document.getElementById("kakao-map-container") as HTMLDivElement | null);

      if (!el || !kakao?.maps?.Map || !kakao?.maps?.LatLng) {
        t = window.setTimeout(tryInit, 100);
        return;
      }

      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        t = window.setTimeout(tryInit, 120);
        return;
      }

      if (mapRef.current) {
        try {
          mapRef.current.relayout?.();
          kakao.maps.event.trigger(mapRef.current, "resize");
        } catch { }
        return;
      }

      const centerLat = 37.5665;
      const centerLng = 126.978;
      const center = new kakao.maps.LatLng(centerLat, centerLng);

      try {
        const map = new kakao.maps.Map(el, { center, level: 5 });
        mapRef.current = map;

        const marker = new kakao.maps.Marker({ position: center });
        marker.setMap(map);
        markerRef.current = marker;

        setPickedLatLng({ lat: centerLat, lng: centerLng });

        if (kakao?.maps?.services?.Geocoder) {
          geocoderRef.current = new kakao.maps.services.Geocoder();
        }

        // 렌더 트리거
        try {
          map.relayout?.();
          kakao.maps.event.trigger(map, "resize");
          map.setCenter(center);
        } catch { }

        // ✅ (1) 최초 center도 자동 채우기: region + address_line
        if (geocoderRef.current) {
          setGeoLoading(true);

          // region
          geocoderRef.current.coord2RegionCode(centerLng, centerLat, (result: any[], status: string) => {
            if (status === kakao.maps.services.Status.OK) {
              const picked = pickRegionFromCoord2RegionCode(result);
              if (picked) {
                setRegionSigungu(picked.region_sigungu);
                setRegionDong(picked.region_dong);
              }
            }
          });

          // address_line (도로명 우선)
          geocoderRef.current.coord2Address(centerLng, centerLat, (result: any[], status: string) => {
            setGeoLoading(false);
            if (status !== kakao.maps.services.Status.OK) return;
            const line = pickAddressLineFromCoord2Address(result);
            if (line) setAddressLine(line);
          });
        }

        // ✅ (2) 클릭 이벤트: 좌표 저장 + 마커 이동 + region + address_line 자동 매핑
        kakao.maps.event.addListener(map, "click", (mouseEvent: any) => {
          const latlng = mouseEvent?.latLng;
          if (!latlng) return;

          const lat = latlng.getLat();
          const lng = latlng.getLng();

          setPickedLatLng({ lat, lng });
          try {
            markerRef.current?.setPosition?.(latlng);
          } catch { }

          if (!geocoderRef.current) return;

          setGeoLoading(true);

          // 행정구역(시/군/구, 동)
          geocoderRef.current.coord2RegionCode(lng, lat, (result: any[], status: string) => {
            const ok = status === kakao.maps.services.Status.OK;
            if (!ok) return;

            const picked = pickRegionFromCoord2RegionCode(result);
            if (!picked) return;

            setRegionSigungu(picked.region_sigungu);
            setRegionDong(picked.region_dong);
          });

          // 도로명/지번 -> address_line 자동 채움
          geocoderRef.current.coord2Address(lng, lat, (result: any[], status: string) => {
            setGeoLoading(false);
            if (status !== kakao.maps.services.Status.OK) return;

            const line = pickAddressLineFromCoord2Address(result);
            if (line) setAddressLine(line);
          });
        });
      } catch (e: any) {
        console.error("[kakao-map] init failed", e);
        toast({
          title: "지도 초기화 실패",
          description: String(e),
          variant: "destructive" as any,
        });
        t = window.setTimeout(tryInit, 200);
        return;
      }
    };

    requestAnimationFrame(() => requestAnimationFrame(() => tryInit()));

    return () => {
      alive = false;
      if (t) window.clearTimeout(t);
    };
  }, [isAddDialogOpen, mapReady]);

  const centerToMarker = () => {
    const kakao = window.kakao;
    if (!mapRef.current || !markerRef.current || !kakao?.maps?.LatLng) return;
    try {
      mapRef.current.relayout?.();
      kakao.maps.event.trigger(mapRef.current, "resize");
    } catch { }

    const pos = markerRef.current.getPosition();
    mapRef.current.setCenter(new kakao.maps.LatLng(pos.getLat(), pos.getLng()));
  };

  const handleAdd = async () => {
    try {
      if (!canSubmit) {
        toast({
          title: "입력 확인",
          description: "시/군/구, 동, 주소(도로명/지번)는 필수예요.",
          variant: "destructive" as any,
        });
        return;
      }

      setSaving(true);

      const payload = {
        region_sigungu: regionSigungu.trim(),
        region_dong: regionDong.trim(),
        address_line: addressLine.trim(),
        address_detail: addressDetail.trim() ? addressDetail.trim() : null,
        lat: pickedLatLng?.lat ?? null,
        lng: pickedLatLng?.lng ?? null,
      };

      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "주소 추가에 실패했어요.");

      const created: Address = json?.data;
      setAddresses((prev) => [created, ...prev]);

      toast({ title: "추가 완료", description: "주소가 저장되었어요." });

      setRegionSigungu("");
      setRegionDong("");
      setAddressLine("");
      setAddressDetail("");
      setPickedLatLng(null);

      setIsAddDialogOpen(false);
    } catch (e: any) {
      console.error(e);
      toast({
        title: "추가 실패",
        description: String(e?.message || e),
        variant: "destructive" as any,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || id === "undefined") {
      toast({
        title: "삭제 실패",
        description: "주소 id가 비어있어요. (undefined) 주소 목록 응답 필드명을 확인해 주세요.",
        variant: "destructive" as any,
      });
      return;
    }

    const ok = window.confirm("이 주소를 삭제할까요?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "PATCH" });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(json?.error || `주소 삭제 실패 (${res.status})`);

      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast({ title: "삭제 완료" });
    } catch (e: any) {
      console.error(e);
      toast({
        title: "삭제 실패",
        description: String(e?.message || e),
        variant: "destructive" as any,
      });
    }
  };


  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">내 주소</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            지도에서 좌표를 찍으면 행정구역 + 도로명 주소가 자동으로 채워져요.{" "}
            <a
              href="https://apis.map.kakao.com/web/sample/coord2addr/"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Kakao 샘플
            </a>
            [Source](https://apis.map.kakao.com/web/sample/coord2addr/)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadAddresses} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            새로고침
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                주소 추가
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>새 주소 추가</DialogTitle>
              </DialogHeader>

              {mapError ? (
                <Card className="border-red-200 bg-red-50 p-3 text-sm text-red-700">{mapError}</Card>
              ) : null}

              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label>시/군/구</Label>
                  <Input
                    value={regionSigungu}
                    onChange={(e) => setRegionSigungu(e.target.value)}
                    placeholder="(지도 클릭 시 자동 입력)"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>동</Label>
                  <Input
                    value={regionDong}
                    onChange={(e) => setRegionDong(e.target.value)}
                    placeholder="(지도 클릭 시 자동 입력)"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>주소(도로명/지번)</Label>
                  <Input
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="(지도 클릭 시 자동 입력)"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>상세 주소(선택)</Label>
                  <Textarea
                    value={addressDetail}
                    onChange={(e) => setAddressDetail(e.target.value)}
                    placeholder="예) 101동 1203호"
                    rows={2}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>지도에서 위치 선택</Label>
                    <button
                      type="button"
                      onClick={centerToMarker}
                      className="inline-flex items-center gap-1 text-xs text-[#22C55E] hover:text-[#16A34A]"
                    >
                      <Crosshair className="h-3 w-3" />
                      센터
                    </button>
                  </div>

                  <div className="rounded-xl overflow-hidden border border-[#E5E7EB]">
                    <div
                      id="kakao-map-container"
                      data-kakao-map
                      ref={mapElRef}
                      className="w-full h-48 bg-white"
                    />
                  </div>

                  <div className="text-xs text-muted-foreground flex items-center justify-between">
                    <span>
                      선택 좌표:{" "}
                      {pickedLatLng
                        ? `${pickedLatLng.lat.toFixed(6)}, ${pickedLatLng.lng.toFixed(6)}`
                        : "미선택"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {geoLoading ? "주소/행정구역 조회 중..." : ""}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    클릭 시 <code>coord2RegionCode</code> + <code>coord2Address</code>로 자동 채움{" "}
                    <a
                      href="https://apis.map.kakao.com/web/sample/coord2addr/"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      (샘플)
                    </a>
                    [Source](https://apis.map.kakao.com/web/sample/coord2addr/)
                  </p>
                </div>
              </div>

              <DialogFooter className="mt-2">
                <DialogClose asChild>
                  <Button variant="outline" disabled={saving}>
                    취소
                  </Button>
                </DialogClose>
                <Button onClick={handleAdd} disabled={!canSubmit || saving}>
                  {saving ? "저장 중..." : "저장"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">불러오는 중...</div>
      ) : addresses.length === 0 ? (
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">
            저장된 주소가 없어요. 우측 상단에서 주소를 추가해 주세요.
          </div>
        </Card>
      ) : (
        <div className="grid gap-3">
          {addresses.map((a) => (
            <Card key={a.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm font-medium truncate">
                      {a.region_sigungu} {a.region_dong}
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground break-words">{a.address_line}</div>
                  {a.address_detail ? (
                    <div className="mt-1 text-xs text-muted-foreground break-words">{a.address_detail}</div>
                  ) : null}
                  {typeof a.lat === "number" && typeof a.lng === "number" ? (
                    <div className="mt-2 text-xs text-muted-foreground">
                      좌표: {a.lat.toFixed(6)}, {a.lng.toFixed(6)}
                    </div>
                  ) : null}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(a.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  aria-label="주소 삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
