import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getEnvOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing environment variable: ${key}. ` +
        "Supabase will NOT connect silently to a different database. " +
        "Set this variable in your Vercel project settings."
    );
  }
  return value;
}

/**
 * Server-side Supabase client (Route Handlers, Server Components, Server Actions).
 * Always creates a fresh instance — never cache in a global variable.
 *
 * Uses the user's session cookie so RLS applies normally.
 */
export async function createSupabaseServer() {
  const url = getEnvOrThrow("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = getEnvOrThrow("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll called from a Server Component — safe to ignore
          // if middleware is refreshing sessions.
        }
      },
    },
  });
}

/**
 * Server-side Supabase client with the SERVICE_ROLE_KEY.
 * Bypasses RLS — use only in trusted server code (e.g., triggers, admin).
 */
export async function createSupabaseAdmin() {
  const url = getEnvOrThrow("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = getEnvOrThrow("SUPABASE_SERVICE_ROLE_KEY");

  const cookieStore = await cookies();

  return createServerClient(url, serviceKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignored in read-only context
        }
      },
    },
  });
}
