"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton, SecondaryButton, EmptyState } from "@/components/ui-kit";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Plus, Star, Trash2 } from "lucide-react";

interface Address {
  id: string;
  label: string;
  address: string;
  detail: string;
  isDefault: boolean;
}

const initialAddresses: Address[] = [
  {
    id: "addr_1",
    label: "집",
    address: "서울 강남구 테헤란로 152",
    detail: "역삼빌딩 3층",
    isDefault: true,
  },
  {
    id: "addr_2",
    label: "회사",
    address: "서울 서초구 강남대로 373",
    detail: "서초타워 15층",
    isDefault: false,
  },
];

export default function AddressesPage() {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newDetail, setNewDetail] = useState("");

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    toast({
      title: "기본 주소 설정됨",
      description: "기본 주소가 변경되었습니다. (데모)",
    });
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    toast({
      title: "주소 삭제됨",
      description: "주소가 삭제되었습니다. (데모)",
    });
  };

  const handleAddAddress = () => {
    if (!newLabel.trim() || !newAddress.trim()) return;

    const newAddr: Address = {
      id: `addr_${Date.now()}`,
      label: newLabel,
      address: newAddress,
      detail: newDetail,
      isDefault: addresses.length === 0,
    };

    setAddresses((prev) => [...prev, newAddr]);
    setNewLabel("");
    setNewAddress("");
    setNewDetail("");
    setIsAddDialogOpen(false);

    toast({
      title: "주소 추가됨",
      description: "새 주소가 추가되었습니다. (데모)",
    });
  };

  return (
    <div className="w-full max-w-full p-4 space-y-4">
      {/* Add Address Button */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <SecondaryButton className="w-full h-12">
            <Plus className="w-4 h-4 mr-2" />
            주소 추가
          </SecondaryButton>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#111827]">새 주소 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="label" className="text-[#374151]">
                주소 이름
              </Label>
              <Input
                id="label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="예: 집, 회사"
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-[#374151]">
                주소
              </Label>
              <Input
                id="address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="주소를 입력하세요"
                className="h-12 rounded-xl"
              />
              <p className="text-xs text-[#9CA3AF]">
                * 실제 앱에서는 주소 검색 API가 연동됩니다
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="detail" className="text-[#374151]">
                상세주소 <span className="text-[#9CA3AF]">(선택)</span>
              </Label>
              <Input
                id="detail"
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
                placeholder="상세주소를 입력하세요"
                className="h-12 rounded-xl"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <SecondaryButton className="flex-1">취소</SecondaryButton>
            </DialogClose>
            <PrimaryButton
              onClick={handleAddAddress}
              disabled={!newLabel.trim() || !newAddress.trim()}
              className="flex-1"
            >
              추가
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Address List */}
      {addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="등록된 주소가 없어요"
          description="주소를 추가하면 요청 시 빠르게 선택할 수 있어요"
        />
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-4 rounded-2xl border border-[#E5E7EB] bg-white"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <MapPin className="w-5 h-5 text-[#6B7280] mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-[#111827]">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-[#F0FDF4] text-[#22C55E] rounded-full">
                          기본
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#374151] truncate">
                      {addr.address}
                    </p>
                    {addr.detail && (
                      <p className="text-sm text-[#6B7280] truncate">
                        {addr.detail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E5E7EB]">
                {!addr.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#22C55E] hover:bg-[#F0FDF4] rounded-lg transition-colors"
                  >
                    <Star className="w-3 h-3" />
                    기본 주소로 설정
                  </button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors ml-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                      삭제
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>주소를 삭제할까요?</AlertDialogTitle>
                      <AlertDialogDescription>
                        '{addr.label}' 주소가 삭제됩니다. 이 작업은 되돌릴 수
                        없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">
                        취소
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(addr.id)}
                        className="bg-[#EF4444] hover:bg-[#DC2626] rounded-xl"
                      >
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
