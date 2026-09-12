import { NextRequest, NextResponse } from "next/server";
import { computeTripRoute } from "@/lib/travel/routes";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.searchParams.get("origin") || "Delhi";
  const destination = request.nextUrl.searchParams.get("destination") || "Annapurna Base Camp";

  const origLat = parseFloat(request.nextUrl.searchParams.get("origLat") || "28.6139");
  const origLng = parseFloat(request.nextUrl.searchParams.get("origLng") || "77.2090");
  const destLat = parseFloat(request.nextUrl.searchParams.get("destLat") || "28.5306");
  const destLng = parseFloat(request.nextUrl.searchParams.get("destLng") || "83.8780");

  try {
    const route = await computeTripRoute(origin, origLat, origLng, destination, destLat, destLng);
    return NextResponse.json(route);
  } catch (error) {
    console.error("[API travel/route] error:", error);
    return NextResponse.json({ error: "Failed to compute travel route" }, { status: 500 });
  }
}
