"use client";

import { DayItinerary } from "@/lib/travel/types";

interface DayItineraryViewProps {
  itinerary: DayItinerary[];
  selectedDay: number | null;
  onSelectDay: (day: number | null) => void;
}

export default function DayItineraryView({
  itinerary,
  selectedDay,
  onSelectDay,
}: DayItineraryViewProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider">
              Synchronized Map & Plan
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {itinerary.length} Days Total
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Day-by-Day Journey Itinerary
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Click any day below to highlight its specific route segment and camps on the interactive map.
          </p>
        </div>

        {selectedDay !== null && (
          <button
            type="button"
            onClick={() => onSelectDay(null)}
            className="self-start sm:self-center px-4 py-2 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-2"
          >
            <span>Clear Day Filter</span>
            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center">
              ✕
            </span>
          </button>
        )}
      </div>

      {/* Vertical Itinerary Timeline */}
      <div className="space-y-4 relative">
        {itinerary.map((item, index) => {
          const isActive = selectedDay === item.day;

          return (
            <div
              key={item.day}
              onClick={() => onSelectDay(isActive ? null : item.day)}
              className={`rounded-2xl border transition-all cursor-pointer p-4 sm:p-5 relative ${
                isActive
                  ? "border-purple-600 bg-purple-50/40 shadow-md ring-2 ring-purple-600/30"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
              }`}
            >
              {/* Day Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <span
                    className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive
                        ? "bg-purple-700 text-white shadow-sm"
                        : "bg-teal-600 text-white"
                    }`}
                  >
                    D{item.day}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium truncate">
                      {item.fromLocation} → {item.toLocation}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 self-start sm:self-auto text-[11px] sm:text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                    🚶 {item.distanceKm} km
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                    ⏱️ {item.estimatedTravelTime}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60">
                    ₹{item.estimatedCostINR.min.toLocaleString("en-IN")} - ₹{item.estimatedCostINR.max.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Day Details (Expanded when active or compact view) */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Activities */}
                <div>
                  <span className="font-bold text-slate-700 block mb-1.5 uppercase tracking-wider text-[10px]">
                    Key Activities & Milestones
                  </span>
                  <ul className="space-y-1 text-slate-600">
                    {item.activities.map((act, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-teal-600 mt-0.5">•</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stays & Meals */}
                <div className="space-y-2.5">
                  <div>
                    <span className="font-bold text-slate-700 block mb-0.5 uppercase tracking-wider text-[10px]">
                      Recommended Stay / Area
                    </span>
                    <p className="text-slate-800 font-medium">
                      🏨 {item.accommodationArea}
                    </p>
                  </div>

                  {item.meals && (
                    <div>
                      <span className="font-bold text-slate-700 block mb-0.5 uppercase tracking-wider text-[10px]">
                        Meals & Nutrition
                      </span>
                      <p className="text-slate-600">
                        🥣 {item.meals.breakfast} • 🍛 {item.meals.lunch} • 🍲 {item.meals.dinner}
                      </p>
                    </div>
                  )}

                  {item.notes && (
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-900 text-[11px]">
                      <strong>Tip:</strong> {item.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Map Sync Indicator */}
              <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-purple-700 font-bold">
                <span>{isActive ? "📍 Map focused on this day's waypoints" : "👉 Tap to view Day " + item.day + " on map"}</span>
                <span className="text-slate-400 font-normal">Transport: {item.transportMode}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
