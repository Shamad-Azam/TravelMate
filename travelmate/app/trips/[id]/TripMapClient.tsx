"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RouteSegment, RouteWaypoint } from "@/lib/travel/types";

interface TripMapClientProps {
  waypoints: RouteWaypoint[];
  segments: RouteSegment[];
  selectedDay: number | null;
  onSelectDay?: (day: number | null) => void;
}

const TYPE_COLORS: Record<string, { bg: string; border: string; label: string; icon: string }> = {
  start: { bg: "#2563eb", border: "#1d4ed8", label: "Starting Point", icon: "🛫" },
  transit: { bg: "#0284c7", border: "#0369a1", label: "Transit City", icon: "🏙️" },
  trailhead: { bg: "#d97706", border: "#b45309", label: "Trailhead", icon: "🥾" },
  trek_camp: { bg: "#059669", border: "#047857", label: "Trekking Camp", icon: "⛺" },
  destination: { bg: "#dc2626", border: "#b91c1c", label: "Summit Destination", icon: "🚩" },
  viewpoint: { bg: "#7c3aed", border: "#6d28d9", label: "Viewpoint", icon: "🌄" },
  attraction: { bg: "#ec4899", border: "#db2777", label: "Attraction", icon: "🏛️" },
};

export default function TripMapClient({
  waypoints,
  segments,
  selectedDay,
  onSelectDay,
}: TripMapClientProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylinesLayerRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [activeWaypoint, setActiveWaypoint] = useState<RouteWaypoint | null>(null);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false,
    }).setView([28.3, 83.8], 8);

    // Beautiful CartoDB Voyager tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    polylinesLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // ResizeObserver ensures Leaflet tiles redraw on mobile screen rotation or tab switch
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    const handleWindowResize = () => {
      map.invalidateSize();
    };
    window.addEventListener("resize", handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Render Polylines and Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !polylinesLayerRef.current || !markersLayerRef.current) return;

    polylinesLayerRef.current.clearLayers();
    markersLayerRef.current.clearLayers();

    const allLatLngs: L.LatLngExpression[] = [];

    // Draw Segments
    segments.forEach((seg) => {
      const isHighlighted = selectedDay !== null && seg.day === selectedDay;
      const isDimmed = selectedDay !== null && seg.day !== selectedDay;

      let color = "#2563eb"; // road
      let dashArray: string | undefined = undefined;
      let weight = 4;
      let opacity = 0.85;

      if (seg.mode === "trekking") {
        color = "#059669"; // emerald for trek trail
        dashArray = "6, 6";
        weight = 5;
      } else if (seg.mode === "flight") {
        color = "#0284c7"; // sky
        dashArray = "4, 8";
        weight = 3;
        opacity = 0.7;
      }

      if (isHighlighted) {
        color = "#7c3aed"; // vibrant violet highlight
        weight = 7;
        opacity = 1.0;
        dashArray = seg.mode === "trekking" ? "8, 6" : undefined;
      } else if (isDimmed) {
        opacity = 0.25;
        weight = Math.max(2, weight - 2);
      }

      const polyline = L.polyline(seg.coordinates, {
        color,
        weight,
        opacity,
        dashArray,
      });

      polyline.bindTooltip(
        `<strong>${seg.from} → ${seg.to}</strong><br/>${seg.mode.toUpperCase()} • ${seg.distanceKm} km ~ ${seg.durationHours}h`,
        { sticky: true }
      );

      polyline.on("click", () => {
        if (seg.day && onSelectDay) {
          onSelectDay(seg.day);
        }
      });

      polylinesLayerRef.current?.addLayer(polyline);
      seg.coordinates.forEach((coord) => allLatLngs.push(coord));
    });

    // Draw Waypoint Markers
    waypoints.forEach((wp) => {
      const typeInfo = TYPE_COLORS[wp.type] || TYPE_COLORS.transit;
      const isHighlighted = selectedDay !== null && wp.day === selectedDay;
      const isDimmed = selectedDay !== null && wp.day !== undefined && wp.day !== selectedDay;

      const size = isHighlighted ? 38 : 32;

      const iconHtml = `
        <div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: ${typeInfo.bg};
          border: 3px solid ${isHighlighted ? "#ffffff" : typeInfo.border};
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${size > 34 ? 18 : 15}px;
          color: white;
          cursor: pointer;
          opacity: ${isDimmed ? 0.4 : 1.0};
          transform: ${isHighlighted ? "scale(1.15)" : "scale(1)"};
          transition: transform 0.2s ease, opacity 0.2s ease;
        ">
          ${typeInfo.icon}
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-travel-marker",
        html: iconHtml,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
      });

      const marker = L.marker([wp.latitude, wp.longitude], { icon: customIcon });

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; min-width: 220px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background: ${typeInfo.bg}20; color: ${typeInfo.bg}; padding: 2px 8px; border-radius: 9999px;">
              ${typeInfo.label}
            </span>
            ${wp.elevation ? `<span style="font-size: 11px; font-weight: 800; color: #047857; background: #ecfdf5; padding: 2px 6px; border-radius: 4px;">🏔️ ${wp.elevation}m</span>` : ""}
          </div>
          <h4 style="margin: 4px 0 2px 0; font-size: 14px; font-weight: 800; color: #0f172a;">${wp.name}</h4>
          ${wp.description ? `<p style="margin: 0 0 6px 0; font-size: 12px; color: #475569; line-height: 1.4;">${wp.description}</p>` : ""}
          <div style="border-top: 1px solid #e2e8f0; padding-top: 4px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between;">
            <span>📍 ${wp.latitude.toFixed(4)}, ${wp.longitude.toFixed(4)}</span>
            ${wp.day ? `<span>Day ${wp.day}</span>` : ""}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on("click", () => {
        setActiveWaypoint(wp);
      });

      markersLayerRef.current?.addLayer(marker);
      allLatLngs.push([wp.latitude, wp.longitude]);
    });

    // Fit map bounds
    if (selectedDay !== null) {
      // Find coordinates for this day
      const dayCoords: L.LatLngExpression[] = [];
      waypoints
        .filter((w) => w.day === selectedDay)
        .forEach((w) => dayCoords.push([w.latitude, w.longitude]));
      segments
        .filter((s) => s.day === selectedDay)
        .forEach((s) => s.coordinates.forEach((c) => dayCoords.push(c)));

      if (dayCoords.length > 0) {
        const dayBounds = L.latLngBounds(dayCoords);
        map.fitBounds(dayBounds, { padding: [60, 60], maxZoom: 13, animate: true });
      }
    } else if (allLatLngs.length > 0) {
      const bounds = L.latLngBounds(allLatLngs);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [waypoints, segments, selectedDay, onSelectDay]);

  const handleResetView = () => {
    if (onSelectDay) onSelectDay(null);
    if (!mapInstanceRef.current || waypoints.length === 0) return;
    const all = waypoints.map((w) => [w.latitude, w.longitude] as [number, number]);
    mapInstanceRef.current.fitBounds(L.latLngBounds(all), { padding: [50, 50], animate: true });
  };

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 flex flex-col">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[340px] sm:min-h-[500px] z-0" />

      {/* Floating Control & Legend Header */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 z-10 pointer-events-none flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
        <div className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl border border-slate-200 shadow-md pointer-events-auto flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px]">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            <span className="font-bold text-slate-700">Road</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-emerald-600 inline-block" />
            <span className="font-bold text-emerald-700">Trek</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-sky-500 inline-block" />
            <span className="font-bold text-sky-600">Flight</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {selectedDay !== null && (
            <button
              type="button"
              onClick={handleResetView}
              className="px-2.5 py-1.5 min-h-[36px] rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-[11px] sm:text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Day {selectedDay}</span>
              <span className="text-[10px] bg-white/20 px-1 py-0.5 rounded-full">✕</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleResetView}
            className="px-2.5 py-1.5 min-h-[36px] rounded-xl bg-white/95 hover:bg-white text-slate-800 text-[11px] sm:text-xs font-bold shadow-md border border-slate-200 transition-all cursor-pointer flex items-center gap-1"
          >
            🗺️ Full Route
          </button>
        </div>
      </div>

      {/* Selected Waypoint Preview Card */}
      {activeWaypoint && (
        <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-xl pointer-events-auto max-w-md mx-auto flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {TYPE_COLORS[activeWaypoint.type]?.icon || "📍"}
                </span>
                <h4 className="font-extrabold text-sm text-slate-900">
                  {activeWaypoint.name}
                </h4>
                {activeWaypoint.elevation && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    🏔️ {activeWaypoint.elevation}m
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">
                {activeWaypoint.description}
              </p>
              <div className="text-[10px] text-slate-400 font-mono pt-1">
                Coordinates: {activeWaypoint.latitude.toFixed(4)}, {activeWaypoint.longitude.toFixed(4)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveWaypoint(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
