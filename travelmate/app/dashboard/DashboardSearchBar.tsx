"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardSearchBar() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"destination" | "dates" | "travellers" | "budget">("destination");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState("40000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (startDate) params.set("startDate", startDate);
    if (travelers) params.set("travelers", travelers.toString());
    if (budget) params.set("budget", budget);
    router.push(`/trips/new?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-3.5 sm:p-5 max-w-2xl w-full">
      {/* Scrollable Tabs on mobile with touch support */}
      <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-100 pb-2.5 mb-3.5 overflow-x-auto no-scrollbar overscroll-x-contain">
        <button
          type="button"
          onClick={() => setActiveTab("destination")}
          className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold pb-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
            activeTab === "destination"
              ? "text-blue-600 border-b-2 border-blue-600 font-extrabold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>📍</span>
          <span>Destination</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("dates")}
          className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold pb-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
            activeTab === "dates"
              ? "text-blue-600 border-b-2 border-blue-600 font-extrabold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>📅</span>
          <span>Dates</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("travellers")}
          className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold pb-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
            activeTab === "travellers"
              ? "text-blue-600 border-b-2 border-blue-600 font-extrabold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>👥</span>
          <span>Travellers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("budget")}
          className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold pb-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
            activeTab === "budget"
              ? "text-blue-600 border-b-2 border-blue-600 font-extrabold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>💼</span>
          <span>Budget</span>
        </button>
      </div>

      {/* Form Fields - Mobile friendly */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
        {activeTab === "destination" && (
          <div className="relative flex-1 w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where do you want to go?"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all min-h-[48px]"
            />
          </div>
        )}

        {activeTab === "dates" && (
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold mb-0.5 sm:hidden">START DATE</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 min-h-[44px]"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold mb-0.5 sm:hidden">END DATE</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 min-h-[44px]"
              />
            </div>
          </div>
        )}

        {activeTab === "travellers" && (
          <div className="flex-1 w-full flex items-center justify-between gap-3 bg-slate-50 px-4 py-2 border border-slate-200 rounded-2xl min-h-[48px]">
            <span className="text-xs font-semibold text-slate-700">
              Travelers:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTravelers((t) => Math.max(1, t - 1))}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-center text-base cursor-pointer"
                aria-label="Decrease travelers"
              >
                −
              </button>
              <span className="font-extrabold text-sm text-slate-900 w-8 text-center">
                {travelers}
              </span>
              <button
                type="button"
                onClick={() => setTravelers((t) => t + 1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-center text-base cursor-pointer"
                aria-label="Increase travelers"
              >
                +
              </button>
            </div>
          </div>
        )}

        {activeTab === "budget" && (
          <div className="relative flex-1 w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">
              ₹
            </span>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 40000"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 min-h-[48px]"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all cursor-pointer whitespace-nowrap min-h-[48px] flex items-center justify-center"
        >
          Search
        </button>
      </form>
    </div>
  );
}
