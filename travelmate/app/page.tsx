"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  // Navigation mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search card state: date preference tabs
  const [datePreference, setDatePreference] = useState<
    "exact" | "range" | "month" | "flexible"
  >("flexible");

  // Form input states (UI-only for now)
  const [destination, setDestination] = useState("");
  const [exactDate, setExactDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("April 2026");
  const [budget, setBudget] = useState("moderate");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // UI-only for now - backend integration will come in future steps
    alert(
      `Searching travel partners for: ${destination || "Anywhere"} (${datePreference})`
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* =========================================================
          1. RESPONSIVE NAVBAR
      ========================================================= */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg p-1"
              aria-label="TravelMate Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 4a6 6 0 1 1-6 6 6 6 0 0 1 6-6zm0 2v4l3 3"
                  />
                </svg>
              </div>
              <span className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 bg-clip-text text-transparent">
                TravelMate
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <nav
              className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600"
              aria-label="Main Navigation"
            >
              <a
                href="#explore"
                className="hover:text-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded px-1"
              >
                Explore
              </a>
              <a
                href="#partners"
                className="hover:text-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded px-1"
              >
                Find Travel Partners
              </a>
              <a
                href="#ai-planner"
                className="flex items-center gap-1.5 hover:text-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded px-1"
              >
                <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-teal-100 text-teal-800 rounded-full">
                  AI
                </span>
                AI Travel Planner
              </a>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Actions: Compact Log In button + Accessible Hamburger Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-teal-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-colors"
              >
                Log In
              </Link>
              <button
                type="button"
                id="mobile-menu-button"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer touch-manipulation relative z-50 select-none"
              >
                <svg
                  className="w-6 h-6 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            role="region"
            aria-label="Mobile Navigation"
            className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl relative z-50"
          >
            <a
              href="#explore"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2.5 text-base font-medium text-slate-700 hover:text-teal-600 active:text-teal-700"
            >
              Explore
            </a>
            <a
              href="#partners"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2.5 text-base font-medium text-slate-700 hover:text-teal-600 active:text-teal-700"
            >
              Find Travel Partners
            </a>
            <a
              href="#ai-planner"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2.5 text-base font-medium text-slate-700 hover:text-teal-600 active:text-teal-700"
            >
              <span className="px-2 py-0.5 text-xs font-semibold bg-teal-100 text-teal-800 rounded-full">
                AI
              </span>
              AI Travel Planner
            </a>
            <div className="pt-4 border-t border-slate-200 flex flex-col gap-2.5">
              <Link
                href="/login"
                className="w-full py-3 text-center text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-colors block"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="w-full py-3 text-center text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow transition-colors block"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================
          2. HERO SECTION & TRAVEL SEARCH / PLANNING CARD
      ========================================================= */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-slate-50 to-white pt-12 pb-20 md:pt-20 md:pb-32">
          {/* Subtle Background Glow Circles */}
          <div
            className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-teal-200/40 rounded-full blur-3xl pointer-events-none -z-10"
            aria-hidden="true"
          />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Text */}
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 text-teal-800 text-xs sm:text-sm font-medium mb-5 shadow-sm border border-teal-200">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                Find like-minded travel partners worldwide
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Find your people.{" "}
                <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-800 bg-clip-text text-transparent">
                  Explore the world together.
                </span>
              </h1>

              <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed">
                Connect with compatible travelers heading to your dream
                destinations. Match seamlessly whether your dates are exact,
                flexible, or anytime this month.
              </p>
            </div>

            {/* Travel Search / Planning Card */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/90 p-5 sm:p-7 md:p-9 max-w-4xl mx-auto">
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Top Row: Destination & Budget */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {/* Destination Input */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="destination-input"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
                    >
                      Destination
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <input
                        id="destination-input"
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Where to? (e.g. Bali, Tokyo, Paris, Ladakh)"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Budget Selector */}
                  <div>
                    <label
                      htmlFor="budget-select"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
                    >
                      Budget Preference
                    </label>
                    <div className="relative">
                      <select
                        id="budget-select"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all appearance-none cursor-pointer"
                      >
                        <option value="any">Any Budget</option>
                        <option value="budget">Backpacker (Budget)</option>
                        <option value="moderate">Moderate / Standard</option>
                        <option value="luxury">Luxury / Splurge</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Row: Travel Dates & Flexible Preferences */}
                <div className="border-t border-slate-100 pt-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                      When do you want to travel?
                    </span>
                    <span className="text-xs text-slate-600">
                      Match with people having similar schedule flexibility
                    </span>
                  </div>

                  {/* Date Preference Tabs */}
                  <div
                    className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4"
                    role="tablist"
                    aria-label="Travel Date Preference"
                  >
                    {[
                      { id: "exact", label: "Exact Date" },
                      { id: "range", label: "Date Range" },
                      { id: "month", label: "This Month" },
                      { id: "flexible", label: "Flexible Dates" },
                    ].map((tab) => {
                      const isActive = datePreference === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() =>
                            setDatePreference(
                              tab.id as "exact" | "range" | "month" | "flexible"
                            )
                          }
                          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all text-center border ${
                            isActive
                              ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Contextual Date Input based on tab */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    {datePreference === "exact" && (
                      <div>
                        <label
                          htmlFor="exact-date"
                          className="block text-xs font-medium text-slate-600 mb-1.5"
                        >
                          Select Departure Date
                        </label>
                        <input
                          id="exact-date"
                          type="date"
                          value={exactDate}
                          onChange={(e) => setExactDate(e.target.value)}
                          className="w-full sm:w-72 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    )}

                    {datePreference === "range" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label
                            htmlFor="start-date"
                            className="block text-xs font-medium text-slate-600 mb-1.5"
                          >
                            Earliest Departure
                          </label>
                          <input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="end-date"
                            className="block text-xs font-medium text-slate-600 mb-1.5"
                          >
                            Latest Return
                          </label>
                          <input
                            id="end-date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                      </div>
                    )}

                    {datePreference === "month" && (
                      <div>
                        <label
                          htmlFor="month-select"
                          className="block text-xs font-medium text-slate-600 mb-1.5"
                        >
                          Target Travel Month
                        </label>
                        <select
                          id="month-select"
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                          className="w-full sm:w-72 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="April 2026">April 2026</option>
                          <option value="May 2026">May 2026</option>
                          <option value="June 2026">June 2026</option>
                          <option value="July 2026">July 2026</option>
                          <option value="Autumn 2026">Autumn 2026</option>
                        </select>
                      </div>
                    )}

                    {datePreference === "flexible" && (
                      <div className="flex items-center gap-3 text-slate-700 text-sm">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 flex-shrink-0">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-xs sm:text-sm">
                            Anytime in the next 3 to 6 months
                          </p>
                          <p className="text-xs text-slate-600">
                            You will see the largest pool of travelers ready to
                            collaborate on dates.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-base sm:text-lg shadow-lg shadow-teal-600/25 hover:shadow-teal-600/35 active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 cursor-pointer"
                  >
                    <span>Find Travel Partners</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* =========================================================
            3. THREE CORE FEATURES SECTION
        ========================================================= */}
        <section id="explore" className="py-20 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2">
                Everything In One Place
              </h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Designed for modern explorers
              </p>
              <p className="mt-3 text-slate-600 text-base">
                Everything you need to turn travel dreams into shared adventures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1: Find Travel Partners */}
              <article
                id="partners"
                className="group p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-teal-500/40 hover:bg-white hover:shadow-xl hover:shadow-teal-900/5 transition-all flex flex-col"
              >
                <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Find Travel Partners
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">
                  Discover compatible buddies heading to the same destination.
                  Filter by exact dates or schedule flexibility, verify profiles,
                  and connect safely before heading out.
                </p>
                <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-200/60">
                  <li className="flex items-center gap-2">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>Compatible dates & destination matching</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>Connection requests & private messaging</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>Safety features: block and report anytime</span>
                  </li>
                </ul>
              </article>

              {/* Feature 2: Plan Your Trip with AI */}
              <article
                id="ai-planner"
                className="group p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-teal-500/40 hover:bg-white hover:shadow-xl hover:shadow-teal-900/5 transition-all flex flex-col"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Plan Your Trip with AI
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">
                  Let our smart AI Travel Assistant craft tailored day-by-day
                  itineraries and accurately estimate overall trip costs across
                  all major expense categories.
                </p>
                <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-200/60">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Hotel & accommodation cost forecasting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Food, local transit & activity breakdown</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Instant adjustments for group size & budget</span>
                  </li>
                </ul>
              </article>

              {/* Feature 3: Explore Hotels & Restaurants */}
              <article className="group p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-teal-500/40 hover:bg-white hover:shadow-xl hover:shadow-teal-900/5 transition-all flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Explore Hotels & Restaurants
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">
                  Discover places to stay and dine with verified community
                  ratings and live price ranges. View locations directly on
                  interactive maps for effortless navigation.
                </p>
                <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-200/60">
                  <li className="flex items-center gap-2">
                    <span className="text-sky-600 font-bold">✓</span>
                    <span>Up-to-date pricing & honest traveler reviews</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-sky-600 font-bold">✓</span>
                    <span>Interactive destination maps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-sky-600 font-bold">✓</span>
                    <span>Save favorites into shared group itineraries</span>
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* =========================================================
            4. HOW TRAVELMATE WORKS SECTION
        ========================================================= */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2">
                Simple & Transparent
              </h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                How TravelMate Works
              </p>
              <p className="mt-3 text-slate-600 text-base">
                Four simple steps from dreaming of a destination to traveling
                together.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
                <span className="inline-block w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-sm text-center leading-8 mb-4">
                  1
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Create your plan
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Post your destination, whether your dates are strict, a
                  particular month, or flexible, and your preferred vibe.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
                <span className="inline-block w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-sm text-center leading-8 mb-4">
                  2
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Find compatible travelers
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Browse matching profiles heading to the same spot during your
                  timeframe with matching budgets and interests.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
                <span className="inline-block w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-sm text-center leading-8 mb-4">
                  3
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Connect and chat
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Send connection requests, get accepted, and break the ice in a
                  private, safe and moderated messaging space.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
                <span className="inline-block w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-sm text-center leading-8 mb-4">
                  4
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Plan your trip together
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Co-create itineraries, get AI cost estimates for hotels &
                  food, split expenses, and embark on your journey!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            5. STRONG CALL-TO-ACTION (CTA) SECTION
        ========================================================= */}
        <section className="py-20 bg-gradient-to-tr from-slate-900 via-teal-950 to-slate-900 text-white relative overflow-hidden">
          {/* Decorative background glow */}
          <div
            className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to meet your next travel buddy?
            </h2>
            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Don’t let solo travel hold you back from discovering the world.
              Join thousands of travelers creating memories together.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-base shadow-lg shadow-teal-500/30 transition-all hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer"
              >
                Get Started Free
              </button>
              <button
                type="button"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
              >
                Explore Destinations
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-teal-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                100% Free to join
              </span>
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-teal-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified community profiles
              </span>
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-teal-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Privacy & safety first
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================
          6. CLEAN FOOTER
      ========================================================= */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Column 1: Brand */}
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
                  TM
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  TravelMate
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect with compatible travel partners, discover amazing places,
                and plan stress-free trips with AI.
              </p>
            </div>

            {/* Column 2: Discover */}
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                Discover
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#partners" className="hover:text-teal-400 transition-colors">
                    Find Partners
                  </a>
                </li>
                <li>
                  <a href="#explore" className="hover:text-teal-400 transition-colors">
                    Destinations
                  </a>
                </li>
                <li>
                  <a href="#ai-planner" className="hover:text-teal-400 transition-colors">
                    AI Trip Cost Estimator
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Flexible Date Search
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Community & Safety */}
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                Safety & Trust
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Verification Process
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Traveler Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Report & Block System
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Emergency Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Mobile & Future */}
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                Mobile App
              </h3>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                TravelMate mobile app will soon be available for iOS and Android,
                connecting directly to your plans.
              </p>
              <div className="inline-block px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-[11px] text-teal-400 font-medium">
                Coming Soon
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
              <p>© 2026 TravelMate. All rights reserved.</p>
              <span className="hidden sm:inline text-slate-700" aria-hidden="true">
                •
              </span>
              <p className="text-slate-400">
                Built by{" "}
                <span className="text-slate-200 font-medium">
                  Md Abdush Shamad Azam
                </span>
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
              <a href="#" className="hover:text-slate-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-slate-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-slate-400 transition-colors">
                Cookie Settings
              </a>
              <a
                href="https://github.com/Shamad-Azam"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Md Abdush Shamad Azam on GitHub (opens in a new tab)"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
