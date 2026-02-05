/**
 * Korea Standard Time (KST) Utilities
 * 
 * All time display and storage in this app should use these utilities
 * to ensure consistent KST timezone handling regardless of browser/device timezone.
 * 
 * Key rules:
 * - Always use timeZone: "Asia/Seoul" in Intl.DateTimeFormat
 * - Never use toISOString() directly (it returns UTC)
 * - Use toKSTISOString() for storage
 * - Use format functions for display
 */

export const KR_TIME_ZONE = "Asia/Seoul";
export const KR_LOCALE = "ko-KR";

/**
 * Get current date (returns native Date, but all formatting uses KST)
 */
export function nowKST(): Date {
  return new Date();
}

/**
 * Format time in KST: "오전 10:03" or "오후 3:42"
 */
export function formatKSTTime(date: Date): string {
  return new Intl.DateTimeFormat(KR_LOCALE, {
    timeZone: KR_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/**
 * Format date in KST: "2026.02.05"
 */
export function formatKSTDate(date: Date): string {
  return new Intl.DateTimeFormat(KR_LOCALE, {
    timeZone: KR_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replace(/\. /g, ".")
    .replace(/\.$/, "");
}

/**
 * Format date and time in KST: "2026.02.05 오후 3:42"
 */
export function formatKSTDateTime(date: Date): string {
  return `${formatKSTDate(date)} ${formatKSTTime(date)}`;
}

/**
 * Format short time for UI (HH:MM): "10:03"
 */
export function formatKSTShortTime(date: Date): string {
  return new Intl.DateTimeFormat(KR_LOCALE, {
    timeZone: KR_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Get KST date key for comparison: "2026-02-05"
 * Useful for calendar/date grouping where we need consistent date boundaries
 */
export function getKSTDateKey(date: Date): string {
  const formatter = new Intl.DateTimeFormat(KR_LOCALE, {
    timeZone: KR_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

/**
 * Get KST year, month, day as numbers
 */
export function getKSTDateParts(date: Date): {
  year: number;
  month: number;
  day: number;
} {
  const formatter = new Intl.DateTimeFormat(KR_LOCALE, {
    timeZone: KR_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const parts = formatter.formatToParts(date);
  return {
    year: parseInt(parts.find((p) => p.type === "year")?.value || "0"),
    month: parseInt(parts.find((p) => p.type === "month")?.value || "0"),
    day: parseInt(parts.find((p) => p.type === "day")?.value || "0"),
  };
}

/**
 * Get month name in Korean: "2월"
 */
export function getKSTMonthName(date: Date): string {
  return new Intl.DateTimeFormat(KR_LOCALE, {
    timeZone: KR_TIME_ZONE,
    month: "long",
  }).format(date);
}

/**
 * Get short month name: "2월"
 */
export function getKSTShortMonthName(date: Date): string {
  return new Intl.DateTimeFormat(KR_LOCALE, {
    timeZone: KR_TIME_ZONE,
    month: "short",
  }).format(date);
}

/**
 * Convert Date to KST ISO string for storage: "2026-02-05T15:42:00+09:00"
 * Use this instead of toISOString() which returns UTC
 */
export function toKSTISOString(date: Date): string {
  const formatter = new Intl.DateTimeFormat(KR_LOCALE, {
    timeZone: KR_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || "00";

  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");
  const second = get("second");

  return `${year}-${month}-${day}T${hour}:${minute}:${second}+09:00`;
}

/**
 * Parse loose Korean datetime string to Date
 * Handles formats like:
 * - "2024.02.15 오전 10:00"
 * - "2024.02.15"
 * - "오전 10:00"
 */
export function parseLooseKoreanDateTimeToDateKST(input: string): Date | null {
  if (!input) return null;

  try {
    // Try to match "YYYY.MM.DD 오전/오후 HH:MM" format
    const fullMatch = input.match(
      /(\d{4})\.(\d{2})\.(\d{2})\s*(오전|오후)\s*(\d{1,2}):(\d{2})/
    );
    if (fullMatch) {
      const [, year, month, day, ampm, hourStr, minute] = fullMatch;
      let hour = parseInt(hourStr);
      if (ampm === "오후" && hour !== 12) hour += 12;
      if (ampm === "오전" && hour === 12) hour = 0;

      // Create date in KST
      const dateStr = `${year}-${month}-${day}T${hour.toString().padStart(2, "0")}:${minute}:00+09:00`;
      return new Date(dateStr);
    }

    // Try to match "YYYY.MM.DD" format
    const dateOnlyMatch = input.match(/(\d{4})\.(\d{2})\.(\d{2})/);
    if (dateOnlyMatch) {
      const [, year, month, day] = dateOnlyMatch;
      return new Date(`${year}-${month}-${day}T00:00:00+09:00`);
    }

    // Try to match "오전/오후 HH:MM" format (use today's date)
    const timeOnlyMatch = input.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);
    if (timeOnlyMatch) {
      const [, ampm, hourStr, minute] = timeOnlyMatch;
      let hour = parseInt(hourStr);
      if (ampm === "오후" && hour !== 12) hour += 12;
      if (ampm === "오전" && hour === 12) hour = 0;

      const today = getKSTDateKey(new Date());
      return new Date(
        `${today}T${hour.toString().padStart(2, "0")}:${minute}:00+09:00`
      );
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Check if two dates are the same day in KST
 */
export function isSameKSTDay(date1: Date, date2: Date): boolean {
  return getKSTDateKey(date1) === getKSTDateKey(date2);
}

/**
 * Get start of day in KST
 */
export function getKSTStartOfDay(date: Date): Date {
  const key = getKSTDateKey(date);
  return new Date(`${key}T00:00:00+09:00`);
}

/**
 * Get end of day in KST
 */
export function getKSTEndOfDay(date: Date): Date {
  const key = getKSTDateKey(date);
  return new Date(`${key}T23:59:59+09:00`);
}

/**
 * Format relative time in Korean: "방금", "5분 전", "2시간 전", "어제"
 */
export function formatKSTRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "방금";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays === 1) return "어제";
  if (diffDays < 7) return `${diffDays}일 전`;
  return formatKSTDate(date);
}
