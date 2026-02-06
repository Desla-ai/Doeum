import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const DEFAULT_PROFILE = {
  name: "사용자",
  tier: "BRONZE",
  matching_score: 500,
  is_online: false,
  region_sigungu: "",
  region_dong: "",
};

export async function GET() {
  const supabase = await createClient();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  // 1) try fetch
  const { data: existing, error: selErr } = await supabase
    .from("profiles")
    .select("id, name, tier, matching_score, is_online, region_sigungu, region_dong, created_at, updated_at")
    .eq("id", auth.user.id)
    .maybeSingle();

  if (selErr) {
    return NextResponse.json({ error: { message: selErr.message } }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json({ data: existing });
  }

  // 2) ensure row exists (upsert)
  const { data: created, error: upErr } = await supabase
    .from("profiles")
    .upsert(
      {
        id: auth.user.id,
        ...DEFAULT_PROFILE,
      },
      { onConflict: "id" }
    )
    .select("id, name, tier, matching_score, is_online, region_sigungu, region_dong, created_at, updated_at")
    .single();

  if (upErr) {
    return NextResponse.json({ error: { message: upErr.message } }, { status: 500 });
  }

  return NextResponse.json({ data: created });
}

export async function PATCH(req: Request) {
  const supabase = await createClient();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));

  const name = typeof body?.name === "string" ? body.name : undefined;
  const region_sigungu = typeof body?.region_sigungu === "string" ? body.region_sigungu : undefined;
  const region_dong = typeof body?.region_dong === "string" ? body.region_dong : undefined;
  const is_online = typeof body?.is_online === "boolean" ? body.is_online : undefined;

  if (name !== undefined && !name.trim()) {
    return NextResponse.json({ error: { message: "name cannot be empty" } }, { status: 400 });
  }

  const patch: Record<string, any> = { updated_at: new Date().toISOString() };
  if (name !== undefined) patch.name = name.trim();
  if (region_sigungu !== undefined) patch.region_sigungu = region_sigungu;
  if (region_dong !== undefined) patch.region_dong = region_dong;
  if (is_online !== undefined) patch.is_online = is_online;

  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", auth.user.id)
    .select("id, name, tier, matching_score, is_online, region_sigungu, region_dong, created_at, updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }

  return NextResponse.json({ data });
}
