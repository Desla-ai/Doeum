"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChatThread, type Message, type SendPayload } from "@/components/chat/ChatThread";
import { ShoppingBag, RefreshCw, ShieldAlert } from "lucide-react";
import { formatKSTTime } from "@/lib/time/krTime";

type ApiMessage = {
  id: string;
  thread_id: string;
  sender_id: string;
  type: "text" | "image" | "system";
  content: string | null;
  image_url: string | null;
  created_at: string;
};

function toUiMessage(m: ApiMessage, myUserId: string | null): Message {
  const isMe = !!myUserId && m.sender_id === myUserId;

  return {
    id: m.id,
    content: m.content ?? undefined,
    imageUrl: m.image_url ?? undefined,
    senderId: m.sender_id,
    senderName: isMe ? "나" : "상대",
    timestamp: formatKSTTime(new Date(m.created_at)),
    isMe,
  };
}

type LoadState =
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "error"; message: string; status?: number };

export default function ChatPage() {
  const router = useRouter();
  const params = useParams<{ threadId: string }>();
  const threadId = params?.threadId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  // mock 완전 제거 정책이므로, "내 userId"까지 정확히 맞추려면 /api/me 등이 필요하지만
  // MVP에선 일단 senderName 표시만 최소로 유지하고, 내가 보낸 메시지는 optimistic에서 isMe=true 처리.
  const myUserId = useMemo<string | null>(() => null, []);

  const loadMessages = useCallback(async () => {
    if (!threadId) return;

    setState({ kind: "loading" });

    try {
      const res = await fetch(`/api/chat/threads/${threadId}/messages`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = json?.error?.message || "채팅을 불러올 수 없어요.";
        // 흔한 케이스: 더미 threadId 진입(멤버 아님) => 403
        if (res.status === 403) {
          throw Object.assign(new Error("이 채팅방에 접근할 수 없어요. 주문에서 채팅을 시작해 주세요."), {
            status: 403,
          });
        }
        throw Object.assign(new Error(`${msg} (${res.status})`), { status: res.status });
      }

      const apiMessages: ApiMessage[] = json.data ?? [];
      setMessages(apiMessages.map((m) => toUiMessage(m, myUserId)));
      setState({ kind: "ready" });
    } catch (e: any) {
      console.error(e);
      setMessages([]);
      setState({
        kind: "error",
        message: e?.message || "채팅을 불러오지 못했어요.",
        status: e?.status,
      });
    }
  }, [threadId, myUserId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSend = async (payload: SendPayload) => {
    if (!threadId) return;
    if (sending) return;
    if (state.kind !== "ready") return;

    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticMsg: Message = {
      id: optimisticId,
      content: payload.content,
      imageUrl: payload.imageUrl,
      senderId: "me",
      senderName: "나",
      timestamp: formatKSTTime(new Date()),
      isMe: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    setSending(true);
    try {
      const res = await fetch(`/api/chat/threads/${threadId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: payload.imageUrl ? "image" : "text",
          content: payload.content ?? "",
          image_url: payload.imageUrl ?? null,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = json?.error?.message || "메시지 전송에 실패했어요.";
        throw new Error(`${msg} (${res.status})`);
      }

      const saved: ApiMessage = json.data;
      const savedUi = toUiMessage(saved, myUserId);

      setMessages((prev) => prev.map((m) => (m.id === optimisticId ? savedUi : m)));
    } catch (e) {
      console.error(e);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
    } finally {
      setSending(false);
    }
  };

  // 에러 화면(더미 thread 진입 등) - UI가 절대 안 죽게
  if (state.kind === "error") {
    return (
      <div className="flex flex-col flex-1 min-h-0 w-full max-w-full overflow-hidden">
        <div className="sticky top-0 z-20 shrink-0 bg-white/95 backdrop-blur border-b border-[#E5E7EB]">
          <div className="p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm text-[#6B7280] min-w-0">
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span className="truncate">채팅</span>
              </div>
              <Link href="/orders" className="shrink-0">
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

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-[#EF4444]" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[#111827]">채팅에 접근할 수 없어요</p>
                <p className="text-sm text-[#6B7280] mt-1 break-words">{state.message}</p>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl"
                    onClick={() => loadMessages()}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    다시 시도
                  </Button>
                  <Button
                    className="flex-1 rounded-xl bg-[#22C55E] hover:bg-[#16A34A]"
                    onClick={() => router.push("/orders")}
                  >
                    주문으로 가기
                  </Button>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-3">
                  채팅은 “주문”에 연결된 채팅방에서만 이용할 수 있어요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const loading = state.kind === "loading";

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full max-w-full overflow-hidden">
      {/* Order Context Banner */}
      <div className="sticky top-0 z-20 shrink-0 bg-white/95 backdrop-blur border-b border-[#E5E7EB]">
        <div className="p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-[#6B7280] min-w-0">
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span className="truncate">{loading ? "대화 불러오는 중..." : "채팅"}</span>
            </div>

            <Link href="/orders" className="shrink-0">
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

      <ChatThread messages={messages} onSend={handleSend} />
    </div>
  );
}
