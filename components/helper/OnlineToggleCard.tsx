"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Activity } from "lucide-react";

interface OnlineToggleCardProps {
  initialOnline?: boolean;
  region?: string;
  onToggle?: (online: boolean) => void;
}

export function OnlineToggleCard({
  initialOnline = false,
  region = "서울 강남구",
  onToggle,
}: OnlineToggleCardProps) {
  const [isOnline, setIsOnline] = useState(initialOnline);

  const handleToggle = (checked: boolean) => {
    setIsOnline(checked);
    onToggle?.(checked);
  };

  return (
    <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-3 h-3 rounded-full shrink-0 ${
              isOnline ? "bg-[#22C55E]" : "bg-[#9CA3AF]"
            }`}
          />
          <span className="font-medium text-[#111827] truncate">
            {isOnline ? "온라인" : "오프라인"}
          </span>
        </div>
        <Switch
          checked={isOnline}
          onCheckedChange={handleToggle}
          className="data-[state=checked]:bg-[#22C55E] shrink-0"
        />
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex flex-wrap items-center gap-2 text-[#6B7280]">
          <MapPin className="w-4 h-4 shrink-0" />
          <span>적용 지역:</span>
          <Badge
            variant="outline"
            className="bg-[#F8FAFC] text-[#374151] border-[#E5E7EB] text-xs rounded-lg"
          >
            {region}
          </Badge>
        </div>

        <div className="p-3 rounded-xl bg-[#F8FAFC] space-y-2">
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-[#6B7280] mt-0.5" />
            <div>
              <p className="text-[#374151]">자동 오프라인</p>
              <p className="text-xs text-[#6B7280]">
                수동 설정 + 15분 무활동 시 자동 오프라인
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Activity className="w-4 h-4 text-[#6B7280] mt-0.5" />
            <div>
              <p className="text-[#374151]">온라인 유지</p>
              <p className="text-xs text-[#6B7280]">
                60초마다 활동 신호(heartbeat)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
