import { NextResponse, type NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/app/(app)/lib/supabase/api-helpers";

/**
 * POST /api/requests/[id]/select-helper
 *
 * Customer selects a helper for their request.
 * Calls the DB function `select_helper_for_request(p_request_id, p_helper_id)`.
 * Body: { helper_id: string }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, user, errorResponse } = await getAuthenticatedUser();
  if (errorResponse) return errorResponse;

  const { id: requestId } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { helper_id } = body as { helper_id?: string };

  if (!helper_id) {
    return NextResponse.json(
      { error: "Missing required field: helper_id" },
      { status: 400 }
    );
  }

  // Call the stored function
  const { data, error } = await supabase!.rpc("select_helper_for_request", {
    p_request_id: requestId,
    p_helper_id: helper_id,
  });

  if (error) {
    // Could be RLS violation, or the function raised an exception
    const status = error.message.includes("not the owner") ? 403 : 400;
    return NextResponse.json(
      { error: error.message },
      { status }
    );
  }

  return NextResponse.json({ data, success: true });
}
