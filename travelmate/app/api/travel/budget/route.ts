import { NextRequest, NextResponse } from "next/server";
import { calculateTripBudget } from "@/lib/travel/budget";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const destination = request.nextUrl.searchParams.get("destination") || "Annapurna Base Camp";
  const origin = request.nextUrl.searchParams.get("origin") || "Delhi";
  const days = parseInt(request.nextUrl.searchParams.get("days") || "9", 10);
  const travelers = parseInt(request.nextUrl.searchParams.get("travelers") || "2", 10);
  const style = (request.nextUrl.searchParams.get("style") || "Comfort") as "Budget" | "Comfort" | "Premium";

  try {
    const budget = calculateTripBudget({
      destination,
      origin,
      durationDays: isNaN(days) ? 9 : days,
      travelers: isNaN(travelers) ? 2 : travelers,
      travelStyle: style,
    });
    return NextResponse.json(budget);
  } catch (error) {
    console.error("[API travel/budget] error:", error);
    return NextResponse.json({ error: "Failed to calculate trip budget" }, { status: 500 });
  }
}
