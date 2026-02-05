"use client";

import { BrandLogo } from "@/components/brand/BrandLogo";

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center w-full max-w-full min-h-dvh overflow-hidden bg-[#22C55E]">
      <BrandLogo size={72} showWordmark variant="inverted" />

      {/* Loading Dots */}
      <div className="flex items-center gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-white/80 animate-pulse"
            style={{
              animationDelay: `${i * 150}ms`,
              animationDuration: "600ms",
            }}
          />
        ))}
      </div>

      {/* Tagline */}
      <p className="mt-6 text-white/90 text-sm font-medium">
        안전한 매칭과 에스크로 결제
      </p>
    </div>
  );
}
