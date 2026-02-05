"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TossWidgetSlot } from "./TossWidgetSlot";
import { CreditCard, Building2, Landmark } from "lucide-react";

interface PaymentMethodTabsProps {
  onMethodChange?: (method: string) => void;
}

export function PaymentMethodTabs({ onMethodChange }: PaymentMethodTabsProps) {
  const [method, setMethod] = useState("card");

  const handleMethodChange = (value: string) => {
    setMethod(value);
    onMethodChange?.(value);
  };

  return (
    <Tabs value={method} onValueChange={handleMethodChange} className="w-full">
      <TabsList className="w-full h-12 bg-[#F8FAFC] rounded-xl p-1">
        <TabsTrigger
          value="card"
          className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          카드
        </TabsTrigger>
        <TabsTrigger
          value="transfer"
          className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <Building2 className="w-4 h-4 mr-2" />
          계좌이체
        </TabsTrigger>
        <TabsTrigger
          value="virtual"
          className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <Landmark className="w-4 h-4 mr-2" />
          가상계좌
        </TabsTrigger>
      </TabsList>

      <TabsContent value="card" className="mt-4">
        <TossWidgetSlot />
      </TabsContent>

      <TabsContent value="transfer" className="mt-4">
        <TossWidgetSlot />
      </TabsContent>

      <TabsContent value="virtual" className="mt-4">
        <TossWidgetSlot />
      </TabsContent>
    </Tabs>
  );
}
