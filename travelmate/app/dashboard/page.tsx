import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import DashboardSearchBar from "./DashboardSearchBar";

export const dynamic = "force-dynamic";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const BEST_ATTRACTIONS = [
  {
    id: "pokhara",
    name: "Pokhara",
    country: "Nepal",
    rating: "4.8",
    description: "Lakes, mountains and unforgettable views",
    image: "/images/pokhara-hero-hd.jpg",
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    rating: "4.7",
    description: "Modern cities, luxury and endless experiences",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "kashmir",
    name: "Kashmir",
    country: "India",
    rating: "4.8",
    description: "Breathtaking landscapes and serene valleys",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "goa",
    name: "Goa",
    country: "India",
    rating: "4.6",
    description: "Beaches, nightlife and a perfect getaway",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    rating: "4.7",
    description: "Tropical vibes and rich culture",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    rating: "4.8",
    description: "Iconic landmarks and timeless beauty",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80",
  },
];

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch real user trips from PostgreSQL database
  const userTrips = await prisma.trip.findMany({
    where: { userId: session.userId },
    orderBy: { startDate: "asc" },
  });

  const nextTrip = userTrips.length > 0 ? userTrips[0] : null;
  const firstName = session.name ? session.name.split(" ")[0] : "Shamad";
  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-x-hidden">
      {/* 1. TOP NAVBAR */}
      <Navbar userName={session.name} userEmail={session.email} activePath="/dashboard" />

      <main className="max-w-[1440px] w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* 2. HD HERO PANORAMIC BANNER (POKHARA, NEPAL) */}
        <section
          className="relative rounded-3xl overflow-hidden min-h-[360px] sm:min-h-[420px] bg-cover bg-center flex flex-col justify-between p-4 sm:p-10 shadow-lg border border-slate-200"
          style={{
            backgroundImage: "url('/images/pokhara-hero-hd.jpg')",
          }}
        >
          {/* Subtle soft gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 sm:via-white/50 to-transparent sm:w-2/3" />

          {/* Top Right: Tagline (Desktop) */}
          <div className="relative z-10 self-end text-right text-white drop-shadow-md hidden sm:block">
            <h2 className="text-xl font-bold tracking-tight leading-snug">
              Explore<br />
              Plan<br />
              Travel<br />
              Repeat
            </h2>
          </div>

          {/* Top Left: Greeting & Search Bar */}
          <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>{greeting}, {firstName}</span>
                <span>👋</span>
              </h1>
              <p className="text-xs sm:text-base font-semibold text-slate-700 mt-1">
                Ready to plan your next adventure?
              </p>
            </div>

            {/* Floating Tabbed Search Component */}
            <DashboardSearchBar />
          </div>

          {/* Bottom Right: Location Badge */}
          <div className="relative z-10 self-start sm:self-end mt-3 sm:mt-0">
            <div className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-md">
              <span>📍</span>
              <span>Pokhara, Nepal</span>
            </div>
          </div>
        </section>

        {/* 3. MIDDLE SECTION: BEST ATTRACTIONS (LEFT) + YOUR UPCOMING TRIP (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left: Best Attractions Carousel / Grid */}
          <section className="lg:col-span-8 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Best Attractions
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Explore places worth adding to your next trip
                </p>
              </div>

              <Link
                href="/trips/new"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 min-h-[44px]"
              >
                <span>View all</span>
                <span>→</span>
              </Link>
            </div>

            {/* Horizontally scrollable on mobile with snap; clean grid on tablet/desktop */}
            <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-6 gap-3 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 snap-x snap-mandatory no-scrollbar overscroll-x-contain">
              {BEST_ATTRACTIONS.map((item) => (
                <div
                  key={item.id}
                  className="w-[190px] sm:w-auto flex-shrink-0 sm:flex-shrink snap-start bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-28 relative bg-slate-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-xs text-slate-900">
                          {item.name}
                        </h4>
                        <span className="text-[10px] font-black text-amber-500 flex items-center gap-0.5">
                          ★ {item.rating}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {item.country}
                      </p>
                      <p className="text-[10px] text-slate-600 line-clamp-2 leading-tight">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 pt-0">
                    <Link
                      href={`/trips/new?destination=${encodeURIComponent(item.name)}`}
                      className="block w-full py-2 text-center rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 text-[11px] font-bold transition-colors min-h-[36px] flex items-center justify-center"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right: Your Upcoming Trip Card (Single Column on Mobile) */}
          <section className="lg:col-span-4 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Your Upcoming Trip
              </h2>
              <Link
                href="/dashboard#my-trips"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 min-h-[44px]"
              >
                <span>View all</span>
                <span>→</span>
              </Link>
            </div>

            {/* Upcoming Trip Card matching Mockup */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-40 sm:h-44 relative bg-slate-100 overflow-hidden">
                <img
                  src={nextTrip?.destination ? (BEST_ATTRACTIONS.find(a => a.name.toLowerCase() === nextTrip.destination.toLowerCase())?.image || "/images/pokhara-hero-hd.jpg") : "/images/pokhara-hero-hd.jpg"}
                  alt={nextTrip?.destination || "Pokhara"}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-extrabold shadow-sm">
                  Upcoming
                </span>
              </div>

              <div className="p-4 sm:p-5 space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {nextTrip?.destination || "Pokhara"}
                  </h3>
                  <div className="mt-2 space-y-1.5 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <span>🗓️</span>
                      <span>
                        {nextTrip
                          ? `${new Date(nextTrip.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })} – ${new Date(nextTrip.endDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}`
                          : "Oct 15, 2026 – Oct 20, 2026"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👥</span>
                      <span>
                        {nextTrip?.travelers || 2} Travellers
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💼</span>
                      <span>
                        ₹{(nextTrip?.budget || 40000).toLocaleString("en-IN")} (Estimated)
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={nextTrip ? `/trips/${nextTrip.id}` : "/trips/new?destination=Pokhara"}
                  className="block w-full py-3 text-center rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-md min-h-[48px] flex items-center justify-center"
                >
                  View Trip
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* 4. BOTTOM 3-COLUMN ROW: Stacks cleanly into 1 column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Column 1: Meet TravelMate AI */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>Meet TravelMate AI</span>
                  <span className="text-amber-500">✨</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Your personal travel planner.
                </p>
              </div>

              {/* Chat Dialogue Preview Bubble */}
              <div className="bg-slate-50 rounded-2xl p-3 space-y-2 border border-slate-100 text-xs">
                {/* User message */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                    S
                  </div>
                  <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800 font-medium text-[11px] sm:text-xs">
                    Plan a 7-day trip to Pokhara.
                  </div>
                </div>

                {/* AI response */}
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    🤖
                  </div>
                  <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 text-slate-700 leading-snug text-[11px] sm:text-xs">
                    I can help you plan the route, stays, attractions, budget and itinerary.
                  </div>
                </div>
              </div>

              {/* 4 Action Suggestion Chips */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Plan my next trip", query: "Plan my next adventure" },
                  { label: "Find attractions", query: "Find best attractions in Pokhara" },
                  { label: "Calculate budget", query: "Calculate realistic budget for Pokhara" },
                  { label: "Create an itinerary", query: "Create a 7-day travel itinerary" },
                ].map((chip, idx) => (
                  <Link
                    key={idx}
                    href={`/ai?q=${encodeURIComponent(chip.query)}`}
                    className="p-2.5 text-center rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 text-[11px] font-bold transition-all min-h-[44px] flex items-center justify-center"
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/ai"
              className="w-full py-3 text-center rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-md flex items-center justify-center gap-1.5 min-h-[48px]"
            >
              <span>Ask TravelMate AI</span>
              <span>→</span>
            </Link>
          </div>

          {/* Column 2: My Trips */}
          <div id="my-trips" className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  My Trips
                </h3>
                <Link
                  href="/trips/new"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 min-h-[44px]"
                >
                  <span>View all</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Trips List */}
              <div className="divide-y divide-slate-100">
                {(userTrips.length > 0 ? userTrips : [
                  {
                    id: "sample-pokhara",
                    destination: "Pokhara",
                    startDate: new Date("2026-10-15"),
                    endDate: new Date("2026-10-20"),
                    travelers: 2,
                    budget: 40000,
                  },
                  {
                    id: "sample-dubai",
                    destination: "Dubai",
                    startDate: new Date("2026-12-10"),
                    endDate: new Date("2026-12-15"),
                    travelers: 2,
                    budget: 120000,
                  },
                  {
                    id: "sample-kashmir",
                    destination: "Kashmir",
                    startDate: new Date("2026-03-05"),
                    endDate: new Date("2026-03-10"),
                    travelers: 3,
                    budget: 60000,
                  },
                ]).slice(0, 3).map((trip) => {
                  const destImage =
                    BEST_ATTRACTIONS.find((a) => a.name.toLowerCase() === trip.destination.toLowerCase())?.image ||
                    "/images/pokhara-hero-hd.jpg";

                  return (
                    <Link
                      key={trip.id}
                      href={trip.id.startsWith("sample-") ? `/trips/new?destination=${trip.destination}` : `/trips/${trip.id}`}
                      className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition-colors group min-h-[48px]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                          <img
                            src={destImage}
                            alt={trip.destination}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {trip.destination}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">
                            🗓️ {new Date(trip.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} – {new Date(trip.endDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            👥 {trip.travelers} Travellers • ₹{trip.budget.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <span className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all text-sm flex-shrink-0">
                        ›
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <Link
              href="/trips/new"
              className="w-full py-3 text-center rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors min-h-[44px] flex items-center justify-center"
            >
              + Plan Another Trip
            </Link>
          </div>

          {/* Column 3: Stacked Cards (Traveling Solo + Travel Inspiration) */}
          <div className="space-y-6">
            {/* Top: Traveling Solo Card */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden p-4 sm:p-5 shadow-sm relative flex items-center justify-between gap-3 sm:gap-4">
              <div className="space-y-2 z-10 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base font-bold">
                  👥
                </div>
                <h4 className="text-sm font-black text-slate-900">
                  Traveling solo?
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Find people planning similar trips and make your journey more memorable.
                </p>
                <div className="pt-1">
                  <Link
                    href="/find-buddies"
                    className="inline-block px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm min-h-[40px] flex items-center"
                  >
                    Find a Travel Buddy →
                  </Link>
                </div>
              </div>

              {/* Background Hiker / Backpacker Image */}
              <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-inner">
                <img
                  src="/images/travel-hero.jpg"
                  alt="Traveling solo"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Bottom: Travel Inspiration */}
            <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900">
                  Travel Inspiration
                </h4>
                <Link
                  href="/trips/new"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 min-h-[44px]"
                >
                  <span>View all</span>
                  <span>→</span>
                </Link>
              </div>

              {/* 3 Side-by-side cards with mobile overflow prevention */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    title: "Mountain Escape",
                    dest: "Manali",
                    image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=400&q=80",
                  },
                  {
                    title: "Beach Getaway",
                    dest: "Goa",
                    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
                  },
                  {
                    title: "City Adventure",
                    dest: "Dubai",
                    image: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=400&q=80",
                  },
                ].map((item, i) => (
                  <Link
                    key={i}
                    href={`/trips/new?destination=${encodeURIComponent(item.dest)}`}
                    className="relative rounded-2xl overflow-hidden h-20 sm:h-24 group block shadow-sm border border-slate-100"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] sm:text-[10px] font-extrabold text-white leading-tight drop-shadow-sm line-clamp-2">
                      {item.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
