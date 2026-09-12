"use client";

import { useState } from "react";
import TripMapView from "./TripMapView";
import DayItineraryView from "./DayItineraryView";
import LiveWeatherWidget from "./LiveWeatherWidget";
import BudgetBreakdownView from "./BudgetBreakdownView";
import HotelStaysView from "./HotelStaysView";
import RealPlacesView from "./RealPlacesView";
import TripAiAssistant from "./TripAiAssistant";
import {
  ComputedRouteResult,
  DayItinerary,
  HotelRecommendation,
  TripBudgetEstimate,
  RealPlaceItem,
  DestinationWeatherData,
} from "@/lib/travel/types";

interface TripPlannerHubProps {
  tripId: string;
  destination: string;
  country: string;
  startLocation: string;
  travelStyle: string;
  travelers: number;
  userBudget: number;
  startDateFormatted: string;
  endDateFormatted: string;
  routeData: ComputedRouteResult;
  itinerary: DayItinerary[];
  weather: DestinationWeatherData;
  budgetData: TripBudgetEstimate;
  hotels: HotelRecommendation[];
  places: RealPlaceItem[];
}

export default function TripPlannerHub({
  destination,
  startLocation,
  travelStyle,
  travelers,
  userBudget,
  routeData,
  itinerary,
  weather,
  budgetData,
  hotels,
  places,
}: TripPlannerHubProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "itinerary" | "weather" | "budget" | "stays" | "places" | "ai"
  >("overview");

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory">
        {[
          { id: "overview", label: "🗺️ Interactive Map & Plan", badge: `${itinerary.length} Days` },
          { id: "weather", label: "🌤️ Live Weather", badge: `${weather.current.temperature}°C` },
          { id: "budget", label: "💰 Cost & Permits", badge: `₹${budgetData.totalMinINR.toLocaleString("en-IN")}` },
          { id: "stays", label: "🏨 Verified Accommodations", badge: `${hotels.length}` },
          { id: "places", label: "📍 Real Places", badge: `${places.length}` },
          { id: "ai", label: "✨ TravelMate AI Assistant", badge: "Live" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 snap-start flex-shrink-0 ${
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Main View Grid: Map + Side Info */}
      {(activeTab === "overview" || activeTab === "itinerary") && (
        <div className="space-y-8">
          {/* Top Section: Real Interactive Map */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Real Interactive Route Map
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 break-words">
                  {routeData.summary}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span>🛣️ <strong>{routeData.totalDistanceKm} km</strong> total</span>
                <span>⏱️ <strong>~{routeData.totalDurationHours} hrs</strong> total travel</span>
              </div>
            </div>

            {/* The Map Component */}
            <div className="h-[360px] sm:h-[520px] w-full">
              <TripMapView
                waypoints={routeData.waypoints}
                segments={routeData.segments}
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
              />
            </div>
          </div>

          {/* Bottom Section: Day-by-day Itinerary connected to Map */}
          <DayItineraryView
            itinerary={itinerary}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />
        </div>
      )}

      {/* Weather Tab */}
      {activeTab === "weather" && (
        <div className="space-y-6">
          <LiveWeatherWidget weather={weather} locationName={destination} />
        </div>
      )}

      {/* Budget Tab */}
      {activeTab === "budget" && (
        <BudgetBreakdownView budget={budgetData} userBudget={userBudget} />
      )}

      {/* Stays Tab */}
      {activeTab === "stays" && (
        <HotelStaysView hotels={hotels} destinationName={destination} />
      )}

      {/* Places Tab */}
      {activeTab === "places" && (
        <RealPlacesView places={places} destinationName={destination} />
      )}

      {/* AI Assistant Tab */}
      {activeTab === "ai" && (
        <TripAiAssistant
          destination={destination}
          startLocation={startLocation}
          travelStyle={travelStyle}
          budget={userBudget}
          travelers={travelers}
        />
      )}

      {/* When in overview, also show mini weather + budget teaser */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LiveWeatherWidget weather={weather} locationName={destination} />
          <TripAiAssistant
            destination={destination}
            startLocation={startLocation}
            travelStyle={travelStyle}
            budget={userBudget}
            travelers={travelers}
          />
        </div>
      )}
    </div>
  );
}
