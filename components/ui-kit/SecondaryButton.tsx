"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SecondaryButton({
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "border-[#E5E7EB] text-[#111827] hover:bg-[#F8FAFC] font-medium rounded-xl",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
