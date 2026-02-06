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

  const { data, error } = await supabase
    .from("orders")
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
    .eq("id", orderId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: { message: error?.message ?? "Not found" } }, { status: 404 });
  }

  const isMember = data.customer_id === auth.user.id || data.helper_id === auth.user.id;
  if (!isMember) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 });
  }

  return NextResponse.json({ data });
}
