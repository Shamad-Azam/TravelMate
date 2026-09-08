import { cookies } from "next/headers";

/**
 * TravelMate Authentication - Session & Cookie Configuration
 * 
 * Production Security Rules:
 * 1. Tokens/Session IDs are NEVER stored in localStorage or sessionStorage.
 * 2. Stored strictly in HttpOnly, Secure, SameSite cookies.
 * 3. Cannot be accessed by client-side JavaScript, guarding against XSS token theft.
 */

export const SESSION_COOKIE_NAME = "travelmate_session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
};

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  createdAt: number;
}

/**
 * Retrieves the current session from incoming request cookies (Server Components / Server Actions).
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  // Once database is connected, this will verify the signed session token against the DB
  try {
    const parsed = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString("utf-8")
    );
    if (parsed && parsed.userId && parsed.email) {
      return parsed as SessionData;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Creates and sets an HttpOnly session cookie on the outgoing response.
 */
export async function setSessionCookie(sessionData: SessionData): Promise<void> {
  const cookieStore = await cookies();
  const encoded = Buffer.from(JSON.stringify(sessionData)).toString("base64");

  cookieStore.set(SESSION_COOKIE_NAME, encoded, SESSION_COOKIE_OPTIONS);
}

/**
 * Destroys the current session cookie immediately (Logout).
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
