"use client";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: number;
  showWordmark?: boolean;
  variant?: "default" | "inverted";
  className?: string;
}

export function BrandLogo({
  size = 48,
  showWordmark = true,
  variant = "default",
  className,
}: BrandLogoProps) {
  const isInverted = variant === "inverted";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Logo Mark */}
      <div
        className={cn(
          "flex items-center justify-center rounded-xl font-bold",
          isInverted ? "bg-white text-[#22C55E]" : "bg-[#22C55E] text-white"
        )}
        style={{
          width: size,
          height: size,
          fontSize: size * 0.5,
        }}
      >
        D
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <span
          className={cn(
            "font-bold",
            isInverted ? "text-white" : "text-[#111827]"
          )}
          style={{ fontSize: size * 0.5 }}
        >
          도움
        </span>
      )}
    </div>
  );
}
