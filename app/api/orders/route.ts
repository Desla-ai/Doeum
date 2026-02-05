import { NextResponse, type NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/app/(app)/lib/supabase/api-helpers";

/**
 * GET /api/orders
 *
 * Returns orders for the current user based on mode.
 * ?mode=customer  -> orders where customer_id = me
 * ?mode=helper    -> orders where helper_id = me
 *
 * "orders" maps to the `orders` table (or a view over requests
 * where status >= assigned). Adjust table name if your schema differs.
 */
export async function GET(request: NextRequest) {
  const { supabase, user, errorResponse } = await getAuthenticatedUser();
  if (errorResponse) return errorResponse;

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") || "customer";

  // Orders are requests that have been assigned (status beyond "posted")
  const assignedStatuses = [
    "assigned",
    "escrow_held",
    "in_progress",
    "done_by_helper",
    "confirmed",
    "confirmed_by_customer",
    "auto_confirmed",
    "paid_out",
  ];

  let query = supabase!
    .from("requests")
    .select("*")
    .in("status", assignedStatuses)
    .order("created_at", { ascending: false });

  if (mode === "helper") {
    query = query.eq("helper_id", user!.id);
  } else {
    query = query.eq("customer_id", user!.id);
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
