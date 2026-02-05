"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Wifi, Clock, Activity } from "lucide-react";

export function HelperOnlineCard() {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-3 h-3 rounded-full shrink-0 ${
              isOnline ? "bg-[#22C55E] animate-pulse" : "bg-[#9CA3AF]"
            }`}
          />
          <span className="font-medium text-[#111827] truncate">
            {isOnline ? "온라인" : "오프라인"}
          </span>
        </div>
        <Switch
          checked={isOnline}
          onCheckedChange={setIsOnline}
          className="data-[state=checked]:bg-[#22C55E] shrink-0"
        />
      </div>

      <div className="space-y-2 text-sm text-[#6B7280]">
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 shrink-0 mt-0.5 text-[#9CA3AF]" />
          <p>15분간 활동 없으면 자동 오프라인</p>
        </div>
        <div className="flex items-start gap-2">
          <Activity className="w-4 h-4 shrink-0 mt-0.5 text-[#9CA3AF]" />
          <p>온라인일 때 60초마다 활동 갱신 (heartbeat)</p>
        </div>
      </div>

      {isOnline && (
        <div className="mt-3 p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
          <div className="flex items-center gap-2 text-[#166534]">
            <Wifi className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">요청을 받을 수 있어요</span>
          </div>
        </div>
      )}
    </div>
  );
}
