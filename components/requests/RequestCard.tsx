"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, MoneyKRW, SecondaryButton } from "@/components/ui-kit";
import { MapPin, Calendar, Clock } from "lucide-react";

export interface RequestData {
  id: string;
  category: string;
  status:
    | "posted"
    | "assigned"
    | "escrow_held"
    | "in_progress"
    | "done_by_helper"
    | "confirmed_by_customer"
    | "auto_confirmed"
    | "paid_out"
    | "disputed"
    | "cancelled";
  datetime: string;
  time: string;
  location: string;
  price: number;
  description?: string;
  photoUrl?: string;
}

interface RequestCardProps {
  request: RequestData;
  isHelper?: boolean;
}

export function RequestCard({ request, isHelper = false }: RequestCardProps) {
  return (
    <div className="w-full max-w-full p-4 rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
      {/* Header: Status badges + Date */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={request.status} />
          <Badge
            variant="outline"
            className="bg-[#F0FDF4] text-[#166534] border-[#BBF7D0] text-xs rounded-lg"
          >
            {request.category}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#6B7280] shrink-0">
          <Calendar className="w-3 h-3 shrink-0" />
          <span>{request.datetime}</span>
        </div>
      </div>

      {/* Content: Grid layout with min-w-0 for text truncation */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
        <div className="min-w-0">
          {request.description && (
            <p className="text-sm text-[#111827] mb-2 line-clamp-2">
              {request.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6B7280] mb-3">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{request.location}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3 shrink-0" />
              <span>{request.time}</span>
            </div>
          </div>

          <div className="text-[#111827]">
            <MoneyKRW amount={request.price} className="text-lg font-bold" />
            <span className="text-xs text-[#6B7280] ml-1">/건당</span>
          </div>
        </div>

        {request.photoUrl && (
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
            <Image
              src={request.photoUrl || "/placeholder.svg"}
              alt="요청 사진"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Link href={`/requests/${request.id}`} className="flex-1 min-w-[120px]">
          <SecondaryButton className="w-full">상세 보기</SecondaryButton>
        </Link>
        {isHelper && request.status === "posted" && (
          <Link href={`/requests/${request.id}?apply=1`} className="flex-1 min-w-[120px]">
            <SecondaryButton className="w-full border-[#22C55E] text-[#22C55E] hover:bg-[#F0FDF4]">
              지원하기
            </SecondaryButton>
          </Link>
        )}
      </div>
    </div>
  );
}
