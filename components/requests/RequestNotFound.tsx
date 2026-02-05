import Link from "next/link";
import { FileText } from "lucide-react";
import { PrimaryButton } from "@/components/ui-kit";

export function RequestNotFound() {
  return (
    <div className="w-full max-w-full flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-4">
        <FileText className="w-8 h-8 text-[#9CA3AF]" />
      </div>
      <h2 className="text-xl font-bold text-[#111827] mb-2">
        요청을 찾을 수 없어요
      </h2>
      <p className="text-sm text-[#6B7280] mb-6">
        삭제되었거나 존재하지 않는 요청입니다.
      </p>
      <Link href="/requests">
        <PrimaryButton>요청 목록으로</PrimaryButton>
      </Link>
    </div>
  );
}
