"use client";

import React from "react"

import Link from "next/link";
import { Plus, FileText, ClipboardList, User } from "lucide-react";
import { useAppMode } from "@/components/providers/AppModeProvider";

interface QuickAction {
  label: string;
  href: string;
  icon: React.ReactNode;
  isPrimary?: boolean;
}

export function QuickActions() {
  const { isCustomer } = useAppMode();

  // Customer mode: 요청 올리기, 일해요 보기, 내역 보기
  // Helper mode: 구해요 보기, 내역 보기, 내정보
  const actions: QuickAction[] = isCustomer
    ? [
        {
          label: "요청 올리기",
          href: "/requests/new",
          icon: <Plus className="w-5 h-5 text-white" />,
          isPrimary: true,
        },
        {
          label: "일해요",
          href: "/requests",
          icon: <FileText className="w-5 h-5 text-[#6B7280]" />,
        },
        {
          label: "내역",
          href: "/orders",
          icon: <ClipboardList className="w-5 h-5 text-[#6B7280]" />,
        },
      ]
    : [
        {
          label: "구해요",
          href: "/requests",
          icon: <FileText className="w-5 h-5 text-[#6B7280]" />,
        },
        {
          label: "내역",
          href: "/orders",
          icon: <ClipboardList className="w-5 h-5 text-[#6B7280]" />,
        },
        {
          label: "내정보",
          href: "/me",
          icon: <User className="w-5 h-5 text-[#6B7280]" />,
        },
      ];

  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4">
      <h3 className="font-medium text-[#111827] mb-3">빠른 액션</h3>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className="block">
            <div
              className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${
                action.isPrimary
                  ? "bg-[#F0FDF4] hover:bg-[#DCFCE7]"
                  : "bg-[#F8FAFC] hover:bg-[#F1F5F9]"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  action.isPrimary ? "bg-[#22C55E]" : "bg-[#E5E7EB]"
                }`}
              >
                {action.icon}
              </div>
              <span
                className={`text-xs font-medium text-center ${
                  action.isPrimary ? "text-[#166534]" : "text-[#374151]"
                }`}
              >
                {action.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
