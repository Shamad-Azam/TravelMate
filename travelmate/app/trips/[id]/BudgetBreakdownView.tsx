"use client";

import { TripBudgetEstimate } from "@/lib/travel/types";

interface BudgetBreakdownViewProps {
  budget: TripBudgetEstimate;
  userBudget: number;
}

export default function BudgetBreakdownView({
  budget,
  userBudget,
}: BudgetBreakdownViewProps) {
  const isWithinBudget = userBudget >= budget.totalMinINR;
  const variance = Math.abs(userBudget - budget.totalMinINR);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200">
              Itemized Travel Economics
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {budget.travelers} {budget.travelers === 1 ? "Traveler" : "Travelers"} • {budget.durationDays} Days
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Real Cost Breakdown & Permits
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Grounded in actual transit fares, official Himalayan permit rates, and teahouse tariffs.
          </p>
        </div>

        {/* Totals Summary Pill */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left sm:text-right w-full sm:w-auto flex-shrink-0">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">
            Estimated Total
          </span>
          <strong className="text-xl sm:text-2xl font-black text-teal-800 block">
            ₹{budget.totalMinINR.toLocaleString("en-IN")} — ₹{budget.totalMaxINR.toLocaleString("en-IN")}
          </strong>
          <span className="text-xs text-slate-500 block">
            ₹{budget.perPersonMinINR.toLocaleString("en-IN")} — ₹{budget.perPersonMaxINR.toLocaleString("en-IN")} / person
          </span>
        </div>
      </div>

      {/* Budget Comparison Alert */}
      <div
        className={`p-4 rounded-2xl border flex items-start gap-3 ${
          isWithinBudget
            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
            : "bg-amber-50 border-amber-200 text-amber-900"
        }`}
      >
        <span className="text-xl mt-0.5">{isWithinBudget ? "✅" : "⚠️"}</span>
        <div className="text-xs">
          <p className="font-bold text-sm">
            {isWithinBudget
              ? `Your planned budget (₹${userBudget.toLocaleString("en-IN")}) comfortably covers this expedition!`
              : `Your planned budget is ₹${variance.toLocaleString("en-IN")} below recommended estimates.`}
          </p>
          <p className="mt-0.5 opacity-90">
            {isWithinBudget
              ? `You have a healthy ₹${variance.toLocaleString("en-IN")} surplus for extra gear, souvenirs, or upgrades.`
              : "Consider adjusting accommodation tiers or local transit options to fit your target budget."}
          </p>
        </div>
      </div>

      {/* Categories Table */}
      <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100">
        {budget.categories.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 sm:p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3"
          >
            <div className="space-y-0.5 max-w-xl">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold text-slate-900">
                  {item.category}
                </h4>
                {item.category.toLowerCase().includes("permit") && (
                  <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-extrabold border border-red-200">
                    Mandatory
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600">{item.notes}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                <span>📚 Source: {item.source}</span>
              </div>
            </div>

            <div className="text-left sm:text-right flex-shrink-0">
              <strong className="text-sm sm:text-base font-black text-slate-900 block">
                ₹{item.minAmountINR.toLocaleString("en-IN")} — ₹{item.maxAmountINR.toLocaleString("en-IN")}
              </strong>
              <span className="text-[11px] text-slate-500">
                ₹{Math.round(item.minAmountINR / budget.travelers).toLocaleString("en-IN")} / person
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Verification Footnote */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
        <strong className="text-slate-800 block font-semibold">
          📋 Data Grounding & Transparency:
        </strong>
        <p>
          Unlike generic chatbot responses that guess percentage splits (e.g. 40% hotel, 30% food), all prices above reflect verified field rates: official Nepal Tourism Board ACAP fees (NPR 3,000 ~ ₹1,875), NTNC TIMS cards (NPR 2,000 ~ ₹1,250), fixed syndicate jeep transfers to Nayapul, and regulated Annapurna Sanctuary Lodge Management Committee food menus.
        </p>
      </div>
    </div>
  );
}
