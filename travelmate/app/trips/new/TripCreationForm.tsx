"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveTripAction, SaveTripResult } from "../actions";

const POPULAR_DESTINATIONS = [
  { name: "Manali", country: "India", emoji: "🏔️", tagline: "Mountain adventures & Himalayan views" },
  { name: "Leh-Ladakh", country: "India", emoji: "🏔️", tagline: "High-altitude landscapes & monasteries" },
  { name: "Kashmir", country: "India", emoji: "🌄", tagline: "Heavenly valleys, lakes & snowy peaks" },
  { name: "Spiti Valley", country: "India", emoji: "🏔️", tagline: "Remote villages & ancient monasteries" },
  { name: "Rishikesh", country: "India", emoji: "🌊", tagline: "River rafting & yoga retreats" },
  { name: "Pokhara", country: "Nepal", emoji: "🏔️", tagline: "Lakeside calm under the Annapurnas" },
  { name: "Kathmandu", country: "Nepal", emoji: "🏛️", tagline: "Heritage temples & vibrant culture" },
  { name: "Everest Base Camp", country: "Nepal", emoji: "🥾", tagline: "Iconic Himalayan trekking route" },
];

const TRAVEL_TYPES = [
  { id: "adventure", label: "Adventure", emoji: "🧗" },
  { id: "trekking", label: "Trekking", emoji: "🥾" },
  { id: "cultural", label: "Cultural", emoji: "🏛️" },
  { id: "nature", label: "Nature", emoji: "🌲" },
  { id: "relaxation", label: "Relaxation", emoji: "🧘" },
  { id: "road-trip", label: "Road Trip", emoji: "🚗" },
];

const ACCOMMODATIONS = [
  { id: "hotel", label: "Hotel / Resort" },
  { id: "hostel", label: "Hostel / Backpacker" },
  { id: "homestay", label: "Local Homestay" },
  { id: "camping", label: "Campsite / Tents" },
  { id: "flexible", label: "Flexible" },
];

export default function TripCreationForm({ userName }: { userName: string }) {
  const [state, formAction, isPending] = useActionState<SaveTripResult | null, FormData>(
    saveTripAction,
    null
  );

  const [destination, setDestination] = useState("Manali");
  const [country, setCountry] = useState("India");
  const [travelers, setTravelers] = useState(2);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["adventure"]);
  const [accommodation, setAccommodation] = useState("hotel");

  const toggleType = (id: string) => {
    setSelectedTypes((prev) =>
      prev.includes(id)
        ? prev.filter((t) => t !== id)
        : [...prev, id]
    );
  };

  const selectDestination = (dest: (typeof POPULAR_DESTINATIONS)[0]) => {
    setDestination(dest.name);
    setCountry(dest.country);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white font-black text-sm shadow-md">
              TM
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-teal-700 to-slate-900 bg-clip-text text-transparent">
              TravelMate
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Header */}
      <section
        className="relative overflow-hidden bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: "url('/images/travel-hero.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/75 to-teal-950/65" />
        <div className="relative max-w-4xl mx-auto text-white">
          <span className="inline-block px-3 py-1 rounded-full bg-teal-500/25 border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-sm">
            Trip Planner
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Plan Your Next Adventure ✈️
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl">
            Fill in your travel details, set your budget, and save your journey to TravelMate.
          </p>
        </div>
      </section>

      {/* Main Form Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-16 relative z-10">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-10">
          {/* Error Alert */}
          {state?.error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold">Unable to save trip</p>
                <p className="text-xs mt-0.5">{state.error}</p>
              </div>
            </div>
          )}

          <form action={formAction} className="space-y-8">
            {/* 1. Destination & Country */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Where do you want to go?
                </h2>
              </div>

              {/* Popular quick picks */}
              <p className="text-xs text-slate-500 mb-2">Popular destinations:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                {POPULAR_DESTINATIONS.map((dest) => (
                  <button
                    key={dest.name}
                    type="button"
                    onClick={() => selectDestination(dest)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      destination === dest.name
                        ? "border-teal-600 bg-teal-50/70 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-900">{dest.name}</span>
                      <span>{dest.emoji}</span>
                    </div>
                    <span className="block text-[11px] text-slate-500 mt-0.5">
                      {dest.country}
                    </span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="destination" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Destination Name *
                  </label>
                  <input
                    id="destination"
                    name="destination"
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Manali, Bali, Tokyo"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                      state?.fieldErrors?.destination
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                    }`}
                  />
                  {state?.fieldErrors?.destination && (
                    <p className="text-xs text-red-600 mt-1">{state.fieldErrors.destination}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="country" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Country *
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. India, Nepal, Japan"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 2. Dates & Travelers */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  When & with how many people?
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Start Date *
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    required
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                      state?.fieldErrors?.startDate
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                    }`}
                  />
                  {state?.fieldErrors?.startDate && (
                    <p className="text-xs text-red-600 mt-1">{state.fieldErrors.startDate}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    End Date *
                  </label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    required
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                      state?.fieldErrors?.endDate
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                    }`}
                  />
                  {state?.fieldErrors?.endDate && (
                    <p className="text-xs text-red-600 mt-1">{state.fieldErrors.endDate}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="travelers" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Travelers *
                  </label>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setTravelers((prev) => Math.max(1, prev - 1))}
                      className="px-3.5 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
                    >
                      −
                    </button>
                    <input
                      id="travelers"
                      name="travelers"
                      type="number"
                      min={1}
                      max={50}
                      required
                      value={travelers}
                      onChange={(e) => setTravelers(Math.max(1, Number(e.target.value)))}
                      className="w-full text-center py-3 text-sm font-semibold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setTravelers((prev) => prev + 1)}
                      className="px-3.5 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Budget & Accommodation */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Budget & Preferences
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="budget" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Total Estimated Budget (₹ INR) *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">
                      ₹
                    </span>
                    <input
                      id="budget"
                      name="budget"
                      type="number"
                      min={100}
                      step={100}
                      defaultValue={25000}
                      required
                      placeholder="e.g. 25000"
                      className={`w-full pl-8 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                        state?.fieldErrors?.budget
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                      }`}
                    />
                  </div>
                  {state?.fieldErrors?.budget && (
                    <p className="text-xs text-red-600 mt-1">{state.fieldErrors.budget}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="accommodation" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Accommodation
                  </label>
                  <select
                    id="accommodation"
                    name="accommodation"
                    value={accommodation}
                    onChange={(e) => setAccommodation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white transition-all"
                  >
                    {ACCOMMODATIONS.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Travel Types */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Travel Style (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {TRAVEL_TYPES.map((type) => {
                  const active = selectedTypes.includes(type.id);
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => toggleType(type.id)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        active
                          ? "border-teal-600 bg-teal-600 text-white shadow-sm"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span>{type.emoji}</span>
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
              <input
                type="hidden"
                name="travelTypes"
                value={selectedTypes.join(", ") || "Adventure"}
              />
            </div>

            {/* 5. Special Requirements / Notes */}
            <div>
              <label htmlFor="requirements" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Special Requirements or Notes (Optional)
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows={3}
                placeholder="e.g. Vegetarian meals only, looking for hiking buddies, flexible return date"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/dashboard"
                className="px-5 py-3 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isPending}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Saving Trip to TravelMate...</span>
                  </>
                ) : (
                  <span>Save Trip to Dashboard 🧳</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
