import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { logoutAction } from "@/lib/auth/actions";
import { prisma } from "@/lib/db";
import "./dashboard.css";

const DESTINATION_IMAGES: Record<string, string> = {
  Manali: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
  "Leh-Ladakh": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80",
  Kashmir: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80",
  "Spiti Valley": "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=600&q=80",
  Rishikesh: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
  Pokhara: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
  Kathmandu: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
  "Everest Base Camp": "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=600&q=80",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80";

const FEATURED_DESTINATIONS = [
  { name: "Manali", country: "India", image: DESTINATION_IMAGES["Manali"] },
  { name: "Leh-Ladakh", country: "India", image: DESTINATION_IMAGES["Leh-Ladakh"] },
  { name: "Kashmir", country: "India", image: DESTINATION_IMAGES["Kashmir"] },
  { name: "Spiti Valley", country: "India", image: DESTINATION_IMAGES["Spiti Valley"] },
  { name: "Rishikesh", country: "India", image: DESTINATION_IMAGES["Rishikesh"] },
  { name: "Pokhara", country: "Nepal", image: DESTINATION_IMAGES["Pokhara"] },
];

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch only this authenticated user's trips
  const trips = await prisma.trip.findMany({
    where: { userId: session.userId },
    orderBy: { startDate: "asc" },
  });

  const uniqueDestinations = new Set(trips.map((t) => t.destination)).size;
  const totalBudget = trips.reduce((sum, t) => sum + t.budget, 0);
  const userInitial = (session.name || "T").charAt(0).toUpperCase();

  return (
    <div className="travel-app">
      {/* 1. SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">TM</div>
          <strong>TravelMate</strong>
        </div>

        <nav className="sidebar-nav">
          <Link href="/dashboard" className="nav-item active">
            <span>🧭</span>
            <strong>Dashboard</strong>
          </Link>
          <Link href="/trips/new" className="nav-item">
            <span>✈️</span>
            <strong>New Trip</strong>
          </Link>
        </nav>

        <form action={logoutAction} className="logout-form">
          <button type="submit" className="logout-button flex items-center gap-2">
            <span>🚪</span>
            <strong>Sign Out</strong>
          </button>
        </form>
      </aside>

      {/* 2. MAIN DASHBOARD */}
      <main className="dashboard-main">
        {/* Hero Section */}
        <section className="dashboard-hero">
          <div className="hero-overlay" />

          <div className="hero-top">
            <div className="search-box">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search trips, destinations..."
                readOnly
              />
            </div>

            <div className="hero-user">
              <div className="notification">🔔</div>
              <div className="avatar">{userInitial}</div>
              <div>
                <strong>{session.name}</strong>
                <small>{session.email}</small>
              </div>
            </div>
          </div>

          <div className="hero-content">
            <span className="eyebrow">TRAVELMATE DASHBOARD</span>
            <h1>Welcome back, {session.name}! ✈️</h1>
            <p>
              Plan your journeys, explore destinations, and manage your upcoming travel adventures.
            </p>

            <div className="quote-card">
              <span className="text-xl">🏔️</span>
              <div>
                <strong className="block text-[11px] text-teal-800">
                  Explorer Mindset
                </strong>
                <p className="text-[10px] text-slate-600 m-0">
                  “The mountains are calling and I must go.” — John Muir
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats Grid */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🧳</div>
            <strong>{trips.length}</strong>
            <span>Saved Trips</span>
            <small>Active in your account</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <strong>{uniqueDestinations}</strong>
            <span>Destinations</span>
            <small>Places on your itinerary</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <strong>
              {trips.reduce((sum, t) => sum + t.travelers, 0)}
            </strong>
            <span>Travelers</span>
            <small>Across planned journeys</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <strong>
              ₹{totalBudget.toLocaleString("en-IN")}
            </strong>
            <span>Total Budget</span>
            <small>Planned travel funds</small>
          </div>
        </section>

        {/* Trips Section */}
        <section className="content-section" style={{ marginTop: "32px" }}>
          <div className="section-heading flex items-center justify-between">
            <div>
              <h2>My Saved Trips 🧳</h2>
              <p>Your upcoming itineraries and planned travel adventures.</p>
            </div>
            <Link
              href="/trips/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              + Create New Trip
            </Link>
          </div>

          {trips.length === 0 ? (
            <div
              style={{
                background: "white",
                borderRadius: "18px",
                border: "1px dashed #cde0e8",
                padding: "48px 24px",
                textAlign: "center",
                marginTop: "16px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "20px",
                  background: "#e8f7fa",
                  color: "#0090a8",
                  fontSize: "32px",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 16px",
                }}
              >
                🧳
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 6px", color: "#122a45" }}>
                No trips yet
              </h3>
              <p style={{ fontSize: "12px", color: "#62788e", maxWidth: "380px", margin: "0 auto 20px" }}>
                You haven&apos;t planned any journeys yet. Choose your destination, travel dates, and budget to create your first adventure!
              </p>
              <Link
                href="/trips/new"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #00b5c4, #007796)",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: 800,
                  textDecoration: "none",
                  boxShadow: "0 8px 20px rgba(0, 140, 165, 0.25)",
                }}
              >
                Create Your First Trip ✈️
              </Link>
            </div>
          ) : (
            <div className="trip-grid" style={{ marginTop: "16px" }}>
              {trips.map((trip) => {
                const img = DESTINATION_IMAGES[trip.destination] || DEFAULT_IMAGE;
                return (
                  <div key={trip.id} className="trip-card">
                    <div className="trip-image">
                      <img src={img} alt={trip.destination} />
                      <span>{trip.country || "India"}</span>
                    </div>
                    <div className="trip-info">
                      <h3>{trip.destination}</h3>
                      <p>
                        📅 {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </p>
                      <div>
                        <span>👥 {trip.travelers} {trip.travelers === 1 ? "traveler" : "travelers"}</span>
                        <strong style={{ color: "#008499" }}>₹{trip.budget.toLocaleString("en-IN")}</strong>
                      </div>
                      <div style={{ marginTop: "6px", paddingTop: "6px", borderTop: "1px solid #edf3f6" }}>
                        <span style={{ color: "#008f7a", fontWeight: 700 }}>
                          {trip.travelTypes || "Adventure"}
                        </span>
                        <span style={{ color: "#7a8e9e" }}>
                          {trip.accommodation || "Hotel"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Featured Destinations */}
        <section className="content-section" style={{ marginTop: "32px", marginBottom: "40px" }}>
          <div className="section-heading">
            <h2>Explore Top Destinations 🏔️</h2>
            <p>Popular destinations for your next Himalayan or cultural escape.</p>
          </div>

          <div className="destination-grid" style={{ marginTop: "14px" }}>
            {FEATURED_DESTINATIONS.map((dest) => (
              <Link
                key={dest.name}
                href="/trips/new"
                className="destination-card"
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
              >
                <img src={dest.image} alt={dest.name} />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(1, 26, 45, 0.85) 0%, transparent 60%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "8px",
                    color: "white",
                  }}
                >
                  <strong style={{ fontSize: "11px", fontWeight: 800 }}>{dest.name}</strong>
                  <span style={{ fontSize: "8px", opacity: 0.85 }}>{dest.country}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* 3. RIGHT PANEL / QUICK ACTIONS */}
      <aside className="planner">
        <div className="planner-cover">
          <div className="planner-title">
            <h1>Travel Hub</h1>
            <p>Adventure & Trip Center</p>
          </div>
        </div>

        <div className="planner-body" style={{ marginTop: "-20px" }}>
          <div style={{ textAlign: "center", padding: "12px 6px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                background: "#e5f8fa",
                color: "#009cb0",
                display: "grid",
                placeItems: "center",
                fontSize: "20px",
                margin: "0 auto 10px",
              }}
            >
              🧭
            </div>
            <h3 style={{ fontSize: "13px", fontWeight: 800, margin: "0 0 4px", color: "#142d48" }}>
              Ready for a New Trip?
            </h3>
            <p style={{ fontSize: "9px", color: "#697e90", lineHeight: 1.4, margin: "0 0 14px" }}>
              Set your travel dates, specify your budget, and build your custom itinerary.
            </p>
            <Link
              href="/trips/new"
              className="generate-button"
              style={{ textDecoration: "none" }}
            >
              <span>+ Plan New Journey</span>
            </Link>
          </div>

          <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #edf4f7" }}>
            <h4 style={{ fontSize: "10px", fontWeight: 800, color: "#1b334c", margin: "0 0 8px" }}>
              TravelMate Travel Tips 💡
            </h4>
            <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "8px", color: "#617688", lineHeight: 1.6 }}>
              <li>Acclimatize properly above 2,500m in Ladakh and Spiti.</li>
              <li>Always check local weather and road conditions before departure.</li>
              <li>Keep offline digital copies of your permits and ID cards.</li>
              <li>Carry sufficient cash when traveling to high Himalayan valleys.</li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
