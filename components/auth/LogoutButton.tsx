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
import { useAuth } from "@/hooks/useAuth";

export function LogoutButton() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    // Optionally reset app mode to customer
    if (typeof window !== "undefined") {
      localStorage.removeItem("app_mode");
    }
    setOpen(false);
    router.replace("/login");
    router.refresh();
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
          <AlertDialogCancel className="flex-1 mt-0 h-11 rounded-xl border-[#E5E7EB]">
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            className="flex-1 h-11 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white"
          >
            로그아웃
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
