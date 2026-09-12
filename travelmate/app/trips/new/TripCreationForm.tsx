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

interface TripCreationFormProps {
  userName: string;
  initialDestination?: string;
  initialStartDate?: string;
  initialTravelers?: number;
  initialBudget?: number;
  initialStartLocation?: string;
}

interface DestinationSuggestion {
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  country: string;
  destinationType?: string;
  placeId?: string;
}

export default function TripCreationForm({
  userName,
  initialDestination,
  initialStartDate,
  initialTravelers,
  initialBudget,
  initialStartLocation,
}: TripCreationFormProps) {
  const [state, formAction, isPending] = useActionState<SaveTripResult | null, FormData>(
    saveTripAction,
    null
  );

  const [destination, setDestination] = useState(initialDestination || "Annapurna Base Camp");
  const [country, setCountry] = useState(initialDestination?.toLowerCase().includes("annapurna") ? "Nepal" : "India");
  const [startLocation, setStartLocation] = useState(initialStartLocation || "Delhi");
  const [latitude, setLatitude] = useState<number | null>(
    initialDestination?.toLowerCase().includes("annapurna") ? 28.5306 : null
  );
  const [longitude, setLongitude] = useState<number | null>(
    initialDestination?.toLowerCase().includes("annapurna") ? 83.8780 : null
  );
  const [destinationType, setDestinationType] = useState<string>(
    initialDestination?.toLowerCase().includes("annapurna") ? "Trek / Mountain Base Camp" : "City / Nature"
  );
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [travelStyle, setTravelStyle] = useState<string>("Comfort");

  // Autocomplete search states
  const [searchQuery, setSearchQuery] = useState(initialDestination || "");
  const [suggestions, setSuggestions] = useState<DestinationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [travelers, setTravelers] = useState(
    initialTravelers && initialTravelers > 0 ? initialTravelers : 2
  );
  const [budget, setBudget] = useState(initialBudget && initialBudget > 0 ? initialBudget : 35000);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["trekking", "adventure"]);
  const [accommodation, setAccommodation] = useState("hotel");

  // Live Geocoding Search handler
  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
    setDestination(query);

    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/travel/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.destinations || []);
        setShowDropdown(true);
      }
    } catch (err) {
      console.error("Geocoding search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSuggestion = (s: DestinationSuggestion) => {
    setDestination(s.name);
    setSearchQuery(s.displayName);
    setCountry(s.country);
    setLatitude(s.latitude);
    setLongitude(s.longitude);
    setDestinationType(s.destinationType || "Destination");
    setPlaceId(s.placeId || null);
    setShowDropdown(false);
  };

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
    <div className="flex-1">
      {/* Hero Header */}
      <section
        className="relative overflow-hidden bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: "url('/images/travel-hero.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/75 to-teal-950/65" />
        <div className="relative max-w-4xl mx-auto text-white">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 hover:text-white transition-colors mb-4"
          >
            ← Back to Dashboard
          </Link>
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-teal-500/25 border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-sm">
              Trip Planner
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Plan Your Next Adventure ✈️
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl">
            Fill in your travel details, set your budget, and save your journey to TravelMate.
          </p>
        </div>
      </section>

      {/* Main Form Section */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 -mt-6 pb-16 relative z-10">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-4 sm:p-10">
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
                {/* Destination Search with Live Geocoding Autocomplete */}
                <div className="relative">
                  <label htmlFor="destination" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Destination *</span>
                    {isSearching && (
                      <span className="text-[10px] text-teal-600 animate-pulse font-normal">
                        Searching real locations...
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      id="destination"
                      name="destination"
                      type="text"
                      required
                      autoComplete="off"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onFocus={() => {
                        if (suggestions.length > 0) setShowDropdown(true);
                      }}
                      placeholder="e.g. Annapurna Base Camp, Pokhara, Manali"
                      className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm focus:outline-none focus:ring-2 transition-all ${
                        state?.fieldErrors?.destination
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                      }`}
                    />
                    <span className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none text-sm">
                      📍
                    </span>
                  </div>

                  {/* Autocomplete Dropdown */}
                  {showDropdown && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 max-h-64 overflow-y-auto">
                      {suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelectSuggestion(s)}
                          className="w-full text-left px-4 py-3.5 min-h-[50px] active:bg-teal-100 hover:bg-teal-50 transition-colors flex items-start gap-3 cursor-pointer"
                        >
                          <span className="text-teal-600 text-lg mt-0.5 flex-shrink-0">📌</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-900 truncate">{s.name}</p>
                            <p className="text-xs text-slate-500 truncate">
                              {s.displayName} •{" "}
                              <span className="text-teal-700 font-medium">
                                {s.destinationType || "Destination"}
                              </span>
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

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
                    placeholder="e.g. Nepal, India, Japan"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Hidden Geospatial Coordinates */}
              <input type="hidden" name="latitude" value={latitude ?? ""} />
              <input type="hidden" name="longitude" value={longitude ?? ""} />
              <input type="hidden" name="destinationType" value={destinationType} />
              <input type="hidden" name="placeId" value={placeId ?? ""} />

              {/* Starting Location (Origin) */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <label htmlFor="startLocation" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Starting Location (Origin) *
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="startLocation"
                    name="startLocation"
                    type="text"
                    required
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    placeholder="e.g. Delhi, Mumbai, Kathmandu"
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {["Delhi", "Kathmandu", "Mumbai", "Pokhara"].map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => setStartLocation(city)}
                        className={`px-3.5 py-2.5 min-h-[42px] rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center ${
                          startLocation === city
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Used for authentic road/transit route mapping, travel duration, and transit fare calculation.
                </p>
              </div>

              {/* Travel Style */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Travel Style
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "Budget", label: "Budget Trekker", desc: "Local buses, teahouses, hostels", icon: "🎒" },
                    { id: "Comfort", label: "Comfort Explorer", desc: "Private jeeps, 3★ hotels, guided", icon: "✨" },
                    { id: "Luxury", label: "Premium / Luxury", desc: "Domestic flights, luxury lodges & resorts", icon: "👑" },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setTravelStyle(style.id)}
                      className={`p-3.5 min-h-[64px] rounded-2xl border text-left transition-all cursor-pointer ${
                        travelStyle === style.id
                          ? "border-teal-600 bg-teal-50/70 shadow-sm ring-1 ring-teal-600"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{style.icon}</span>
                        <strong className="text-xs sm:text-sm font-bold text-slate-900">{style.label}</strong>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{style.desc}</p>
                    </button>
                  ))}
                </div>
                <input type="hidden" name="travelStyle" value={travelStyle} />
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
                    defaultValue={initialStartDate}
                    className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm focus:outline-none focus:ring-2 transition-all ${
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
                    className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm focus:outline-none focus:ring-2 transition-all ${
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
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden h-[48px]">
                    <button
                      type="button"
                      onClick={() => setTravelers((prev) => Math.max(1, prev - 1))}
                      className="w-12 h-full min-w-[44px] min-h-[44px] bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-lg transition-colors cursor-pointer flex items-center justify-center"
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
                      className="w-full text-center py-2 text-base sm:text-sm font-semibold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setTravelers((prev) => prev + 1)}
                      className="w-12 h-full min-w-[44px] min-h-[44px] bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-lg transition-colors cursor-pointer flex items-center justify-center"
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
                      className={`w-full pl-8 pr-4 py-3 rounded-xl border text-base sm:text-sm focus:outline-none focus:ring-2 transition-all ${
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white transition-all"
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
                      className={`py-2.5 px-3 min-h-[44px] rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors text-center"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto px-8 py-3.5 min-h-[48px] rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
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
