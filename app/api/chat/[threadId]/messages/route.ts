import { NextResponse, type NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/app/(app)/lib/supabase/api-helpers";

/**
 * GET /api/chat/[threadId]/messages
 *
 * Returns messages for the given chat thread (order-based).
 * RLS ensures only participants can read messages.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { supabase, errorResponse } = await getAuthenticatedUser();
  if (errorResponse) return errorResponse;

  const { threadId } = await params;

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") || 50), 100);
  const cursor = searchParams.get("cursor"); // ISO timestamp for pagination

  let query = supabase!
    .from("messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (cursor) {
    query = query.gt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 403 }
    );
  }

  return NextResponse.json({ data });
}

/**
 * POST /api/chat/[threadId]/messages
 *
 * Send a message in a chat thread.
 * Body: { content?: string, image_url?: string }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { supabase, user, errorResponse } = await getAuthenticatedUser();
  if (errorResponse) return errorResponse;

  const { threadId } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { content, image_url } = body as {
    content?: string;
    image_url?: string;
  };

  if (!content && !image_url) {
    return NextResponse.json(
      { error: "Message must have content or image_url" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase!
    .from("messages")
    .insert({
      thread_id: threadId,
      sender_id: user!.id,
      content: content || null,
      image_url: image_url || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 403 }
    );
  }

  return NextResponse.json({ data }, { status: 201 });
}
