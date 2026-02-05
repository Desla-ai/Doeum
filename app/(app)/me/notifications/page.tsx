"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/ui-kit";
import { useToast } from "@/hooks/use-toast";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  optional?: boolean;
}

const initialSettings: NotificationSetting[] = [
  {
    id: "requests",
    label: "요청 관련 알림",
    description: "새 요청, 제안, 매칭 알림을 받습니다",
    enabled: true,
  },
  {
    id: "chat",
    label: "채팅 알림",
    description: "새 메시지가 도착하면 알림을 받습니다",
    enabled: true,
  },
  {
    id: "payment",
    label: "결제/정산 알림",
    description: "결제 완료, 정산 완료 알림을 받습니다",
    enabled: true,
  },
  {
    id: "marketing",
    label: "마케팅 알림",
    description: "이벤트, 프로모션 정보를 받습니다",
    enabled: false,
    optional: true,
  },
];

export default function NotificationsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSetting[]>(initialSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Mock save delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);
    setHasChanges(false);

    toast({
      title: "적용됐어요",
      description: "알림 설정이 저장되었습니다. (데모)",
    });
  };

  return (
    <div className="w-full max-w-full p-4 space-y-4">
      {/* Settings List */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden divide-y divide-[#E5E7EB]">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center justify-between p-4 gap-4"
          >
            <div className="min-w-0">
              <Label
                htmlFor={setting.id}
                className="text-[#111827] font-medium block"
              >
                {setting.label}
                {setting.optional && (
                  <span className="ml-1 text-xs text-[#9CA3AF] font-normal">
                    (선택)
                  </span>
                )}
              </Label>
              <p className="text-sm text-[#6B7280] mt-0.5">
                {setting.description}
              </p>
            </div>
            <Switch
              id={setting.id}
              checked={setting.enabled}
              onCheckedChange={() => handleToggle(setting.id)}
              className="shrink-0 data-[state=checked]:bg-[#22C55E]"
            />
          </div>
        ))}
      </div>

      {/* Save Button */}
      <PrimaryButton
        onClick={handleSave}
        disabled={!hasChanges || isLoading}
        className="w-full h-12"
      >
        {isLoading ? "저장 중..." : "저장하기"}
      </PrimaryButton>

      {/* Info */}
      <p className="text-xs text-center text-[#9CA3AF]">
        알림 설정은 기기의 알림 설정에 따라 달라질 수 있습니다
      </p>
    </div>
  );
}
