"use client";

import { cn } from "@/lib/utils";
import { useAppMode } from "@/components/providers/AppModeProvider";

export function ModeToggle() {
  const { mode, setMode, isHydrated } = useAppMode();

  if (!isHydrated) {
    // Skeleton while hydrating to prevent layout shift
    return (
      <div className="flex items-center p-0.5 rounded-full bg-slate-100 h-8 w-[120px]" />
    );
  }

  return (
    <div className="flex items-center p-0.5 rounded-full bg-slate-100">
      <button
        type="button"
        onClick={() => setMode("customer")}
        className={cn(
          "px-3 py-1 text-xs font-medium rounded-full transition-all",
          mode === "customer"
            ? "bg-white shadow-sm text-slate-900"
            : "text-slate-500 hover:text-slate-700"
        )}
      >
        고객
      </button>
      <button
        type="button"
        onClick={() => setMode("helper")}
        className={cn(
          "px-3 py-1 text-xs font-medium rounded-full transition-all",
          mode === "helper"
            ? "bg-white shadow-sm text-slate-900"
            : "text-slate-500 hover:text-slate-700"
        )}
      >
        도우미
      </button>
    </div>
  );
}
