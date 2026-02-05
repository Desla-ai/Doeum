"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PrimaryButton({
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <Button
      className={cn(
        "bg-[#22C55E] hover:bg-[#16A34A] text-white font-medium rounded-xl",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
