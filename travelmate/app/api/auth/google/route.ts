import { NextRequest, NextResponse } from "next/server";
import { createGoogleAuthUrl, getAppBaseUrl, isGoogleOAuthConfigured } from "@/lib/auth/google";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const baseUrl = getAppBaseUrl();
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from") === "signup" ? "signup" : "login";

  try {
    if (!isGoogleOAuthConfigured()) {
      return NextResponse.redirect(new URL(`/${from}?error=missing_credentials`, baseUrl));
    }

    const authUrl = await createGoogleAuthUrl(from);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("[Google OAuth] Initiation error:", error);
    return NextResponse.redirect(new URL(`/${from}?error=auth_failed`, baseUrl));
  }
}


