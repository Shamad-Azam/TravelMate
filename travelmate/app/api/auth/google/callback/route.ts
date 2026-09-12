import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  authenticateGoogleUser,
  exchangeCodeForTokens,
  fetchGoogleUserInfo,
  getAppBaseUrl,
  GOOGLE_OAUTH_STATE_COOKIE,
} from "@/lib/auth/google";
import { createSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const baseUrl = getAppBaseUrl();
  const searchParams = request.nextUrl.searchParams;

  const errorParam = searchParams.get("error");
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // Parse state into csrfToken and source page ('login' | 'signup')
  const [stateToken, rawSource] = (state || "").split(":");
  const sourcePage = rawSource === "signup" ? "signup" : "login";

  // 1. Handle user cancellation or OAuth error from Google
  if (errorParam) {
    if (errorParam === "access_denied") {
      return NextResponse.redirect(new URL(`/${sourcePage}?error=oauth_cancelled`, baseUrl));
    }
    console.error("[Google OAuth] Callback received error:", errorParam);
    return NextResponse.redirect(new URL(`/${sourcePage}?error=auth_failed`, baseUrl));
  }

  // 2. Validate state parameter to mitigate CSRF attacks
  const cookieStore = await cookies();
  const storedState = cookieStore.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;

  // Always delete state cookie after use
  cookieStore.delete(GOOGLE_OAUTH_STATE_COOKIE);

  if (!stateToken || !storedState || stateToken !== storedState) {
    console.warn("[Google OAuth] State mismatch or missing state");
    return NextResponse.redirect(new URL(`/${sourcePage}?error=invalid_state`, baseUrl));
  }

  // 3. Ensure authorization code is present
  if (!code) {
    return NextResponse.redirect(new URL(`/${sourcePage}?error=invalid_request`, baseUrl));
  }

  try {
    // 4. Exchange authorization code for access token
    const accessToken = await exchangeCodeForTokens(code);

    // 5. Fetch verified Google user info
    const userInfo = await fetchGoogleUserInfo(accessToken);

    // 6. Find, link, or create user in PostgreSQL
    const user = await authenticateGoogleUser(userInfo);

    // 7. Create database-backed HttpOnly session
    await createSession(user.id);

    // 8. Redirect authenticated user directly to /dashboard
    return NextResponse.redirect(new URL("/dashboard", baseUrl));
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[Google OAuth] Authentication failed:", err.message);

    if (err.message === "MISSING_CREDENTIALS") {
      return NextResponse.redirect(new URL(`/${sourcePage}?error=missing_credentials`, baseUrl));
    }
    if (err.message === "TOKEN_EXCHANGE_FAILED") {
      return NextResponse.redirect(new URL(`/${sourcePage}?error=code_exchange_failed`, baseUrl));
    }
    if (err.message === "USERINFO_FETCH_FAILED" || err.message === "INVALID_USERINFO_PAYLOAD") {
      return NextResponse.redirect(new URL(`/${sourcePage}?error=user_info_failed`, baseUrl));
    }

    return NextResponse.redirect(new URL(`/${sourcePage}?error=auth_failed`, baseUrl));
  }
}

