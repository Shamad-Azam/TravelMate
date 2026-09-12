import { NextRequest, NextResponse } from "next/server";
import { searchRealHotels } from "@/lib/travel/hotels";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const destination = request.nextUrl.searchParams.get("destination") || "Annapurna Base Camp";
  const lat = parseFloat(request.nextUrl.searchParams.get("lat") || "28.5306");
  const lng = parseFloat(request.nextUrl.searchParams.get("lng") || "83.8780");

  try {
    const hotels = await searchRealHotels(destination, lat, lng);
    return NextResponse.json({ hotels });
  } catch (error) {
    console.error("[API travel/hotels] error:", error);
    return NextResponse.json({ hotels: [] });
  }
}
