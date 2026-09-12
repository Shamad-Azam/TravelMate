"use client";

import dynamic from "next/dynamic";
import { RouteSegment, RouteWaypoint } from "@/lib/travel/types";

// Dynamic import with ssr: false to prevent Leaflet "window is not defined" error
const TripMapClient = dynamic(() => import("./TripMapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[340px] sm:min-h-[500px] rounded-3xl bg-slate-100 animate-pulse border border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-3">
      <div className="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center text-2xl animate-bounce">
        🗺️
      </div>
      <p className="text-xs font-semibold text-slate-500">Loading interactive satellite and trail map...</p>
    </div>
  ),
});

interface TripMapViewProps {
  waypoints: RouteWaypoint[];
  segments: RouteSegment[];
  selectedDay: number | null;
  onSelectDay?: (day: number | null) => void;
}

export default function TripMapView(props: TripMapViewProps) {
  return <TripMapClient {...props} />;
}
