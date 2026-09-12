"use client";

import { useState } from "react";
import { RealPlaceItem } from "@/lib/travel/types";

interface RealPlacesViewProps {
  places: RealPlaceItem[];
  destinationName: string;
}

export default function RealPlacesView({
  places,
  destinationName,
}: RealPlacesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Places", icon: "🌐" },
    { id: "attraction", label: "Attractions", icon: "🏛️" },
    { id: "viewpoint", label: "Viewpoints & Peaks", icon: "🌄" },
    { id: "restaurant", label: "Cafes & Dining", icon: "☕" },
    { id: "permit_office", label: "Permits & Checkposts", icon: "📋" },
  ];

  const filteredPlaces =
    selectedCategory === "all"
      ? places
      : places.filter((p) => p.category === selectedCategory);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider border border-amber-200">
              Verified Locations
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {places.length} Places Along Route
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Attractions, Viewpoints & Dining
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Key spots to explore in and around {destinationName}.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:flex-wrap scrollbar-none snap-x">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 snap-start flex-shrink-0 whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlaces.map((place) => (
          <div
            key={place.id}
            className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                  {place.category}
                </span>
                {place.rating && (
                  <span className="text-xs font-extrabold text-amber-900 flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-md">
                    ⭐️ {place.rating}
                  </span>
                )}
              </div>

              <h4 className="text-sm font-extrabold text-slate-900">
                {place.name}
              </h4>
              <p className="text-xs text-slate-500">📍 {place.address || "En-route location"}</p>
              {place.description && (
                <p className="text-xs text-slate-600 line-clamp-2 pt-1">
                  {place.description}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>
                {place.latitude.toFixed(3)}, {place.longitude.toFixed(3)}
              </span>
              <span className="text-teal-700 font-semibold font-sans">
                Verified Stop
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
