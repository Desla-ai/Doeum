import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const me = userData.user.id;

  const body = await req.json().catch(() => ({}));
  const proposalId = body?.proposal_id;
  if (typeof proposalId !== "string") {
    return NextResponse.json({ error: "proposal_id required" }, { status: 400 });
  }

  // 1) request 가져오기(소유자 확인)
  const { data: requestRow, error: reqErr } = await supabase
    .from("requests")
    .select("id, customer_id, price, address_id")
    .eq("id", requestId)
    .single();

  if (reqErr) return NextResponse.json({ error: reqErr.message }, { status: 400 });
  if (requestRow.customer_id !== me) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // 2) proposal 가져오기(해당 request 소속인지 확인)
  const { data: proposalRow, error: propErr } = await supabase
    .from("request_proposals")
    .select("id, request_id, helper_id, proposed_price, status")
    .eq("id", proposalId)
    .single();

  if (propErr) return NextResponse.json({ error: propErr.message }, { status: 400 });
  if (proposalRow.request_id !== requestId) {
    return NextResponse.json({ error: "proposal mismatch" }, { status: 400 });
  }
  if (proposalRow.status === "withdrawn") {
    return NextResponse.json({ error: "proposal withdrawn" }, { status: 400 });
  }

  // 3) 가격 확정
  const amount =
    typeof proposalRow.proposed_price === "number"
      ? proposalRow.proposed_price
      : requestRow.price;

  // 4) winner accepted
  const { error: acceptErr } = await supabase
    .from("request_proposals")
    .update({ status: "accepted" })
    .eq("id", proposalId);

  if (acceptErr) return NextResponse.json({ error: acceptErr.message }, { status: 400 });

  // 5) other proposals -> rejected (withdrawn는 유지)
  const { error: rejectOthersErr } = await supabase
    .from("request_proposals")
    .update({ status: "rejected" })
    .eq("request_id", requestId)
    .neq("id", proposalId)
    .neq("status", "withdrawn");

  if (rejectOthersErr) {
    return NextResponse.json({ error: rejectOthersErr.message }, { status: 400 });
  }

  // 6) orders 생성 (request_id UNIQUE)
  const { data: orderRow, error: orderErr } = await supabase
    .from("orders")
    .insert({
      request_id: requestId,
      customer_id: requestRow.customer_id,
      helper_id: proposalRow.helper_id,
      status: "accepted",          // order_status enum
      amount,
      address_id: requestRow.address_id,
    })
    .select("*")
    .single();

  if (orderErr) {
    return NextResponse.json({ error: orderErr.message }, { status: 400 });
  }

  // 7) request status 업데이트(선택)
  // posted -> selecting / awaiting_payment
  await supabase
    .from("requests")
    .update({ status: "awaiting_payment" })
    .eq("id", requestId);

  return NextResponse.json({ data: { order: orderRow } });
}
