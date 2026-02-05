"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AgreementItem {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
}

interface AgreementCheckboxProps {
  items: AgreementItem[];
  onChange: (id: string, checked: boolean) => void;
}

export function AgreementCheckbox({ items, onChange }: AgreementCheckboxProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-3">
          <Checkbox
            id={item.id}
            checked={item.checked}
            onCheckedChange={(checked) =>
              onChange(item.id, checked as boolean)
            }
            className="mt-0.5 border-[#E5E7EB] data-[state=checked]:bg-[#22C55E] data-[state=checked]:border-[#22C55E]"
          />
          <Label
            htmlFor={item.id}
            className="text-sm text-[#374151] cursor-pointer leading-tight"
          >
            <span className="text-[#9CA3AF]">
              ({item.required ? "필수" : "선택"})
            </span>{" "}
            {item.label}
          </Label>
        </div>
      ))}
    </div>
  );
}
