import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ proposalId: string }> }
) {
  const { proposalId } = await params;
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const me = userData.user.id;

  // proposal → request를 join해서 "요청 소유자(customer)"만 reject 가능하게 검증
  const { data: prop, error: propErr } = await supabase
    .from("request_proposals")
    .select("id, request_id, helper_id, status, requests!request_proposals_request_id_fkey(customer_id)")
    .eq("id", proposalId)
    .single();

  if (propErr) return NextResponse.json({ error: propErr.message }, { status: 400 });

  // @ts-ignore
  if (prop?.requests?.customer_id !== me) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("request_proposals")
    .update({ status: "rejected" })
    .eq("id", proposalId)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
