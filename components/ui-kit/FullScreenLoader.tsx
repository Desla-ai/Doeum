"use client";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { cn } from "@/lib/utils";

interface FullScreenLoaderProps {
  message?: string;
  variant?: "default" | "branded";
}

export function FullScreenLoader({
  message = "로딩 중...",
  variant = "default",
}: FullScreenLoaderProps) {
  const isBranded = variant === "branded";

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center w-full max-w-full min-h-dvh overflow-hidden",
        isBranded ? "bg-[#22C55E]" : "bg-white"
      )}
    >
      <BrandLogo
        size={64}
        showWordmark
        variant={isBranded ? "inverted" : "default"}
      />

      {/* Loading Dots */}
      <div className="flex items-center gap-1.5 mt-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              isBranded ? "bg-white/80" : "bg-[#22C55E]"
            )}
            style={{
              animationDelay: `${i * 150}ms`,
              animationDuration: "600ms",
            }}
          />
        ))}
      </div>

      {/* Message */}
      <p
        className={cn(
          "mt-4 text-sm",
          isBranded ? "text-white/90" : "text-[#6B7280]"
        )}
      >
        {message}
      </p>
    </div>
  );
}
