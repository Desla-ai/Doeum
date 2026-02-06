import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// DB order_status enum 스냅샷 기준 [Source](https://www.genspark.ai/api/files/s/iUnR9GyJ)
const ALLOWED_ORDER_STATUSES = new Set([
  "accepted",
  "escrow_held",
  "in_progress",
  "done_by_helper",
  "confirmed_by_customer",
  "paid_out",
  "disputed",
  "cancelled",
]);

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await ctx.params;

  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.to_status) {
    return NextResponse.json({ error: { message: "Missing to_status" } }, { status: 400 });
  }

  const to_status = String(body.to_status);
  const event_type = body.event_type ? String(body.event_type) : "status_change";
  const payload = body.payload && typeof body.payload === "object" ? body.payload : {};

  if (!ALLOWED_ORDER_STATUSES.has(to_status)) {
    return NextResponse.json(
      { error: { message: `Invalid to_status: ${to_status}` } },
      { status: 400 }
    );
  }

  // 기존 주문 조회 (권한 체크 + from_status 확보)
  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .select("id, customer_id, helper_id, status")
    .eq("id", orderId)
    .single();

  if (orderError || !orderRow) {
    return NextResponse.json({ error: { message: orderError?.message ?? "Not found" } }, { status: 404 });
  }

  const isMember = orderRow.customer_id === auth.user.id || orderRow.helper_id === auth.user.id;
  if (!isMember) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 });
  }

  const from_status = orderRow.status;

  // 주문 상태 업데이트
  const { data: updated, error: updateError } = await supabase
    .from("orders")
    .update({ status: to_status, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .select(
      `
      id,
      request_id,
      customer_id,
      helper_id,
      status,
      amount,
      address_id,
      created_at,
      updated_at
    `
    )
    .single();

  if (updateError) {
    return NextResponse.json({ error: { message: updateError.message } }, { status: 500 });
  }

  // work_events 기록 (best-effort: 로그 실패가 주문 업데이트를 깨면 안 됨)
  await supabase.from("work_events").insert({
    order_id: orderId,
    actor_id: auth.user.id,
    event_type,
    from_status,
    to_status,
    payload,
  });

  return NextResponse.json({ data: updated });
}
