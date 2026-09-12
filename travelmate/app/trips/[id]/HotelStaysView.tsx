"use client";

import { HotelRecommendation } from "@/lib/travel/types";

interface HotelStaysViewProps {
  hotels: HotelRecommendation[];
  destinationName: string;
}

export default function HotelStaysView({
  hotels,
  destinationName,
}: HotelStaysViewProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
              Verified Stays & Lodges
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {hotels.length} Properties
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Real Accommodations in {destinationName}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real verified lodgings. In compliance with data integrity policies, unverified inventory is strictly labeled as &quot;Price unavailable&quot;.
          </p>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 block">
                    {hotel.name.toLowerCase().includes("lodge") || hotel.name.toLowerCase().includes("camp") || hotel.name.toLowerCase().includes("house")
                      ? "🏔️ Mountain Teahouse Lodge"
                      : "🏨 Resort / Hotel"}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                    {hotel.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    📍 {hotel.location}
                  </p>
                </div>

                {hotel.rating && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 text-xs font-black border border-amber-200/80 flex-shrink-0">
                    <span>⭐️</span>
                    <span>{hotel.rating}</span>
                  </div>
                )}
              </div>

              {/* Amenities */}
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hotel.amenities.map((amenity: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Action Row */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                {hotel.isPriceAvailable && hotel.pricePerNightINR ? (
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      Live Offer
                    </span>
                    <strong className="text-lg font-black text-teal-800">
                      ₹{hotel.pricePerNightINR.toLocaleString("en-IN")}
                    </strong>
                    <span className="text-[11px] text-slate-500"> / night</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      Provider Pricing
                    </span>
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-200/80 text-slate-700 text-xs font-extrabold">
                      Price unavailable
                    </span>
                  </div>
                )}
              </div>

              {hotel.bookingUrl ? (
                <a
                  href={hotel.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto text-center justify-center min-h-[44px] flex items-center px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-teal-900 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Check Live Availability ↗
                </a>
              ) : (
                <span className="text-xs text-slate-500 font-medium self-start sm:self-auto">
                  Walk-in / Permit desk
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
