"use client";

import React from "react"

import { BrandLogo } from "@/components/brand/BrandLogo";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  showLogo?: boolean;
}

export function AuthCard({
  children,
  title,
  description,
  className,
  showLogo = true,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-full p-6 rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden",
        className
      )}
    >
      {showLogo && (
        <div className="flex justify-center mb-6">
          <BrandLogo size={48} showWordmark />
        </div>
      )}

      {title && (
        <h1 className="text-xl font-bold text-[#111827] text-center mb-2">
          {title}
        </h1>
      )}

      {description && (
        <p className="text-sm text-[#6B7280] text-center mb-6">{description}</p>
      )}

      {children}
    </div>
  );
}
