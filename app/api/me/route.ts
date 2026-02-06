import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  return NextResponse.json({
    data: {
      id: data.user.id,
      email: data.user.email ?? null,
    },
  });
}
