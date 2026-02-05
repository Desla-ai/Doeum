"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PaymentMethodTabs } from "@/components/payments/PaymentMethodTabs";
import {
  MoneyKRW,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui-kit";
import { Check, Copy, AlertCircle, CheckCircle2 } from "lucide-react";

const mockOrder = {
  id: "order_123",
  category: "청소",
  datetime: "2024.02.15 오전 10:00",
  location: "서울 강남구 역삼동",
  price: 50000,
  platformFee: 2000,
  totalPrice: 52000,
};

const mockVirtualAccount = {
  bank: "신한은행",
  accountNumber: "110-123-456789",
  dueDate: "2024.02.15 23:59",
  depositor: "집사(주)",
};

type PaymentState = "pending" | "virtual_issued" | "success" | "failed";

export default function CheckoutPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>("pending");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(mockVirtualAccount.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayment = () => {
    // Simulate payment
    if (paymentMethod === "virtual") {
      setPaymentState("virtual_issued");
    } else {
      // Simulate success
      setTimeout(() => {
        setPaymentState("success");
      }, 1500);
    }
  };

  const handleComplete = () => {
    router.push("/orders/order_123");
  };

  // Success State
  if (paymentState === "success") {
    return (
      <div className="w-full max-w-full flex flex-col items-center justify-center p-8 min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10 text-[#22C55E]" />
        </div>
        <h1 className="text-xl font-bold text-[#111827] mb-2">결제 완료</h1>
        <p className="text-[#6B7280] text-center mb-6">
          결제가 성공적으로 완료되었습니다.
          <br />
          도우미가 작업을 시작하면 알림을 보내드릴게요.
        </p>
        <PrimaryButton onClick={handleComplete} className="w-full max-w-xs">
          주문 상세 보기
        </PrimaryButton>
      </div>
    );
  }

  // Failed State
  if (paymentState === "failed") {
    return (
      <div className="w-full max-w-full flex flex-col items-center justify-center p-8 min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-[#FEF2F2] flex items-center justify-center mb-4">
          <AlertCircle className="w-10 h-10 text-[#EF4444]" />
        </div>
        <h1 className="text-xl font-bold text-[#111827] mb-2">결제 실패</h1>
        <p className="text-[#6B7280] text-center mb-6">
          결제 처리 중 문제가 발생했습니다.
          <br />
          다시 시도해주세요.
        </p>
        <PrimaryButton
          onClick={() => setPaymentState("pending")}
          className="w-full max-w-xs"
        >
          다시 시도
        </PrimaryButton>
      </div>
    );
  }

  // Virtual Account Issued State
  if (paymentState === "virtual_issued") {
    return (
      <div className="w-full max-w-full pb-24">
        <div className="p-4 space-y-4">
          <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0]">
            <div className="flex items-center gap-2 text-[#166534] mb-2">
              <Check className="w-5 h-5" />
              <span className="font-medium">가상계좌 발급 완료</span>
            </div>
            <p className="text-sm text-[#6B7280]">
              아래 계좌로 입금해주세요. 입금 확인 후 자동으로 결제가 완료됩니다.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white space-y-4">
            <div>
              <p className="text-sm text-[#6B7280]">은행</p>
              <p className="font-medium text-[#111827]">{mockVirtualAccount.bank}</p>
            </div>

            <div>
              <p className="text-sm text-[#6B7280]">계좌번호</p>
              <div className="flex items-center justify-between">
                <p className="font-medium text-[#111827] text-lg">
                  {mockVirtualAccount.accountNumber}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="text-[#6B7280] hover:text-[#111827]"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm text-[#6B7280]">예금주</p>
              <p className="font-medium text-[#111827]">
                {mockVirtualAccount.depositor}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#6B7280]">입금 기한</p>
              <p className="font-medium text-[#EF4444]">
                {mockVirtualAccount.dueDate}
              </p>
            </div>

            <div className="pt-2 border-t border-[#E5E7EB]">
              <p className="text-sm text-[#6B7280]">입금 금액</p>
              <MoneyKRW
                amount={mockOrder.totalPrice}
                className="text-xl font-bold text-[#111827]"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A]">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-[#92400E] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#92400E]">유의사항</p>
                <ul className="text-sm text-[#A16207] mt-1 space-y-0.5">
                  <li>• 입금자명이 다르면 입금 확인이 지연될 수 있어요</li>
                  <li>• 입금 기한 내 입금하지 않으면 주문이 취소돼요</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E5E7EB] pb-safe">
          <SecondaryButton onClick={handleComplete} className="w-full h-12">
            주문 상세로 돌아가기
          </SecondaryButton>
        </div>
      </div>
    );
  }

  // Default Pending State
  return (
    <div className="w-full max-w-full pb-24">
      <div className="p-4 space-y-4">
        {/* Order Summary */}
        <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white">
          <h3 className="font-medium text-[#111827] mb-3">주문 요약</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6B7280]">{mockOrder.category}</span>
              <span className="text-[#111827]">{mockOrder.datetime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">위치</span>
              <span className="text-[#111827]">{mockOrder.location}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <h3 className="font-medium text-[#111827]">결제 수단</h3>
          <PaymentMethodTabs onMethodChange={setPaymentMethod} />
        </div>

        {/* Price Breakdown */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#6B7280]">서비스 금액</span>
            <MoneyKRW amount={mockOrder.price} className="text-[#111827]" />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#6B7280]">플랫폼 수수료</span>
            <MoneyKRW amount={mockOrder.platformFee} className="text-[#111827]" />
          </div>
          <div className="border-t border-[#E5E7EB] pt-2 flex justify-between">
            <span className="font-medium text-[#111827]">총 결제금액</span>
            <MoneyKRW
              amount={mockOrder.totalPrice}
              className="text-lg font-bold text-[#22C55E]"
            />
          </div>
        </div>

        {/* Escrow Agreement */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB]">
          <div className="flex items-start gap-3">
            <Checkbox
              id="escrow"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-0.5 data-[state=checked]:bg-[#22C55E] data-[state=checked]:border-[#22C55E]"
            />
            <Label htmlFor="escrow" className="text-sm text-[#374151] leading-relaxed cursor-pointer">
              에스크로 결제에 동의합니다. 결제 금액은 서비스 완료 후 도우미에게 정산됩니다. 서비스에 문제가 있을 경우 분쟁을 접수할 수 있습니다.
            </Label>
          </div>
        </div>

        {/* Toss Integration Note */}
        <p className="text-xs text-center text-[#9CA3AF]">
          결제는 토스페이먼츠를 통해 안전하게 처리됩니다
        </p>
      </div>

      {/* Sticky Pay Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E5E7EB] pb-safe">
        <PrimaryButton
          onClick={handlePayment}
          disabled={!agreed}
          className="w-full h-12 text-base disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF]"
        >
          <MoneyKRW amount={mockOrder.totalPrice} showUnit={false} className="text-white" />
          <span className="ml-1">원 결제하기</span>
        </PrimaryButton>
      </div>
    </div>
  );
}
