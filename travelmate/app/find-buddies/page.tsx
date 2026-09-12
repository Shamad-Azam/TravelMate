import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

interface FindBuddiesPageProps {
  searchParams: Promise<{
    destination?: string;
    startDate?: string;
  }>;
}

const DESTINATION_IMAGES: Record<string, string> = {
  Manali: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
  "Leh-Ladakh": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
  Kashmir: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
  "Spiti Valley": "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80",
  Rishikesh: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
  Goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
  Dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
  Paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
};

const DEFAULT_IMAGE = "/images/travel-hero.jpg";

function formatDateRange(startDate: Date, endDate: Date): string {
  const start = new Date(startDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
  const end = new Date(endDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${start} — ${end}`;
}

function formatDisplayName(fullName: string): string {
  const parts = fullName.trim().split(" ");
  if (parts.length > 1) {
    return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
  }
  return parts[0] || "Traveler";
}

export default async function FindBuddiesPage({ searchParams }: FindBuddiesPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const destinationQuery = (params.destination || "").trim();

  // Find other travelers' trips excluding the current user
  const matchingTrips = await prisma.trip.findMany({
    where: {
      userId: {
        not: session.userId,
      },
      ...(destinationQuery
        ? {
            destination: {
              contains: destinationQuery,
              mode: "insensitive",
            },
          }
        : {}),
    },
    include: {
      user: {
        select: {
          name: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      startDate: "asc",
    },
    take: 20,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar userName={session.name} userEmail={session.email} activePath="/find-buddies" />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤝</span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
              Find a Travel Buddy
            </h1>
          </div>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Connect with verified fellow travelers heading to the same destination. Match by dates and planned activities to share adventures or travel together.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <form method="GET" action="/find-buddies" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label htmlFor="destination" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Destination
              </label>
              <input
                id="destination"
                type="text"
                name="destination"
                defaultValue={destinationQuery}
                placeholder="e.g. Manali, Kashmir, Goa"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="startDate" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Approximate Travel Date
              </label>
              <input
                id="startDate"
                type="date"
                name="startDate"
                defaultValue={params.startDate || ""}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div className="sm:col-span-1 flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 min-h-[44px] rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all cursor-pointer flex items-center justify-center"
              >
                Search Buddies 🔍
              </button>
              {destinationQuery && (
                <Link
                  href="/find-buddies"
                  className="px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center"
                >
                  Clear
                </Link>
              )}
            </div>
          </form>
        </div>

        {/* Results Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              {destinationQuery
                ? `Travelers heading to "${destinationQuery}"`
                : "Active Travelers & Upcoming Trips"}
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              {matchingTrips.length} {matchingTrips.length === 1 ? "buddy trip" : "buddy trips"} found
            </span>
          </div>

          {matchingTrips.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 text-3xl flex items-center justify-center mx-auto">
                🗺️
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  No travel buddies found for this search
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  {destinationQuery
                    ? `No other travelers currently have a public trip for "${destinationQuery}". Create your trip and check back soon!`
                    : "There are no other active travelers yet. Share your trip on TravelMate to find travel partners."}
                </p>
              </div>
              <Link
                href="/trips/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
              >
                + Plan a Trip Here
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {matchingTrips.map((trip) => {
                const img = DESTINATION_IMAGES[trip.destination] || DEFAULT_IMAGE;
                const buddyName = formatDisplayName(trip.user.name);
                const initial = (trip.user.name || "T").charAt(0).toUpperCase();

                return (
                  <div
                    key={trip.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="h-44 relative bg-slate-900 overflow-hidden">
                      <img
                        src={img}
                        alt={trip.destination}
                        className="w-full h-full object-cover opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/70 text-white text-[10px] font-bold backdrop-blur-sm">
                        {trip.country || "India"}
                      </span>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="text-xl font-bold tracking-tight">
                          {trip.destination}
                        </h3>
                        <p className="text-xs text-slate-200 mt-0.5">
                          🗓️ {formatDateRange(trip.startDate, trip.endDate)}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      {/* Traveler Info */}
                      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                          {initial}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {buddyName}
                          </p>
                          <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.5 rounded">
                            Verified Traveler
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span>Group:</span>
                          <strong className="text-slate-800">
                            👥 {trip.travelers} {trip.travelers === 1 ? "person" : "people"}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Style:</span>
                          <strong className="text-slate-800">
                            {trip.travelTypes || "Adventure"}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Budget:</span>
                          <strong className="text-teal-700">
                            ₹{trip.budget.toLocaleString("en-IN")}
                          </strong>
                        </div>
                        {trip.requirements && (
                          <p className="text-[11px] text-slate-500 italic line-clamp-2 pt-1">
                            &ldquo;{trip.requirements}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="pt-2">
                        <Link
                          href={`/ai?destination=${encodeURIComponent(
                            trip.destination
                          )}&q=${encodeURIComponent(
                            `Plan an itinerary for ${trip.destination} matching dates ${formatDateRange(
                              trip.startDate,
                              trip.endDate
                            )}`
                          )}`}
                          className="w-full py-2.5 px-3 min-h-[44px] rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold text-center flex items-center justify-center transition-colors"
                        >
                          Plan for this Trip ✨
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
