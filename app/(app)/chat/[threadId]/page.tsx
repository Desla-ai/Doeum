"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChatThread, type Message, type SendPayload } from "@/components/chat/ChatThread";
import { ShoppingBag } from "lucide-react";
import { formatKSTTime } from "@/lib/time/krTime";

const mockMessages: Message[] = [
  {
    id: "1",
    content: "안녕하세요! 청소 요청 관련해서 문의드립니다.",
    senderId: "user_123",
    senderName: "나",
    timestamp: "오전 10:00",
    isMe: true,
  },
  {
    id: "2",
    content: "안녕하세요! 네, 무엇이 궁금하신가요?",
    senderId: "helper_123",
    senderName: "김영희",
    timestamp: "오전 10:02",
    isMe: false,
  },
  {
    id: "3",
    content: "베란다 청소도 같이 해주실 수 있나요?",
    senderId: "user_123",
    senderName: "나",
    timestamp: "오전 10:03",
    isMe: true,
  },
  {
    id: "4",
    content: "네, 물론이죠! 베란다도 함께 깔끔하게 청소해드릴게요. 참고로 청소 전 상태 사진 보내드릴게요.",
    senderId: "helper_123",
    senderName: "김영희",
    timestamp: "오전 10:05",
    isMe: false,
  },
  {
    id: "5",
    imageUrl: "/placeholder.svg?height=200&width=300",
    senderId: "helper_123",
    senderName: "김영희",
    timestamp: "오전 10:06",
    isMe: false,
  },
  {
    id: "6",
    content: "감사합니다! 그럼 내일 10시에 뵐게요.",
    senderId: "user_123",
    senderName: "나",
    timestamp: "오전 10:07",
    isMe: true,
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState(mockMessages);

  const handleSend = (payload: SendPayload) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: payload.content,
      imageUrl: payload.imageUrl,
      senderId: "user_123",
      senderName: "나",
      timestamp: formatKSTTime(new Date()),
      isMe: true,
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full max-w-full overflow-hidden">
      {/* Order Context Banner - sticky top within page container */}
      <div className="sticky top-0 z-20 shrink-0 bg-white/95 backdrop-blur border-b border-[#E5E7EB]">
        <div className="p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-[#6B7280] min-w-0">
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span className="truncate">청소 요청 · 2024.02.15 오전 10:00</span>
            </div>
            <Link href="/orders/order_123" className="shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#22C55E] hover:text-[#16A34A] hover:bg-[#F0FDF4] bg-transparent"
              >
                주문 보기
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Chat Thread */}
      <ChatThread messages={messages} onSend={handleSend} />
    </div>
  );
}
