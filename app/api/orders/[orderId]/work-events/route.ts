import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await ctx.params;

  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  // 주문 멤버인지 확인
  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .select("id, customer_id, helper_id")
    .eq("id", orderId)
    .single();

  if (orderError || !orderRow) {
    return NextResponse.json({ error: { message: orderError?.message ?? "Not found" } }, { status: 404 });
  }

  const isMember = orderRow.customer_id === auth.user.id || orderRow.helper_id === auth.user.id;
  if (!isMember) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("work_events")
    .select(
      `
      id,
      order_id,
      actor_id,
      event_type,
      from_status,
      to_status,
      payload,
      created_at
    `
    )
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }

  return NextResponse.json({ data });
}
