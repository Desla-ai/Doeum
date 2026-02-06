import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await ctx.params;

  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  // 요청 1개
  const { data: requestRow, error: requestError } = await supabase
    .from("requests")
    .select(
      `
      id,
      customer_id,
      category,
      description,
      price,
      scheduled_at,
      region_sigungu,
      region_dong,
      address_id,
      status,
      created_at,
      updated_at
    `
    )
    .eq("id", requestId)
    .single();

  if (requestError) {
    return NextResponse.json({ error: { message: requestError.message } }, { status: 404 });
  }

  // 권한: MVP는 "요청 작성자만 상세 접근"으로 단순화
  if (requestRow.customer_id !== auth.user.id) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 });
  }

  // proposals
  const { data: proposals, error: proposalError } = await supabase
    .from("request_proposals")
    .select(
      `
      id,
      request_id,
      helper_id,
      message,
      proposed_price,
      status,
      created_at,
      updated_at
    `
    )
    .eq("request_id", requestId)
    .order("created_at", { ascending: false });

  if (proposalError) {
    return NextResponse.json({ error: { message: proposalError.message } }, { status: 500 });
  }

  return NextResponse.json({ data: { request: requestRow, proposals } });
}
