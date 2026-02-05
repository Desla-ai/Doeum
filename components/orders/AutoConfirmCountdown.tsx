"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface AutoConfirmCountdownProps {
  targetTime: Date;
  onExpire?: () => void;
}

export function AutoConfirmCountdown({
  targetTime,
  onExpire,
}: AutoConfirmCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = targetTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("만료됨");
        onExpire?.();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}시간 ${minutes}분 ${seconds}초`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onExpire]);

  return (
    <div className="p-4 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A]">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-5 h-5 text-[#92400E]" />
        <span className="font-medium text-[#92400E]">자동확정까지 남은 시간</span>
      </div>
      <p className="text-2xl font-bold text-[#92400E]">{timeLeft}</p>
      <p className="text-xs text-[#A16207] mt-2">
        24시간 내 확인하지 않으면 자동으로 확정됩니다
      </p>
    </div>
  );
}
