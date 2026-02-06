import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type AddressInsert = {
  region_sigungu: string;
  region_dong: string;
  address_line: string;
  address_detail?: string | null;
  lat?: number | null;
  lng?: number | null;
};

function jsonError(status: number, message: string) {
  return NextResponse.json({ error: { message } }, { status });
}

/**
 * GET /api/addresses
 * - 로그인 필요
 * - (RLS 전제) 내 주소 목록만 반환
 */
export async function GET() {
  const supabase = await createClient();

  const { data: auth, error: authErr } = await supabase.auth.getUser();
  if (authErr) return jsonError(401, "Unauthorized");
  const user = auth?.user;
  if (!user) return jsonError(401, "Unauthorized");

  const { data, error } = await supabase
    .from("addresses")
    .select(
      "id,user_id,region_sigungu,region_dong,address_line,address_detail,lat,lng,created_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return jsonError(500, error.message);

  return NextResponse.json({ data: data ?? [] }, { status: 200 });
}

/**
 * POST /api/addresses
 * body: { region_sigungu, region_dong, address_line, address_detail?, lat?, lng? }
 * - 로그인 필요
 * - user_id는 서버에서 강제
 */
export async function POST(req: Request) {
  const supabase = await createClient();

  const { data: auth, error: authErr } = await supabase.auth.getUser();
  if (authErr) return jsonError(401, "Unauthorized");
  const user = auth?.user;
  if (!user) return jsonError(401, "Unauthorized");

  let body: AddressInsert | null = null;
  try {
    body = (await req.json()) as AddressInsert;
  } catch {
    return jsonError(400, "Invalid JSON body");
  }

  const region_sigungu = body?.region_sigungu?.trim();
  const region_dong = body?.region_dong?.trim();
  const address_line = body?.address_line?.trim();

  if (!region_sigungu) return jsonError(400, "region_sigungu required");
  if (!region_dong) return jsonError(400, "region_dong required");
  if (!address_line) return jsonError(400, "address_line required");

  const payload = {
    user_id: user.id,
    region_sigungu,
    region_dong,
    address_line,
    address_detail: body?.address_detail?.trim?.() ?? body?.address_detail ?? "",
    lat: typeof body?.lat === "number" ? body.lat : null,
    lng: typeof body?.lng === "number" ? body.lng : null,
  };

  const { data, error } = await supabase
    .from("addresses")
    .insert(payload)
    .select(
      "id,user_id,region_sigungu,region_dong,address_line,address_detail,lat,lng,created_at"
    )
    .single();

  if (error) return jsonError(500, error.message);

  return NextResponse.json({ data }, { status: 201 });
}
