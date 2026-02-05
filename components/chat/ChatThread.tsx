"use client";

import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Send, ImagePlus, X } from "lucide-react";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  isMe: boolean;
  content?: string;      // Text message
  imageUrl?: string;     // Local objectURL or image path
}

export interface SendPayload {
  content?: string;
  imageUrl?: string;
}

interface ChatThreadProps {
  messages: Message[];
  onSend?: (payload: SendPayload) => void;
}

export function ChatThread({ messages, onSend }: ChatThreadProps) {
  const [input, setInput] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clean up objectURL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (selectedImageUrl) {
        URL.revokeObjectURL(selectedImageUrl);
      }
    };
  }, [selectedImageUrl]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      // Revoke previous URL if exists
      if (selectedImageUrl) {
        URL.revokeObjectURL(selectedImageUrl);
      }
      const url = URL.createObjectURL(file);
      setSelectedImageFile(file);
      setSelectedImageUrl(url);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    if (selectedImageUrl) {
      URL.revokeObjectURL(selectedImageUrl);
    }
    setSelectedImageFile(null);
    setSelectedImageUrl(null);
  };

  const handleSend = () => {
    const hasText = input.trim().length > 0;
    const hasImage = selectedImageUrl !== null;

    if (!hasText && !hasImage) return;

    // Send message
    onSend?.({
      content: hasText ? input.trim() : undefined,
      imageUrl: hasImage ? selectedImageUrl : undefined,
    });

    // Clear inputs (don't revoke URL since it's now in the message)
    setInput("");
    setSelectedImageFile(null);
    setSelectedImageUrl(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openAttachmentPicker = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const canSend = input.trim().length > 0 || selectedImageUrl !== null;

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full max-w-full overflow-hidden">
      {/* Messages - only this area scrolls, extra bottom padding for composer + BottomTabs */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar p-4 space-y-4 pb-[200px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.isMe ? "flex-row-reverse" : ""}`}
          >
            {!message.isMe && (
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={message.senderAvatar || "/placeholder.svg"} alt={message.senderName} />
                <AvatarFallback className="bg-[#F8FAFC] text-[#6B7280] text-xs">
                  {message.senderName.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={`max-w-[70%] ${message.isMe ? "items-end" : "items-start"}`}
            >
              {!message.isMe && (
                <span className="text-xs text-[#6B7280] mb-1 block">
                  {message.senderName}
                </span>
              )}
              
              {/* Text content */}
              {message.content && (
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.isMe
                      ? "bg-[#22C55E] text-white rounded-br-md"
                      : "bg-[#F8FAFC] text-[#111827] rounded-bl-md"
                  } ${message.imageUrl ? "mb-2" : ""}`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              )}

              {/* Image content */}
              {message.imageUrl && (
                <div
                  className={`rounded-2xl overflow-hidden cursor-pointer ${
                    message.isMe ? "rounded-br-md" : "rounded-bl-md"
                  }`}
                  onClick={() => setPreviewImageUrl(message.imageUrl || null)}
                >
                  <img
                    src={message.imageUrl || "/placeholder.svg"}
                    alt="첨부 이미지"
                    className="max-w-full h-auto object-cover"
                    style={{ maxHeight: "240px" }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.parentElement!.innerHTML = `
                        <div class="px-4 py-3 bg-[#F3F4F6] text-[#6B7280] text-sm rounded-2xl">
                          이미지를 불러올 수 없어요
                        </div>
                      `;
                    }}
                  />
                </div>
              )}

              <span
                className={`text-xs text-[#9CA3AF] mt-1 block ${
                  message.isMe ? "text-right" : ""
                }`}
              >
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImageUrl} onOpenChange={() => setPreviewImageUrl(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-2 bg-black/90 border-none">
          {previewImageUrl && (
            <img
              src={previewImageUrl || "/placeholder.svg"}
              alt="이미지 확대"
              className="max-w-full max-h-[85vh] object-contain mx-auto"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Composer - sticky bottom with safe area + BottomTabs height */}
      <div
        className="sticky bottom-0 z-20 p-4 border-t border-[#E5E7EB] bg-white/95 backdrop-blur shrink-0"
        style={{ paddingBottom: "calc(var(--safe-bottom, 0px) + var(--bottom-tabs-h, 64px) + 16px)" }}
      >
        {/* Image Preview */}
        {selectedImageUrl && selectedImageFile && (
          <div className="mb-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#E5E7EB] shrink-0">
                <img
                  src={selectedImageUrl || "/placeholder.svg"}
                  alt="첨부 이미지 미리보기"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#111827] truncate">
                  {selectedImageFile.name}
                </p>
                <p className="text-xs text-[#6B7280]">
                  {formatFileSize(selectedImageFile.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                className="shrink-0 w-8 h-8 p-0 rounded-full hover:bg-[#FEE2E2] hover:text-[#EF4444]"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Input Row */}
        <div className="flex gap-2 items-center">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Attachment button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={openAttachmentPicker}
            className="shrink-0 w-10 h-10 p-0 rounded-xl hover:bg-[#F0FDF4] text-[#6B7280] hover:text-[#22C55E]"
          >
            <ImagePlus className="w-5 h-5" />
          </Button>

          {/* Text input */}
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="flex-1 rounded-xl border-[#E5E7EB] focus-visible:ring-[#22C55E]"
          />

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={!canSend}
            className="bg-[#22C55E] hover:bg-[#16A34A] disabled:bg-[#D1D5DB] rounded-xl px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Realtime placeholder */}
        <p className="text-xs text-[#9CA3AF] mt-2 text-center">
          실시간 채팅 (Supabase Realtime)
        </p>
      </div>
    </div>
  );
}
