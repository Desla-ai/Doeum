export async function apiFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ data?: T; error?: { message: string } }> {
  try {
    const res = await fetch(input, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { error: { message: json?.error?.message || `Request failed (${res.status})` } };
    }

    return { data: json.data as T };
  } catch (e: any) {
    return { error: { message: e?.message || "Network error" } };
  }
}
