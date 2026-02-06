import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  // MVP: "내가 만든 요청" 중심으로 반환 (helper browse는 추후 쿼리 파라미터로 확장 가능)
  const { data, error } = await supabase
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
    .eq("customer_id", auth.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: { message: "Invalid JSON body" } }, { status: 400 });
  }

  const {
    category,
    description,
    price = 0,
    scheduled_at = null,
    region_sigungu,
    region_dong,
    address_id,
  } = body as {
    category: string;
    description: string;
    price?: number;
    scheduled_at?: string | null;
    region_sigungu: string;
    region_dong: string;
    address_id: string;
  };

  if (!category || !description || !region_sigungu || !region_dong || !address_id) {
    return NextResponse.json(
      { error: { message: "Missing required fields: category, description, region_sigungu, region_dong, address_id" } },
      { status: 400 }
    );
  }

  const insertPayload = {
    customer_id: auth.user.id,
    category,
    description,
    price,
    scheduled_at,
    region_sigungu,
    region_dong,
    address_id,
    status: "posted", // request_status enum에 posted 존재 가정
  };

  const { data, error } = await supabase
    .from("requests")
    .insert(insertPayload)
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
    .single();

  if (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
