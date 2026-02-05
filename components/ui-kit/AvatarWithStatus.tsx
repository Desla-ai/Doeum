"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarWithStatusProps {
  src?: string;
  alt: string;
  fallback: string;
  isOnline?: boolean;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, { avatar: string; dot: string }> = {
  sm: { avatar: "w-10 h-10", dot: "w-3 h-3" },
  md: { avatar: "w-12 h-12", dot: "w-3.5 h-3.5" },
  lg: { avatar: "w-14 h-14", dot: "w-4 h-4" },
  xl: { avatar: "w-16 h-16", dot: "w-5 h-5" },
};

export function AvatarWithStatus({
  src,
  alt,
  fallback,
  isOnline,
  size = "md",
  className,
}: AvatarWithStatusProps) {
  const { avatar: avatarSize, dot: dotSize } = sizeClasses[size];

  return (
    <div className={cn("relative inline-flex shrink-0", avatarSize, className)}>
      <Avatar className={cn("w-full h-full", avatarSize)}>
        <AvatarImage src={src || "/placeholder.svg"} alt={alt} />
        <AvatarFallback className="bg-[#F8FAFC] text-[#6B7280]">
          {fallback}
        </AvatarFallback>
      </Avatar>
      {isOnline && (
        <div
          className={cn(
            "absolute bottom-0 right-0 bg-[#22C55E] rounded-full ring-2 ring-white",
            dotSize
          )}
        />
      )}
    </div>
  );
}
