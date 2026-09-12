import { NextRequest, NextResponse } from "next/server";
import { searchDestinations } from "@/lib/travel/geocoding";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchDestinations(q);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("[API travel/search] error:", error);
    return NextResponse.json({ error: "Failed to search destinations" }, { status: 500 });
  }
}
