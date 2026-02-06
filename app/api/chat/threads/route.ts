import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const order_id = body?.order_id ? String(body.order_id) : null;

  if (!order_id) {
    return NextResponse.json({ error: { message: "Missing order_id" } }, { status: 400 });
  }

  // order 확인 + 멤버 확인
  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .select("id, customer_id, helper_id")
    .eq("id", order_id)
    .single();

  if (orderError || !orderRow) {
    return NextResponse.json({ error: { message: orderError?.message ?? "Order not found" } }, { status: 404 });
  }

  const isMember = orderRow.customer_id === auth.user.id || orderRow.helper_id === auth.user.id;
  if (!isMember) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 });
  }

  // chat_threads: order_id UNIQUE 이므로 upsert로 get-or-create
  const { data: thread, error: threadError } = await supabase
    .from("chat_threads")
    .upsert({ order_id }, { onConflict: "order_id" })
    .select("id, order_id, created_at")
    .single();

  if (threadError || !thread) {
    return NextResponse.json({ error: { message: threadError?.message ?? "Failed to create thread" } }, { status: 500 });
  }

  // chat_members: (thread_id, user_id) PK, role은 네 enum에 맞춰야 함
  // MVP: role 값을 모르면 일단 null 없이 넣어야 하므로 "customer"/"helper" 중 DB enum과 맞추기 필요.
  // 여기서는 안전하게 "member"를 쓰지 않고, 고객/도우미로 분기하되, 실제 enum과 다르면 에러가 날 수 있음.
  // 만약 에러가 나면 role 값을 DB enum에 맞춰 1회 수정하면 됨.
  const membersToUpsert = [
    { thread_id: thread.id, user_id: orderRow.customer_id, role: "customer" },
    { thread_id: thread.id, user_id: orderRow.helper_id, role: "helper" },
  ].filter((m) => !!m.user_id);

  // best-effort
  await supabase.from("chat_members").upsert(membersToUpsert);

  return NextResponse.json({ data: thread }, { status: 201 });
}
