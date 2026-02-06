import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  // 내 주문(고객 또는 도우미로 참여)
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
    .or(`customer_id.eq.${auth.user.id},helper_id.eq.${auth.user.id}`)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }

  return NextResponse.json({ data });
}
