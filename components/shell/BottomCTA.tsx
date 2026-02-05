"use client";

import React from "react";

interface BottomCTAProps {
  children: React.ReactNode;
}

export function BottomCTA({ children }: BottomCTAProps) {
  return (
    <div
      className="fixed inset-x-0 z-40 w-full max-w-full overflow-x-hidden bg-white/95 backdrop-blur border-t border-[#E5E7EB] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
      style={{
        bottom: "calc(var(--bottom-tabs-h) + var(--safe-bottom))",
        paddingBottom: "var(--safe-bottom)",
      }}
    >
      <div className="p-4 w-full max-w-full">{children}</div>
    </div>
  );
}
