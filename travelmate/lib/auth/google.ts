import crypto from "crypto";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export const GOOGLE_OAUTH_STATE_COOKIE = "travelmate_oauth_state";

export interface GoogleUserInfo {
  id: string; // Google sub
  email: string;
  emailVerified: boolean;
  name: string;
  picture?: string;
}

/**
 * Returns the configured base URL for the application.
 * Normalizes protocol, trims whitespace, and strips trailing slashes.
 */
export function getAppBaseUrl(): string {
  let envUrl =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  envUrl = envUrl.trim().replace(/\/+$/, "");

  if (!envUrl.startsWith("http://") && !envUrl.startsWith("https://")) {
    envUrl = `https://${envUrl}`;
  }

  return envUrl;
}

/**
 * Computes the authorized redirect URI for Google OAuth callback.
 */
export function getGoogleRedirectUri(): string {
  return `${getAppBaseUrl()}/api/auth/google/callback`;
}

/**
 * Checks whether Google OAuth credentials are fully configured.
 */
export function isGoogleOAuthConfigured(): boolean {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  return Boolean(clientId && clientSecret);
}

/**
 * Generates the Google OAuth authorization URL and persists state in a secure cookie.
 * Encodes the source origin ('login' | 'signup') into the state parameter for contextual redirects.
 */
export async function createGoogleAuthUrl(from: string = "login"): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    throw new Error("MISSING_CREDENTIALS");
  }

  // Cryptographically secure token to prevent CSRF
  const csrfToken = crypto.randomBytes(32).toString("hex");

  const cookieStore = await cookies();
  cookieStore.set(GOOGLE_OAUTH_STATE_COOKIE, csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });

  const origin = from === "signup" ? "signup" : "login";
  const state = `${csrfToken}:${origin}`;

  const redirectUri = getGoogleRedirectUri();
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid profile email",
    access_type: "offline",
    prompt: "select_account",
    state,
  });

  return `${rootUrl}?${params.toString()}`;
}

/**
 * Exchanges the Google authorization code for access and ID tokens.
 */
export async function exchangeCodeForTokens(code: string): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    throw new Error("MISSING_CREDENTIALS");
  }

  const redirectUri = getGoogleRedirectUri();

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("[Google OAuth] Token exchange failed:", response.status, errorBody);
    throw new Error("TOKEN_EXCHANGE_FAILED");
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error("NO_ACCESS_TOKEN");
  }

  return data.access_token as string;
}

/**
 * Fetches the user profile from Google's verified userinfo endpoint.
 */
export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error("[Google OAuth] UserInfo fetch failed:", response.status);
    throw new Error("USERINFO_FETCH_FAILED");
  }

  const data = await response.json();

  if (!data.sub || !data.email) {
    throw new Error("INVALID_USERINFO_PAYLOAD");
  }

  return {
    id: data.sub as string,
    email: (data.email as string).toLowerCase().trim(),
    emailVerified: Boolean(data.email_verified),
    name: (data.name as string) || (data.email as string).split("@")[0],
    picture: (data.picture as string) || undefined,
  };
}

/**
 * Handles finding, linking, or creating a user associated with a verified Google profile.
 *
 * Security rules:
 * 1. If an existing TravelMate account has the same email, safely link the Google identity.
 * 2. Preserve existing passwordHash so email/password login is not disrupted.
 * 3. Never create duplicate accounts for the same email.
 * 4. Google-authenticated accounts are marked isEmailVerified = true.
 */
export async function authenticateGoogleUser(info: GoogleUserInfo) {
  // 1. Match by googleId first (or existing linked Account)
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { googleId: info.id },
        { accounts: { some: { provider: "google", providerAccountId: info.id } } },
      ],
    },
  });

  if (user) {
    if (!user.isEmailVerified || !user.googleId || (!user.avatarUrl && info.picture)) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
          googleId: user.googleId || info.id,
          avatarUrl: user.avatarUrl || info.picture,
        },
      });
    }
    return user;
  }

  // 2. Match by email second (Account linking)
  const existingUser = await prisma.user.findUnique({
    where: { email: info.email },
  });

  if (existingUser) {
    // Ensure the Google Account record is linked safely
    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId: info.id,
        },
      },
    });

    if (!existingAccount) {
      await prisma.account.create({
        data: {
          userId: existingUser.id,
          provider: "google",
          providerAccountId: info.id,
        },
      });
    }

    // Link Google OAuth account to existing user while strictly preserving passwordHash
    user = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        googleId: info.id,
        isEmailVerified: true,
        avatarUrl: existingUser.avatarUrl || info.picture,
      },
    });
    return user;
  }

  // 3. Brand new user -> Create User with googleId and linked Account
  const newUser = await prisma.user.create({
    data: {
      email: info.email,
      name: info.name,
      googleId: info.id,
      isEmailVerified: true,
      avatarUrl: info.picture,
      passwordHash: null,
      accounts: {
        create: {
          provider: "google",
          providerAccountId: info.id,
        },
      },
    },
  });

  return newUser;
}

