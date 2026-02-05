"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelperCard, type HelperData } from "./HelperCard";
import { LoadingSkeleton } from "@/components/ui-kit";
import { RefreshCw, Info, MapPin } from "lucide-react";

interface OnlineHelpersShowcaseProps {
  helpers: HelperData[];
  region?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function OnlineHelpersShowcase({
  helpers,
  region = "서울 강남구",
  isLoading = false,
  onRefresh,
}: OnlineHelpersShowcaseProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-4 overflow-x-hidden">
      {/* Info Section */}
      <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] overflow-hidden">
        <p className="text-sm text-[#374151] mb-3">
          온라인 도우미를 자동 추천해요
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-[#6B7280] shrink-0" />
          <span className="text-sm text-[#6B7280]">지역 자동 맞춤:</span>
          <Badge
            variant="outline"
            className="bg-white text-[#111827] border-[#E5E7EB] text-xs rounded-lg"
          >
            {region}
          </Badge>
        </div>

        <p className="text-xs text-[#9CA3AF] mb-3">
          요청 작성 중 주소 우선, 없으면 마지막 주소
        </p>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-xs text-[#6B7280] hover:text-[#111827] hover:bg-white"
            >
              <Info className="w-3.5 h-3.5 mr-1.5" />
              추천 기준 보기
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#111827]">추천 기준 안내</DialogTitle>
              <DialogDescription className="text-[#6B7280]">
                공정한 도우미 추천 시스템
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm text-[#374151]">
              <p>
                온라인 도우미 중 내부 기준으로 공정하게 추천해요.
              </p>
              <p>
                모든 도우미가 기회를 얻도록 노출을 분산해요.
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#6B7280]">
                <li>매칭점수 기반 추천</li>
                <li>활동 이력 및 응답 속도 반영</li>
                <li>지역 매칭 자동 적용</li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Refresh Button */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#6B7280]">
          추천 도우미 7명
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className="h-8 px-3 rounded-xl border-[#E5E7EB] text-[#374151] hover:bg-[#F8FAFC] bg-transparent"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`}
          />
          새로고침
        </Button>
      </div>

      <p className="text-xs text-[#9CA3AF]">
        새로고침하면 추천 목록이 갱신돼요 (7명 고정)
      </p>

      {/* Helpers List */}
      {isLoading || isRefreshing ? (
        <LoadingSkeleton variant="helper" count={7} />
      ) : (
        <div className="space-y-3">
          {helpers.slice(0, 7).map((helper) => (
            <HelperCard key={helper.id} helper={helper} />
          ))}
        </div>
      )}
    </div>
  );
}
