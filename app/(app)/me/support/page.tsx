"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PrimaryButton, SecondaryButton } from "@/components/ui-kit";
import { useToast } from "@/hooks/use-toast";
import {
  HelpCircle,
  MessageSquare,
  FileText,
  ChevronRight,
} from "lucide-react";

const faqItems = [
  {
    question: "서비스 이용 방법이 궁금해요",
    answer:
      "도움 앱에서 요청을 올리거나 도우미로 등록하여 서비스를 이용할 수 있습니다. 고객 모드에서는 필요한 서비스를 요청하고, 도우미 모드에서는 다른 사람의 요청에 지원할 수 있습니다.",
  },
  {
    question: "결제는 어떻게 이루어지나요?",
    answer:
      "도움은 에스크로 결제 방식을 사용합니다. 고객이 결제하면 금액이 안전하게 보관되고, 서비스 완료 후 도우미에게 정산됩니다. 분쟁 발생 시 중재를 통해 해결됩니다.",
  },
  {
    question: "매칭점수는 어떻게 계산되나요?",
    answer:
      "매칭점수는 완료 건수, 응답 속도, 재요청률, 노쇼율, 분쟁율 등을 종합하여 산정됩니다. 점수가 높을수록 더 많은 요청을 받을 수 있습니다.",
  },
  {
    question: "취소 및 환불 정책이 궁금해요",
    answer:
      "서비스 시작 전 취소 시 전액 환불됩니다. 서비스 시작 후에는 진행 상황에 따라 부분 환불이 가능하며, 분쟁 접수를 통해 처리됩니다.",
  },
  {
    question: "도우미로 등록하려면 어떻게 해야 하나요?",
    answer:
      "앱 상단의 모드 전환 버튼을 눌러 도우미 모드로 전환한 후, 계좌 1원 인증을 완료하면 도우미로 활동할 수 있습니다.",
  },
];

export default function SupportPage() {
  const { toast } = useToast();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitInquiry = async () => {
    if (!category || !message.trim()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsInquiryOpen(false);
    setCategory("");
    setMessage("");

    toast({
      title: "문의가 접수됐어요",
      description: "빠른 시일 내에 답변 드리겠습니다. (데모)",
    });
  };

  return (
    <div className="w-full max-w-full p-4 space-y-4">
      {/* FAQ Card */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-[#E5E7EB]">
          <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-[#22C55E]" />
          </div>
          <div>
            <h2 className="font-bold text-[#111827]">자주 묻는 질문</h2>
            <p className="text-xs text-[#6B7280]">궁금한 점을 빠르게 해결하세요</p>
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-[#E5E7EB] last:border-b-0"
            >
              <AccordionTrigger className="px-4 py-3 text-left text-sm text-[#111827] hover:no-underline hover:bg-[#F8FAFC] [&[data-state=open]]:bg-[#F8FAFC]">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-sm text-[#6B7280]">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Contact Card */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
        <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="w-full flex items-center gap-3 p-4 hover:bg-[#F8FAFC] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div className="flex-1 text-left">
                <h2 className="font-bold text-[#111827]">문의하기</h2>
                <p className="text-xs text-[#6B7280]">
                  FAQ에서 해결되지 않은 문제를 문의하세요
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>문의하기</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">문의 유형</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="유형을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">서비스 이용</SelectItem>
                    <SelectItem value="payment">결제/환불</SelectItem>
                    <SelectItem value="account">계정</SelectItem>
                    <SelectItem value="bug">오류 신고</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">문의 내용</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="문의 내용을 자세히 입력해주세요"
                  rows={5}
                  className="rounded-xl resize-none"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <SecondaryButton className="flex-1">취소</SecondaryButton>
              </DialogClose>
              <PrimaryButton
                onClick={handleSubmitInquiry}
                disabled={!category || !message.trim() || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "전송 중..." : "문의하기"}
              </PrimaryButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Legal Links Card */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-[#E5E7EB]">
          <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#6B7280]" />
          </div>
          <div>
            <h2 className="font-bold text-[#111827]">약관 및 정책</h2>
            <p className="text-xs text-[#6B7280]">서비스 이용 관련 약관</p>
          </div>
        </div>
        <div className="divide-y divide-[#E5E7EB]">
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center justify-between p-4 hover:bg-[#F8FAFC] transition-colors"
              >
                <span className="text-sm text-[#374151]">이용약관</span>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>이용약관</DialogTitle>
              </DialogHeader>
              <div className="text-sm text-[#6B7280] space-y-4 py-4">
                <p>
                  본 약관은 도움 서비스(이하 "서비스")의 이용조건 및 절차, 회사와
                  회원 간의 권리, 의무 및 책임사항 등을 규정합니다.
                </p>
                <p>
                  제1조 (목적): 본 약관은 회사가 제공하는 서비스의 이용과 관련하여
                  회사와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로
                  합니다.
                </p>
                <p className="text-xs text-[#9CA3AF]">
                  * 데모용 약관 텍스트입니다.
                </p>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center justify-between p-4 hover:bg-[#F8FAFC] transition-colors"
              >
                <span className="text-sm text-[#374151]">개인정보처리방침</span>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>개인정보처리방침</DialogTitle>
              </DialogHeader>
              <div className="text-sm text-[#6B7280] space-y-4 py-4">
                <p>
                  회사는 이용자의 개인정보를 중요시하며, 개인정보보호법을
                  준수합니다.
                </p>
                <p>
                  제1조 (수집하는 개인정보): 회사는 서비스 제공을 위해 필요한
                  최소한의 개인정보를 수집합니다.
                </p>
                <p className="text-xs text-[#9CA3AF]">
                  * 데모용 개인정보처리방침 텍스트입니다.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
