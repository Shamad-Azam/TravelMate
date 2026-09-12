import { NextRequest, NextResponse } from "next/server";
import { getDestinationWeather } from "@/lib/travel/weather";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const dest = request.nextUrl.searchParams.get("destination") || "Annapurna Base Camp";
  const latStr = request.nextUrl.searchParams.get("lat");
  const lngStr = request.nextUrl.searchParams.get("lng");

  const lat = latStr ? parseFloat(latStr) : 28.5306;
  const lng = lngStr ? parseFloat(lngStr) : 83.8780;

  try {
    const data = await getDestinationWeather(dest, lat, lng);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API travel/weather] error:", error);
    return NextResponse.json({ error: "Live weather temporarily unavailable" }, { status: 503 });
  }
}
