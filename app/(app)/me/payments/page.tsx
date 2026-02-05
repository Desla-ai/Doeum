"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton, SecondaryButton, EmptyState } from "@/components/ui-kit";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Building2, Plus, Info, Trash2 } from "lucide-react";

interface Card {
  id: string;
  name: string;
  last4: string;
  isDefault: boolean;
}

export default function PaymentsPage() {
  const { toast } = useToast();
  const [cards, setCards] = useState<Card[]>([]);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");

  const handleAddCard = () => {
    if (cardNumber.length < 16) return;

    const newCard: Card = {
      id: `card_${Date.now()}`,
      name: "내 카드",
      last4: cardNumber.slice(-4),
      isDefault: cards.length === 0,
    };

    setCards((prev) => [...prev, newCard]);
    setCardNumber("");
    setIsAddCardOpen(false);

    toast({
      title: "카드 추가됨",
      description: "새 카드가 등록되었습니다. (데모)",
    });
  };

  const handleDeleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    toast({
      title: "카드 삭제됨",
      description: "카드가 삭제되었습니다. (데모)",
    });
  };

  return (
    <div className="w-full max-w-full p-4 space-y-6">
      {/* Cards Section */}
      <div>
        <h2 className="text-lg font-bold text-[#111827] mb-3">카드</h2>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
          {cards.length === 0 ? (
            <div className="p-6 text-center">
              <CreditCard className="w-10 h-10 text-[#D1D5DB] mx-auto mb-2" />
              <p className="text-sm text-[#6B7280] mb-4">등록된 카드 없음</p>
              <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
                <DialogTrigger asChild>
                  <SecondaryButton size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    카드 추가
                  </SecondaryButton>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>카드 등록</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">카드 번호</Label>
                      <Input
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))
                        }
                        placeholder="0000 0000 0000 0000"
                        className="h-12 rounded-xl"
                      />
                      <p className="text-xs text-[#9CA3AF]">
                        * 실제 앱에서는 PG사 연동이 필요합니다 (데모)
                      </p>
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <SecondaryButton className="flex-1">취소</SecondaryButton>
                    </DialogClose>
                    <PrimaryButton
                      onClick={handleAddCard}
                      disabled={cardNumber.length < 16}
                      className="flex-1"
                    >
                      등록
                    </PrimaryButton>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="divide-y divide-[#E5E7EB]">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-[#6B7280]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#111827]">{card.name}</p>
                      <p className="text-sm text-[#6B7280]">
                        **** **** **** {card.last4}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCard(card.id)}
                    className="p-2 text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="p-4">
                <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8FAFC] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      카드 추가
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>카드 등록</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber2">카드 번호</Label>
                        <Input
                          id="cardNumber2"
                          value={cardNumber}
                          onChange={(e) =>
                            setCardNumber(
                              e.target.value.replace(/\D/g, "").slice(0, 16)
                            )
                          }
                          placeholder="0000 0000 0000 0000"
                          className="h-12 rounded-xl"
                        />
                      </div>
                    </div>
                    <DialogFooter className="gap-2">
                      <DialogClose asChild>
                        <SecondaryButton className="flex-1">취소</SecondaryButton>
                      </DialogClose>
                      <PrimaryButton
                        onClick={handleAddCard}
                        disabled={cardNumber.length < 16}
                        className="flex-1"
                      >
                        등록
                      </PrimaryButton>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Section */}
      <div>
        <h2 className="text-lg font-bold text-[#111827] mb-3">계좌</h2>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 text-center">
          <Building2 className="w-10 h-10 text-[#D1D5DB] mx-auto mb-2" />
          <p className="text-sm text-[#6B7280] mb-4">계좌 인증 필요</p>
          <Link href="/verify/account">
            <PrimaryButton size="sm">계좌 1원 인증</PrimaryButton>
          </Link>
        </div>
      </div>

      {/* Info Note */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F0FDF4] border border-[#22C55E]/20">
        <Info className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
        <p className="text-sm text-[#166534]">
          에스크로 결제는 주문 진행 단계에서 진행됩니다. 결제 수단은 해당
          시점에 선택할 수 있습니다. (데모)
        </p>
      </div>
    </div>
  );
}
