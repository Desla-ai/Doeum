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

  // 본인 proposal만 철회 가능 (RLS로도 막히겠지만 서버에서도 조건)
  const { data, error } = await supabase
    .from("request_proposals")
    .update({ status: "withdrawn" })
    .eq("id", proposalId)
    .eq("helper_id", me)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
