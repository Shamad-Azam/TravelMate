import { ExchangeRateResult } from "./types";

const rateCache = new Map<string, { rate: number; expiresAt: number; updatedAt: string }>();

// Standard pegged/typical approximate fallback rates to INR if live API is temporarily unreachable
const FALLBACK_INR_RATES: Record<string, number> = {
  INR: 1.0,
  NPR: 0.625, // 1 NPR = 0.625 INR (pegged 1.60 NPR = 1 INR)
  USD: 87.2,
  EUR: 92.5,
  GBP: 110.4,
  AED: 23.7,
  THB: 2.5,
  SGD: 65.0,
  JPY: 0.58,
};

/**
 * Fetches live exchange rate to INR using Open Exchange Rates / Frankfurter.
 */
export async function getExchangeRateToINR(fromCurrency: string): Promise<ExchangeRateResult> {
  const code = fromCurrency.toUpperCase().trim();
  if (code === "INR") {
    return {
      from: "INR",
      to: "INR",
      rate: 1.0,
      updatedAt: new Date().toISOString(),
      source: "Base Currency",
    };
  }

  // NPR is officially pegged to INR at 1 INR = 1.60 NPR (1 NPR = 0.625 INR)
  if (code === "NPR") {
    return {
      from: "NPR",
      to: "INR",
      rate: 0.625,
      updatedAt: new Date().toISOString(),
      source: "Nepal Rastra Bank Official Pegged Rate (1.60 NPR = 1 INR)",
    };
  }

  const cached = rateCache.get(code);
  if (cached && Date.now() < cached.expiresAt) {
    return {
      from: code,
      to: "INR",
      rate: cached.rate,
      updatedAt: cached.updatedAt,
      source: "Live Exchange Rate API (Cached)",
    };
  }

  try {
    // Try Frankfurter API (European Central Bank data)
    const resp = await fetch(`https://api.frankfurter.app/latest?from=${code}&to=INR`, {
      next: { revalidate: 3600 },
    });

    if (resp.ok) {
      const data = await resp.json();
      const inrRate = data.rates?.INR;
      if (typeof inrRate === "number") {
        const result: ExchangeRateResult = {
          from: code,
          to: "INR",
          rate: inrRate,
          updatedAt: data.date || new Date().toISOString(),
          source: "European Central Bank via Frankfurter",
        };
        rateCache.set(code, {
          rate: inrRate,
          expiresAt: Date.now() + 60 * 60 * 1000,
          updatedAt: result.updatedAt,
        });
        return result;
      }
    }
  } catch (error) {
    console.warn(`[Currency Service] Frankfurter failed for ${code}, trying backup:`, error);
  }

  try {
    // Backup: open.er-api.com
    const resp = await fetch(`https://open.er-api.com/v6/latest/${code}`, {
      next: { revalidate: 3600 },
    });
    if (resp.ok) {
      const data = await resp.json();
      const inrRate = data.rates?.INR;
      if (typeof inrRate === "number") {
        const result: ExchangeRateResult = {
          from: code,
          to: "INR",
          rate: inrRate,
          updatedAt: data.time_last_update_utc || new Date().toISOString(),
          source: "Open Exchange Rates API",
        };
        rateCache.set(code, {
          rate: inrRate,
          expiresAt: Date.now() + 60 * 60 * 1000,
          updatedAt: result.updatedAt,
        });
        return result;
      }
    }
  } catch (error) {
    console.warn(`[Currency Service] Backup open.er-api failed for ${code}:`, error);
  }

  // Fallback if network fails
  const fallback = FALLBACK_INR_RATES[code] || 1.0;
  return {
    from: code,
    to: "INR",
    rate: fallback,
    updatedAt: new Date().toISOString(),
    source: "Estimated Currency Benchmark (Live Service Offline)",
  };
}

/**
 * Converts any currency amount to Indian Rupees (INR).
 */
export async function convertToINR(
  amount: number,
  fromCurrency: string
): Promise<{ amountINR: number; rate: number; updatedAt: string; source: string }> {
  const result = await getExchangeRateToINR(fromCurrency);
  const amountINR = Math.round(amount * result.rate);
  return {
    amountINR,
    rate: result.rate,
    updatedAt: result.updatedAt,
    source: result.source,
  };
}
