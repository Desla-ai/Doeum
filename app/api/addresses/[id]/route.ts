import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // 프로젝트 경로에 맞게

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || id === "undefined") {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // soft delete: deleted_at 세팅
  const { data, error } = await supabase
    .from("addresses")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    // RLS 또는 id/user 불일치
    return NextResponse.json(
      { error: "Not found or not permitted (RLS)" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, id });
}
