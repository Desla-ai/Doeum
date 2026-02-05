import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh w-full max-w-full overflow-x-hidden overflow-y-auto no-scrollbar bg-[#F8FAFC]">
      <div className="min-h-dvh flex items-center justify-center">
        <div className="mx-auto w-full max-w-sm px-4 py-10">{children}</div>
      </div>
    </div>
  );
}
