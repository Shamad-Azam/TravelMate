import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/db";

/**
 * TravelMate Authentication - Database-Backed Session Management
 *
 * Security Rules:
 * 1. Tokens are NEVER stored in localStorage or sessionStorage.
 * 2. Stored strictly in HttpOnly, Secure, SameSite cookies.
 * 3. Session tokens in DB are SHA-256 hashed to prevent DB leak compromise.
 * 4. Expired sessions are cleaned up automatically.
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

function hashSessionToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a new database session and sets the HttpOnly cookie on the response.
 */
export async function createSession(userId: string): Promise<string> {
  const cookieStore = await cookies();
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashSessionToken(rawToken);

  const expiresAt = new Date(
    Date.now() + SESSION_COOKIE_OPTIONS.maxAge * 1000
  );

  await prisma.session.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  cookieStore.set(SESSION_COOKIE_NAME, rawToken, SESSION_COOKIE_OPTIONS);

  return rawToken;
}

/**
 * Retrieves and verifies the current session from incoming request cookies.
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const tokenHash = hashSessionToken(sessionCookie.value);

    const dbSession = await prisma.session.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            isEmailVerified: true,
          },
        },
      },
    });

    if (!dbSession || !dbSession.user) {
      return null;
    }

    // Check expiration
    if (dbSession.expiresAt <= new Date()) {
      await prisma.session.delete({
        where: { id: dbSession.id },
      });
      return null;
    }

    return {
      userId: dbSession.user.id,
      email: dbSession.user.email,
      name: dbSession.user.name,
      isEmailVerified: dbSession.user.isEmailVerified,
      createdAt: dbSession.createdAt.getTime(),
    };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      (error as { digest?: string }).digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw error;
    }
    console.error("[Session] getSession error:", error);
    return null;
  }
}

/**
 * Destroys the current session in both the database and the client cookie (Logout).
 */
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (sessionCookie?.value) {
      const tokenHash = hashSessionToken(sessionCookie.value);
      await prisma.session.deleteMany({
        where: { tokenHash },
      });
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error("[Session] destroySession error:", error);
  }
}
