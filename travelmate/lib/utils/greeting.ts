/**
 * Utility functions for user greetings and first name extraction.
 */

/**
 * Returns a time-of-day greeting based on the specified date and timezone.
 *
 * Rules:
 * - 5:00 AM–11:59 AM: "Good morning"
 * - 12:00 PM–4:59 PM: "Good afternoon"
 * - 5:00 PM–8:59 PM: "Good evening"
 * - 9:00 PM–4:59 AM: "Good night"
 *
 * @param date Current date instance (defaults to new Date())
 * @param timeZone Optional IANA timezone identifier (e.g. "Asia/Kolkata")
 */
export function getTimeGreeting(date: Date = new Date(), timeZone?: string): string {
  let hour: number;

  if (timeZone) {
    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "numeric",
        hourCycle: "h23",
      });
      hour = parseInt(formatter.format(date), 10);
      if (isNaN(hour)) {
        hour = date.getHours();
      }
    } catch {
      hour = date.getHours();
    }
  } else {
    hour = date.getHours();
  }

  // 5:00 AM (05:00) to 11:59 AM (11:59)
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  }

  // 12:00 PM (12:00) to 4:59 PM (16:59)
  if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  }

  // 5:00 PM (17:00) to 8:59 PM (20:59)
  if (hour >= 17 && hour < 21) {
    return "Good evening";
  }

  // 9:00 PM (21:00) to 4:59 AM (04:59)
  return "Good night";
}

/**
 * Extracts the user's pure first name from their profile or session name.
 * Handles possessive suffixes (e.g., "Shamad-Azam's Org" -> "Shamad"),
 * compound names, emails, and organizational tokens.
 *
 * @param name The raw user name string from session or database
 * @returns Cleaned and capitalized first name
 */
export function extractFirstName(name?: string | null): string {
  if (!name || !name.trim()) {
    return "Traveler";
  }

  let cleaned = name.trim();

  // If the name is an email address, take the username part before '@'
  if (cleaned.includes("@")) {
    cleaned = cleaned.split("@")[0];
  }

  // 1. Strip possessive suffixes like "'s Org", "’s Org", "'s", "’s"
  cleaned = cleaned.replace(/['’]s?\b.*$/i, "").trim();

  // 2. Remove common organizational or role suffixes if present
  cleaned = cleaned.replace(/\b(org|organization|inc|llc|corp|ltd|team|workspace|admin|user)\b/gi, "").trim();

  // 3. Extract the first token delimited by space, hyphen, underscore, slash, or dot
  const firstToken = cleaned.split(/[\s\-_\/.]+/)[0];

  // 4. Strip any non-alphanumeric characters
  const sanitized = firstToken.replace(/[^a-zA-Z0-9]/g, "");

  if (!sanitized) {
    return "Traveler";
  }

  // 5. Capitalize first letter properly (e.g. "shamad" -> "Shamad")
  return sanitized.charAt(0).toUpperCase() + sanitized.slice(1);
}
