"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EvidenceUploader } from "@/components/disputes/EvidenceUploader";
import { PrimaryButton } from "@/components/ui-kit";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const disputeReasons = [
  { value: "no_show", label: "노쇼 (도우미가 나타나지 않음)" },
  { value: "incomplete", label: "업무 미이행 (작업 미완료)" },
  { value: "extra_charge", label: "추가요금 요구" },
  { value: "other", label: "기타" },
];

export default function DisputePage() {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    // Simulate submission
    setIsSubmitted(true);
  };

  const handleBack = () => {
    router.push("/orders/order_123");
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-full flex flex-col items-center justify-center p-8 min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-[#FEF3C7] flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10 text-[#92400E]" />
        </div>
        <h1 className="text-xl font-bold text-[#111827] mb-2">분쟁 접수 완료</h1>
        <p className="text-[#6B7280] text-center mb-6">
          분쟁이 접수되었습니다.
          <br />
          검토 후 24시간 내에 연락드리겠습니다.
        </p>
        <PrimaryButton onClick={handleBack} className="w-full max-w-xs">
          주문으로 돌아가기
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full pb-24">
      <div className="p-4 space-y-6">
        {/* Warning */}
        <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FECACA]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-[#991B1B]">분쟁 접수 안내</p>
              <p className="text-sm text-[#DC2626] mt-1">
                분쟁 접수 시 정산이 보류됩니다. 허위 분쟁 접수 시 불이익이 있을 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111827]">분쟁 사유</Label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger className="rounded-xl border-[#E5E7EB]">
              <SelectValue placeholder="사유를 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {disputeReasons.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111827]">상세 설명</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="분쟁 사유를 상세히 설명해주세요..."
            className="min-h-32 rounded-xl border-[#E5E7EB] resize-none"
          />
        </div>

        {/* Evidence */}
        <EvidenceUploader maxFiles={5} onFilesChange={setFiles} />

        {/* Info */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB]">
          <h3 className="font-medium text-[#111827] mb-2">분쟁 처리 절차</h3>
          <ol className="text-sm text-[#6B7280] space-y-1 list-decimal list-inside">
            <li>분쟁 접수 및 정산 보류</li>
            <li>증거자료 검토 (24시간 내)</li>
            <li>양측 의견 청취</li>
            <li>중재 결정 및 정산 처리</li>
          </ol>
        </div>
      </div>

      {/* Sticky Submit */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E5E7EB] pb-safe">
        <PrimaryButton
          onClick={handleSubmit}
          disabled={!reason || !description}
          className="w-full h-12 bg-[#EF4444] hover:bg-[#DC2626] disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF]"
        >
          분쟁 접수하기
        </PrimaryButton>
      </div>
    </div>
  );
}
