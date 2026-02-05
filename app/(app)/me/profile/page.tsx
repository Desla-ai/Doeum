"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/ui-kit";
import { useToast } from "@/hooks/use-toast";
import { Camera } from "lucide-react";

export default function ProfileEditPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState("/placeholder.svg");
  const [nickname, setNickname] = useState("홍길동");
  const [bio, setBio] = useState("");

  const handleAvatarClick = () => {
    // Mock: In real implementation, this would open file picker
    // For demo, just show a toast
    toast({
      title: "아바타 변경",
      description: "이미지 업로드 기능은 데모에서 지원되지 않습니다.",
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Mock save delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);

    toast({
      title: "저장됐어요",
      description: "프로필이 업데이트되었습니다. (데모)",
    });

    router.back();
  };

  return (
    <div className="w-full max-w-full p-4 space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={avatar || "/placeholder.svg"} alt="프로필" />
            <AvatarFallback className="text-2xl">홍길</AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={handleAvatarClick}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center text-white shadow-md hover:bg-[#16A34A] transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-2 text-xs text-[#6B7280]">탭하여 사진 변경</p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Nickname */}
        <div className="space-y-2">
          <Label htmlFor="nickname" className="text-[#374151]">
            닉네임
          </Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            className="h-12 rounded-xl border-[#E5E7EB] focus:border-[#22C55E] focus:ring-[#22C55E]"
          />
        </div>

        {/* Email (read-only) */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#374151]">
            이메일
          </Label>
          <Input
            id="email"
            value="hong@example.com"
            readOnly
            disabled
            className="h-12 rounded-xl border-[#E5E7EB] bg-[#F8FAFC] text-[#9CA3AF]"
          />
          <p className="text-xs text-[#9CA3AF]">이메일은 변경할 수 없습니다</p>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-[#374151]">
            소개 <span className="text-[#9CA3AF]">(선택)</span>
          </Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="자신을 소개해주세요"
            rows={4}
            className="rounded-xl border-[#E5E7EB] focus:border-[#22C55E] focus:ring-[#22C55E] resize-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <PrimaryButton
        onClick={handleSave}
        disabled={isLoading || !nickname.trim()}
        className="w-full h-12"
      >
        {isLoading ? "저장 중..." : "저장하기"}
      </PrimaryButton>
    </div>
  );
}
