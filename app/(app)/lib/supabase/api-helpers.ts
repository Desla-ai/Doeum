import { NextResponse } from "next/server";
import { createSupabaseServer } from "./server";

/**
 * Get the authenticated user from the request.
 * Returns { supabase, user } if authenticated, or a 401 NextResponse if not.
 */
export async function getAuthenticatedUser() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      supabase: null,
      user: null,
      errorResponse: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  return { supabase, user, errorResponse: null };
}
