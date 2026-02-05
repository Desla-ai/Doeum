"use client";

interface AuthDividerProps {
  text?: string;
}

export function AuthDivider({ text = "또는" }: AuthDividerProps) {
  return (
    <div className="relative flex items-center my-6">
      <div className="flex-1 border-t border-[#E5E7EB]" />
      <span className="px-4 text-xs text-[#9CA3AF] bg-white">{text}</span>
      <div className="flex-1 border-t border-[#E5E7EB]" />
    </div>
  );
}
