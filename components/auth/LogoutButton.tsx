"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/utils/supabase/browser";

export function LogoutButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogout = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        // 로그아웃이 실패해도 UX상 로그인 화면으로 보내는 선택을 할 수 있지만
        // 일단은 에러를 보여주는 게 디버깅에 유리함.
        console.error("Supabase signOut error:", error);
      }

      // Optionally reset app mode to customer
      if (typeof window !== "undefined") {
        localStorage.removeItem("app_mode");
      }

      // Close dialog
      setOpen(false);

      // Navigate to login
      router.replace("/login");

      // Force re-render (App Router 캐시 갱신)
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-[#E5E7EB] bg-white text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>로그아웃</span>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-xs mx-auto rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            로그아웃할까요?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            다시 로그인하면 서비스를 이용할 수 있어요.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-row gap-3 sm:gap-3">
          <AlertDialogCancel
            className="flex-1 mt-0 h-11 rounded-xl border-[#E5E7EB]"
            disabled={isSigningOut}
          >
            취소
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleLogout}
            className="flex-1 h-11 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white"
            disabled={isSigningOut}
          >
            {isSigningOut ? "로그아웃 중..." : "로그아웃"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
