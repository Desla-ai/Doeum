import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

function getEnvOrThrow(key: string): string {
  const value =
    typeof window !== "undefined"
      ? // At runtime in the browser, Next.js inlines NEXT_PUBLIC_ vars
        process.env[key]
      : process.env[key];

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
 * Browser (client-side) Supabase client — singleton.
 * Uses NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY only.
 */
export function createSupabaseBrowser() {
  if (client) return client;

  const url = getEnvOrThrow("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = getEnvOrThrow("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  client = createBrowserClient(url, anonKey);
  return client;
}
