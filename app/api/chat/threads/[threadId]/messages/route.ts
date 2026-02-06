import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// chat_message_type 스냅샷 [Source](https://www.genspark.ai/api/files/s/PMpFIxiF)
const ALLOWED_MESSAGE_TYPES = new Set(["text", "image", "system"]);

async function ensureThreadMember(supabase: any, threadId: string, userId: string) {
  // 멤버십 확인 (RLS 있으면 select 자체가 막힐 수 있지만, 그 경우도 Forbidden으로 처리)
  const { data, error } = await supabase
    .from("chat_members")
    .select("thread_id, user_id")
    .eq("thread_id", threadId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return { ok: false, reason: error.message };
  if (!data) return { ok: false, reason: "Not a member" };
  return { ok: true as const };
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await ctx.params;

  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  const memberCheck = await ensureThreadMember(supabase, threadId, auth.user.id);
  if (!memberCheck.ok) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .select(
      `
      id,
      thread_id,
      sender_id,
      type,
      content,
      image_url,
      created_at
    `
    )
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await ctx.params;

  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  const memberCheck = await ensureThreadMember(supabase, threadId, auth.user.id);
  if (!memberCheck.ok) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: { message: "Invalid JSON body" } }, { status: 400 });
  }

  const type = body.type ? String(body.type) : "text";
  const content = body.content ? String(body.content) : "";
  const image_url = body.image_url ? String(body.image_url) : null;

  if (!ALLOWED_MESSAGE_TYPES.has(type)) {
    return NextResponse.json({ error: { message: `Invalid type: ${type}` } }, { status: 400 });
  }

  if (type === "text" && !content.trim()) {
    return NextResponse.json({ error: { message: "content is required for text messages" } }, { status: 400 });
  }
  if (type === "image" && !image_url) {
    return NextResponse.json({ error: { message: "image_url is required for image messages" } }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      thread_id: threadId,
      sender_id: auth.user.id,
      type,
      content: content || null,
      image_url,
    })
    .select(
      `
      id,
      thread_id,
      sender_id,
      type,
      content,
      image_url,
      created_at
    `
    )
    .single();

  if (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
