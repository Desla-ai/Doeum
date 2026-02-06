"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PrimaryButton, SecondaryButton } from "@/components/ui-kit";
import { useToast } from "@/hooks/use-toast";
import { Camera, RefreshCw } from "lucide-react";

type Me = { id: string; email: string | null };
type Profile = { id: string; name: string; region_sigungu: string; region_dong: string };

export default function ProfileEditPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [me, setMe] = useState<Me | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [avatar] = useState("/placeholder.svg");
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");

  const load = async () => {
    setIsLoading(true);
    try {
      const [meRes, profRes] = await Promise.all([fetch("/api/me"), fetch("/api/profiles/me")]);
      const meJson = await meRes.json().catch(() => ({}));
      const profJson = await profRes.json().catch(() => ({}));

      if (meRes.ok) setMe(meJson.data);
      if (profRes.ok) {
        setProfile(profJson.data);
        setNickname(profJson.data?.name ?? "");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAvatarClick = () => {
    toast({
      title: "준비 중",
      description: "이미지 업로드는 MVP 다음 단계에서 지원합니다.",
    });
  };

  const handleSave = async () => {
    if (!nickname.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/profiles/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nickname.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error?.message || "저장 실패");
      setProfile(json.data);

      toast({ title: "저장됐어요", description: "프로필이 업데이트되었습니다." });
      router.back();
    } catch (e: any) {
      console.error(e);
      toast({
        title: "저장 실패",
        description: e?.message || "잠시 후 다시 시도해 주세요.",
        variant: "destructive" as any,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full p-4 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6B7280]">
          {profile ? `id: ${profile.id}` : "프로필 로딩 중..."}
        </p>
        <SecondaryButton onClick={load} disabled={isLoading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          새로고침
        </SecondaryButton>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={avatar || "/placeholder.svg"} alt="프로필" />
            <AvatarFallback className="text-2xl">{(nickname || "사용").slice(0, 2)}</AvatarFallback>
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

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nickname" className="text-[#374151]">닉네임</Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            className="h-12 rounded-xl border-[#E5E7EB] focus:border-[#22C55E] focus:ring-[#22C55E]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#374151]">이메일</Label>
          <Input
            id="email"
            value={me?.email ?? ""}
            readOnly
            disabled
            placeholder="(로그인 후 표시)"
            className="h-12 rounded-xl border-[#E5E7EB] bg-[#F8FAFC] text-[#9CA3AF]"
          />
          <p className="text-xs text-[#9CA3AF]">이메일은 변경할 수 없습니다</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-[#374151]">
            소개 <span className="text-[#9CA3AF]">(선택)</span>
          </Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="자신을 소개해주세요 (MVP에서는 DB 저장 생략)"
            rows={4}
            className="rounded-xl border-[#E5E7EB] focus:border-[#22C55E] focus:ring-[#22C55E] resize-none"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <SecondaryButton onClick={() => router.back()} className="flex-1 h-12" disabled={isLoading}>
          취소
        </SecondaryButton>
        <PrimaryButton onClick={handleSave} disabled={isLoading || !nickname.trim()} className="flex-1 h-12">
          {isLoading ? "저장 중..." : "저장하기"}
        </PrimaryButton>
      </div>
    </div>
  );
}
