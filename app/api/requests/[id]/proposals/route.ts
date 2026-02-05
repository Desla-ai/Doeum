import { NextResponse, type NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/app/(app)/lib/supabase/api-helpers";

/**
 * POST /api/requests/[id]/proposals
 *
 * Helper submits a proposal to work on a request.
 * Body: { message?, proposed_price? }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, user, errorResponse } = await getAuthenticatedUser();
  if (errorResponse) return errorResponse;

  const { id: requestId } = await params;

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // Body is optional
  }

  const { message, proposed_price } = body as {
    message?: string;
    proposed_price?: number;
  };

  // Insert the proposal
  const { data, error } = await supabase!
    .from("proposals")
    .insert({
      request_id: requestId,
      helper_id: user!.id,
      message: message || null,
      proposed_price: proposed_price || null,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    // Could be RLS violation (e.g., customer trying to propose, duplicate)
    return NextResponse.json(
      { error: error.message },
      { status: 403 }
    );
  }

  return NextResponse.json({ data }, { status: 201 });
}

/**
 * GET /api/requests/[id]/proposals
 *
 * Get proposals for a specific request.
 * Only the request owner (customer) can see all proposals.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, user, errorResponse } = await getAuthenticatedUser();
  if (errorResponse) return errorResponse;

  const { id: requestId } = await params;

  // RLS will enforce that only the customer or the helper can see relevant proposals
  const { data, error } = await supabase!
    .from("proposals")
    .select("*, profiles:helper_id(id, display_name, avatar_url)")
    .eq("request_id", requestId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 403 }
    );
  }

  return NextResponse.json({ data });
}
