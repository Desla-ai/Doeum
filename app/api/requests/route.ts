import { NextResponse, type NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/app/(app)/lib/supabase/api-helpers";

/**
 * GET /api/requests
 *
 * - customer mode: returns the current user's own requests
 * - helper mode (?mode=helper&region_sigungu=...&region_dong=...):
 *   returns posted requests filtered by sigungu/dong
 */
export async function GET(request: NextRequest) {
  const { supabase, user, errorResponse } = await getAuthenticatedUser();
  if (errorResponse) return errorResponse;

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") || "customer";

  if (mode === "helper") {
    // Helper feed: only "posted" status, filtered by region
    const regionSigungu = searchParams.get("region_sigungu");
    const regionDong = searchParams.get("region_dong");

    let query = supabase!
      .from("requests")
      .select("*")
      .eq("status", "posted")
      .neq("customer_id", user!.id)
      .order("created_at", { ascending: false });

    if (regionSigungu) {
      query = query.eq("region_sigungu", regionSigungu);
    }
    if (regionDong) {
      query = query.eq("region_dong", regionDong);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json({ data });
  }

  // Customer mode: return own requests
  const { data, error } = await supabase!
    .from("requests")
    .select("*")
    .eq("customer_id", user!.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 403 }
    );
  }

  return NextResponse.json({ data });
}

/**
 * POST /api/requests
 *
 * Create a new request (customer only).
 * Body: { category, description, price, scheduled_at, region_sigungu, region_dong, address_text, address_id? }
 */
export async function POST(request: NextRequest) {
  const { supabase, user, errorResponse } = await getAuthenticatedUser();
  if (errorResponse) return errorResponse;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    category,
    description,
    price,
    scheduled_at,
    region_sigungu,
    region_dong,
    address_text,
    address_id,
    photos,
  } = body as {
    category?: string;
    description?: string;
    price?: number;
    scheduled_at?: string;
    region_sigungu?: string;
    region_dong?: string;
    address_text?: string;
    address_id?: string;
    photos?: string[];
  };

  // Validate required fields
  if (!category || !description || !price || !region_sigungu || !region_dong) {
    return NextResponse.json(
      {
        error:
          "Missing required fields: category, description, price, region_sigungu, region_dong",
      },
      { status: 400 }
    );
  }

  const insertData: Record<string, unknown> = {
    customer_id: user!.id,
    category,
    description,
    price,
    scheduled_at: scheduled_at || null,
    region_sigungu,
    region_dong,
    address_text: address_text || null,
    address_id: address_id || null,
    photos: photos || [],
    status: "posted",
  };

  const { data, error } = await supabase!
    .from("requests")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 403 }
    );
  }

  return NextResponse.json({ data }, { status: 201 });
}
