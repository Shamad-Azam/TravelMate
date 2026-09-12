import { NextRequest, NextResponse } from "next/server";
import { getRealPlaces } from "@/lib/travel/places";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const destination = request.nextUrl.searchParams.get("destination") || "Annapurna Base Camp";
  const lat = parseFloat(request.nextUrl.searchParams.get("lat") || "28.5306");
  const lng = parseFloat(request.nextUrl.searchParams.get("lng") || "83.8780");

  try {
    const places = await getRealPlaces(destination, lat, lng);
    return NextResponse.json({ places });
  } catch (error) {
    console.error("[API travel/places] error:", error);
    return NextResponse.json({ places: [] });
  }
}
