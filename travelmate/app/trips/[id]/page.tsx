import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import TripPlannerHub from "./TripPlannerHub";
import { computeTripRoute } from "@/lib/travel/routes";
import { generateTripItinerary } from "@/lib/travel/itinerary";
import { getDestinationWeather } from "@/lib/travel/weather";
import { calculateItemizedBudget } from "@/lib/travel/budget";
import { searchHotels } from "@/lib/travel/hotels";
import { searchRealPlaces } from "@/lib/travel/places";

export const dynamic = "force-dynamic";

interface TripDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const DESTINATION_IMAGES: Record<string, string> = {
  "Annapurna Base Camp": "/images/pokhara-hero-hd.jpg",
  Pokhara: "/images/pokhara-hero-hd.jpg",
  Kathmandu: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=85",
  Manali: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=85",
  "Leh-Ladakh": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1400&q=85",
  Kashmir: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1400&q=85",
  "Spiti Valley": "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1400&q=85",
  Rishikesh: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=85",
  Goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=85",
  Dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=85",
  Paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=85",
};

const DEFAULT_IMAGE = "/images/pokhara-hero-hd.jpg";

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const trip = await prisma.trip.findUnique({
    where: { id },
  });

  if (!trip) {
    notFound();
  }

  // Resolve coordinates
  const isAnnapurna =
    trip.destination.toLowerCase().includes("annapurna") ||
    trip.destination.toLowerCase().includes("abc");

  const destLat = trip.latitude || (isAnnapurna ? 28.5306 : 28.2096);
  const destLng = trip.longitude || (isAnnapurna ? 83.8780 : 83.9856);
  const originName = trip.startLocation || "Delhi";
  const originLat = originName.toLowerCase() === "kathmandu" ? 27.7172 : 28.6139;
  const originLng = originName.toLowerCase() === "kathmandu" ? 85.3240 : 77.2090;

  // Compute duration
  const startMs = new Date(trip.startDate).getTime();
  const endMs = new Date(trip.endDate).getTime();
  const diffDays = Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)));
  const durationDays = isAnnapurna ? 9 : diffDays;

  // Real external data queries in parallel
  const [routeData, weather, budgetData, hotels, places] = await Promise.all([
    computeTripRoute(
      originName,
      originLat,
      originLng,
      trip.destination,
      destLat,
      destLng
    ),
    getDestinationWeather(trip.destination, destLat, destLng),
    calculateItemizedBudget({
      origin: originName,
      destination: trip.destination,
      travelers: trip.travelers,
      durationDays,
      travelStyle: (trip.travelStyle as any) || "Comfort",
    }),
    searchHotels(trip.destination, destLat, destLng),
    searchRealPlaces(trip.destination, destLat, destLng),
  ]);

  const itinerary = generateTripItinerary(trip.destination, originName, durationDays);
  const heroImage = DESTINATION_IMAGES[trip.destination] || DEFAULT_IMAGE;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar userName={session.name} userEmail={session.email} activePath="/dashboard" />

      {/* Hero Header */}
      <section
        className="relative bg-cover bg-center min-h-[280px] sm:min-h-[380px] flex items-end p-4 sm:p-12 text-white"
        style={{
          backgroundImage: `url('${heroImage}')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors mb-2"
          >
            ← Back to Dashboard
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-500/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              {trip.country || "Nepal"}
            </span>
            {trip.destinationType && (
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-sm">
                {trip.destinationType}
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-emerald-500/80 text-white text-xs font-semibold backdrop-blur-sm">
              Style: {trip.travelStyle || "Comfort"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-6xl font-black tracking-tight text-white">
            {trip.destination}
          </h1>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-200">
            <span>🛫 Origin: <strong>{originName}</strong></span>
            <span>🗓️ <strong>{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</strong></span>
            <span>👥 <strong>{trip.travelers} {trip.travelers === 1 ? "Traveler" : "Travelers"}</strong></span>
            <span>💰 Planned: <strong>₹{trip.budget.toLocaleString("en-IN")}</strong></span>
          </div>
        </div>
      </section>

      {/* Main Interactive Hub */}
      <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        <TripPlannerHub
          tripId={trip.id}
          destination={trip.destination}
          country={trip.country || "Nepal"}
          startLocation={originName}
          travelStyle={trip.travelStyle || "Comfort"}
          travelers={trip.travelers}
          userBudget={trip.budget}
          startDateFormatted={formatDate(trip.startDate)}
          endDateFormatted={formatDate(trip.endDate)}
          routeData={routeData}
          itinerary={itinerary}
          weather={weather}
          budgetData={budgetData}
          hotels={hotels}
          places={places}
        />
      </main>
    </div>
  );
}
