import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;
  const supabase = await createClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const me = userData.user.id;

  const body = await req.json().catch(() => ({}));
  const message = typeof body.message === "string" ? body.message : "";
  const proposed_price =
    typeof body.proposed_price === "number" ? body.proposed_price : null;

  const { data, error } = await supabase
    .from("request_proposals")
    .insert({
      request_id: requestId,
      helper_id: me,
      message,
      proposed_price,
      // status는 DB default 'pending'이므로 생략 가능하지만, 명시해도 OK
      status: "pending",
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}
