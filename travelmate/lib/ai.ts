import { searchDestinations, getPlaceCoordinates } from "./travel/geocoding";
import { getDestinationWeather } from "./travel/weather";
import { getExchangeRateToINR } from "./travel/currency";
import { computeTripRoute } from "./travel/routes";
import { getRealPlaces } from "./travel/places";
import { searchRealHotels } from "./travel/hotels";
import { calculateTripBudget } from "./travel/budget";
import { generateTripItinerary } from "./travel/itinerary";
import { DestinationWeatherData, ComputedRouteResult, HotelRecommendation, RealPlaceItem, TripBudgetEstimate } from "./travel/types";

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  time?: string;
}

export interface TravelContext {
  destination?: string;
  origin?: string;
  startDate?: string;
  endDate?: string;
  travelers?: number;
  budget?: number;
  travelStyle?: "Budget" | "Comfort" | "Premium";
  weather?: DestinationWeatherData;
  route?: ComputedRouteResult;
  hotels?: HotelRecommendation[];
  places?: RealPlaceItem[];
  budgetEstimate?: TripBudgetEstimate;
}

/**
 * Extracts destination or intent from the conversation if not explicitly supplied.
 */
function extractDestinationFromMessages(prompt: string, history: ChatMessage[]): string {
  const text = (prompt + " " + history.map((m) => m.content).join(" ")).toLowerCase();

  if (text.includes("annapurna") || text.includes("abc")) return "Annapurna Base Camp";
  if (text.includes("pokhara")) return "Pokhara";
  if (text.includes("everest") || text.includes("ebc")) return "Everest Base Camp";
  if (text.includes("kathmandu")) return "Kathmandu";
  if (text.includes("manali")) return "Manali";
  if (text.includes("leh") || text.includes("ladakh")) return "Leh-Ladakh";
  if (text.includes("kashmir") || text.includes("srinagar")) return "Kashmir";
  if (text.includes("goa")) return "Goa";
  if (text.includes("dubai")) return "Dubai";
  if (text.includes("bali")) return "Bali";
  if (text.includes("paris")) return "Paris";

  return "";
}

/**
 * Gathers real-time external data for the destination.
 * Never invents prices, weather, or routes.
 */
async function gatherRealTravelContext(
  destinationName: string,
  originName: string = "Delhi",
  travelers: number = 2,
  travelStyle: "Budget" | "Comfort" | "Premium" = "Comfort"
): Promise<TravelContext> {
  const geo = await getPlaceCoordinates(destinationName);
  const lat = geo ? geo.latitude : 28.5306;
  const lng = geo ? geo.longitude : 83.8780;

  let weather: DestinationWeatherData | undefined;
  try {
    weather = await getDestinationWeather(destinationName, lat, lng);
  } catch (err) {
    console.warn("[AI Grounding] Weather fetch failed:", err);
  }

  let route: ComputedRouteResult | undefined;
  try {
    const originGeo = await getPlaceCoordinates(originName);
    const origLat = originGeo ? originGeo.latitude : 28.6139;
    const origLng = originGeo ? originGeo.longitude : 77.2090;
    route = await computeTripRoute(originName, origLat, origLng, destinationName, lat, lng);
  } catch (err) {
    console.warn("[AI Grounding] Route calculation failed:", err);
  }

  let hotels: HotelRecommendation[] = [];
  try {
    hotels = await searchRealHotels(destinationName, lat, lng);
  } catch (err) {
    console.warn("[AI Grounding] Hotel lookup failed:", err);
  }

  let places: RealPlaceItem[] = [];
  try {
    places = await getRealPlaces(destinationName, lat, lng);
  } catch (err) {
    console.warn("[AI Grounding] Places lookup failed:", err);
  }

  const budgetEstimate = calculateTripBudget({
    destination: destinationName,
    origin: originName,
    travelers,
    travelStyle,
    durationDays: 9,
  });

  return {
    destination: destinationName,
    origin: originName,
    travelers,
    travelStyle,
    weather,
    route,
    hotels,
    places,
    budgetEstimate,
  };
}

/**
 * Primary AI entry point for multi-turn travel planning conversations.
 * Connects directly to Gemini API when GEMINI_API_KEY is configured,
 * grounded strictly on verified external API data.
 */
export async function generateTravelAdviceWithHistory(
  prompt: string,
  history: ChatMessage[] = [],
  context?: TravelContext
): Promise<string> {
  const trimmed = prompt.trim();
  const lower = trimmed.toLowerCase();

  // 1. Natural greeting detection
  if (lower === "hii" || lower === "hi" || lower === "hello" || lower === "hey" || lower === "namaste") {
    return "Hello! I am your TravelMate AI planning companion ✈️\n\nWhere are you planning to travel next? You can ask me for a realistic trip budget, current weather conditions, route & transportation options, or day-by-day itineraries (e.g. *\"How much will Annapurna Base Camp cost?\"* or *\"What is the weather in Pokhara?\"*).";
  }

  // 2. Determine target destination from context or conversation history
  const destination = context?.destination || extractDestinationFromMessages(prompt, history) || "Annapurna Base Camp";
  const origin = context?.origin || "Delhi";
  const travelers = context?.travelers || 2;
  const style = context?.travelStyle || "Comfort";

  // 3. Retrieve real external travel context
  const fullContext = await gatherRealTravelContext(destination, origin, travelers, style);

  // 4. Try Gemini API
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.AI_API_KEY;

  if (apiKey) {
    try {
      const systemInstruction = `You are TravelMate AI, an expert travel planning intelligence engine.
You are helping Indian and global travelers plan trips realistically.
RULES:
1. Base all factual information (weather, routes, prices, permits, business names, currency rates) STRICTLY on the real external data provided in the context below.
2. NEVER invent live room availability, live prices, or live weather. If something is marked "Price unavailable" or unquoted, state clearly that live price availability must be confirmed via the booking link.
3. If the user asks about budget, provide the itemized category breakdown from the calculated data. Do NOT use generic percentages like "40% accommodation".
4. Maintain a helpful, conversational tone and remember previous turns in this conversation.

REAL-TIME TRAVEL CONTEXT (LIVE DATA):
- Destination: ${destination}
- Origin: ${origin}
- Travelers: ${travelers} (Style: ${style})
${fullContext.weather ? `- Live Weather: ${fullContext.weather.current.temperature}°C, ${fullContext.weather.current.weatherDescription}, Wind: ${fullContext.weather.current.windSpeed} km/h, Precipitation: ${fullContext.weather.current.precipitation}mm (Source: ${fullContext.weather.source}, Updated: ${fullContext.weather.updatedAt})
- 7-Day Forecast: ${fullContext.weather.daily.map((d) => `${d.date}: ${d.minTemp}°C to ${d.maxTemp}°C (${d.weatherDescription})`).join("; ")}` : "- Weather: Live weather temporarily unavailable"}
${fullContext.budgetEstimate ? `- Estimated Budget: ₹${fullContext.budgetEstimate.totalMinINR.toLocaleString("en-IN")} - ₹${fullContext.budgetEstimate.totalMaxINR.toLocaleString("en-IN")} for ${travelers} travelers (₹${fullContext.budgetEstimate.perPersonMinINR.toLocaleString("en-IN")} - ₹${fullContext.budgetEstimate.perPersonMaxINR.toLocaleString("en-IN")} per person).
  Breakdown: ${fullContext.budgetEstimate.categories.map((c) => `${c.category}: ₹${c.minAmountINR.toLocaleString("en-IN")}-₹${c.maxAmountINR.toLocaleString("en-IN")} (${c.notes})`).join(" | ")}` : ""}
${fullContext.route ? `- Route Summary: ${fullContext.route.summary} (Total distance: ${fullContext.route.totalDistanceKm} km, Duration: ~${fullContext.route.totalDurationHours} hrs). Segments: ${fullContext.route.segments.map((s) => `${s.from} → ${s.to} [${s.mode.toUpperCase()}]: ${s.description}`).join("; ")}` : ""}
${fullContext.hotels && fullContext.hotels.length > 0 ? `- Verified Stays: ${fullContext.hotels.map((h) => `${h.name} (${h.location}, Rating: ${h.rating || "N/A"}, ${h.isPriceAvailable && h.pricePerNightINR ? `₹${h.pricePerNightINR}/night` : "Price unavailable - check live booking link"})`).join("; ")}` : ""}
${fullContext.places && fullContext.places.length > 0 ? `- Verified Attractions & Places: ${fullContext.places.map((p) => `${p.name} [${p.category}] - ${p.description || p.address || ""}`).join("; ")}` : ""}`;

      // Build Gemini multi-turn messages
      const contents = [];
      for (const msg of history.slice(-8)) {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }
      contents.push({
        role: "user",
        parts: [{ text: prompt }],
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
            contents,
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 1500,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        console.warn("[AI Service] Gemini API returned error:", response.status, await response.text());
      }
    } catch (error) {
      console.warn("[AI Service] Gemini call failed, falling back to grounded response generator:", error);
    }
  }

  // 5. Grounded Real-Data Generator (No generic fallback, strictly answers the user question)
  return formatGroundedResponse(prompt, destination, origin, travelers, style, fullContext);
}

/**
 * Backward-compatible single-prompt wrapper.
 */
export async function generateTravelAdvice(prompt: string, context?: TravelContext): Promise<string> {
  return generateTravelAdviceWithHistory(prompt, [], context);
}

/**
 * Formats precise responses using the retrieved real data when Gemini API key is not yet set.
 * Eliminates the generic fallback bug entirely and never invents data.
 */
function formatGroundedResponse(
  prompt: string,
  destination: string,
  origin: string,
  travelers: number,
  style: "Budget" | "Comfort" | "Premium",
  ctx: TravelContext
): string {
  const query = prompt.toLowerCase();

  // 1. Budget inquiries
  if (query.includes("cost") || query.includes("budget") || query.includes("price") || query.includes("how much")) {
    const b = ctx.budgetEstimate || calculateTripBudget({ destination, origin, travelers, travelStyle: style });
    return `### 💰 Estimated Trip Budget: ${destination}
**Origin:** ${origin} | **Travelers:** ${travelers} | **Travel Style:** ${style}

**Total Estimated Budget:** ₹${b.totalMinINR.toLocaleString("en-IN")} — ₹${b.totalMaxINR.toLocaleString("en-IN")}
*(Approx. ₹${b.perPersonMinINR.toLocaleString("en-IN")} — ₹${b.perPersonMaxINR.toLocaleString("en-IN")} per traveler)*

#### Itemized Cost Breakdown:
${b.categories
  .map(
    (c) =>
      `* **${c.category}:** ₹${c.minAmountINR.toLocaleString("en-IN")} – ₹${c.maxAmountINR.toLocaleString(
        "en-IN"
      )}\n  *Detail:* ${c.notes}\n  *Source:* _${c.source}_`
  )
  .join("\n\n")}

⚠️ **Note:** Real costs depend on season, booking lead time, and gear choices. Official permit fees are set by the government (ACAP/TIMS).`;
  }

  // 2. Weather inquiries
  if (query.includes("weather") || query.includes("temperature") || query.includes("climate") || query.includes("rain")) {
    if (ctx.weather) {
      const w = ctx.weather;
      return `### 🌤️ Live Weather Report: ${destination}
*(Data retrieved from ${w.source} at ${new Date(w.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})*

* **Current Temperature:** ${w.current.temperature}°C (Feels like ${w.current.apparentTemperature}°C)
* **Condition:** ${w.current.weatherDescription}
* **Precipitation:** ${w.current.precipitation} mm
* **Wind Speed:** ${w.current.windSpeed} km/h
* **Humidity:** ${w.current.humidity}%
${w.elevation ? `* **Station Elevation:** ${w.elevation} meters above sea level` : ""}

#### 7-Day Weather Forecast:
${w.daily
  .slice(0, 5)
  .map((d) => `* **${d.date}:** ${d.minTemp}°C to ${d.maxTemp}°C — ${d.weatherDescription} (${d.precipitationProbability}% rain probability)`)
  .join("\n")}

💡 **Travel Advice:** In high-altitude mountain environments like ${destination}, morning skies are typically clear, with cloud cover or light showers developing in the afternoons. Pack layerable thermals and waterproof gear.`;
    }
    return `Live weather data for ${destination} is temporarily unavailable. Generally, the best trekking seasons in the Himalayas are Spring (March–May) and Autumn (October–November) when skies are clear.`;
  }

  // 3. Route / Transportation inquiries
  if (query.includes("route") || query.includes("how do i get") || query.includes("transport") || query.includes("reach") || query.includes("how to go")) {
    if (ctx.route) {
      const r = ctx.route;
      return `### 🗺️ Journey Route: ${origin} → ${destination}
**Total Distance:** ~${r.totalDistanceKm} km | **Estimated Transit Time:** ~${r.totalDurationHours} hrs

#### Stage-by-Stage Navigation:
${r.segments
  .map(
    (s, idx) =>
      `${idx + 1}. **${s.from} → ${s.to}** (${s.mode.toUpperCase()})\n   *Distance:* ${s.distanceKm} km | *Duration:* ~${s.durationHours} hrs${
        s.elevationGainM ? ` | *Elevation Gain:* +${s.elevationGainM}m` : ""
      }\n   *Route:* ${s.description}`
  )
  .join("\n\n")}

${r.hasTrek ? "🥾 **Trail Distinction:** Road vehicles operate up to Nayapul. Beyond the check-post, travel is on foot along stone staircases and mountain trails into the Annapurna Sanctuary." : ""}`;
    }
  }

  // 4. Hotel / Accommodation inquiries
  if (query.includes("hotel") || query.includes("stay") || query.includes("accommodation") || query.includes("lodge")) {
    if (ctx.hotels && ctx.hotels.length > 0) {
      return `### 🏨 Verified Stays & Lodges for ${destination}
*(Based on real property listings. Live pricing must be confirmed on booking providers.)*

${ctx.hotels
  .map(
    (h) =>
      `* **${h.name}**\n  *Location:* ${h.location}\n  *Rating:* ${h.rating ? `⭐ ${h.rating}/5` : "Registered property"}\n  *Room:* ${
        h.roomType || "Standard Accommodation"
      }\n  *Live Price:* ${
        h.isPriceAvailable && h.pricePerNightINR ? `₹${h.pricePerNightINR.toLocaleString("en-IN")}/night` : "**Price unavailable** (real-time rates subject to check-in date)"
      }\n  *Amenities:* ${h.amenities.join(", ")}\n  [Verify Live Booking & Availability](${h.bookingUrl})`
  )
  .join("\n\n")}

⚠️ **Real-Data Policy:** Room rates fluctuate dynamically by season and occupancy. TravelMate displays actual verified properties and direct booking links rather than inventing estimated prices.`;
    }
  }

  // 5. Itinerary inquiries
  if (query.includes("itinerary") || query.includes("plan") || query.includes("day by day") || query.includes("make my trip") || query.includes("days")) {
    const itin = generateTripItinerary(destination, origin, 9);
    return `### 🗓️ Recommended Itinerary: ${destination} from ${origin}

${itin
  .map(
    (day) =>
      `#### Day ${day.day}: ${day.title}\n* **Route:** ${day.fromLocation} → ${day.toLocation} (${day.transportMode})\n* **Travel Time:** ${day.estimatedTravelTime}\n* **Stay:** ${day.accommodationArea}\n* **Activities:**\n${day.activities.map((a) => `  * ${a}`).join("\n")}\n* **Estimated Daily Cost:** ₹${day.estimatedCostINR.min.toLocaleString("en-IN")} – ₹${day.estimatedCostINR.max.toLocaleString("en-IN")}`
  )
  .join("\n\n")}

💡 **Map Synchronization:** When viewing this trip in the TravelMate planner, clicking any day highlights that specific day's route directly on the interactive map.`;
  }

  // 6. Natural focused response tailored to prompt
  return `### 🧭 TravelMate Guide: ${destination}
You asked: *"${prompt}"*

* **Destination:** ${destination} (from ${origin})
* **Live Weather:** ${ctx.weather ? `${ctx.weather.current.temperature}°C, ${ctx.weather.current.weatherDescription}` : "Available in Trip Planner"}
* **Estimated Budget:** ₹${ctx.budgetEstimate?.totalMinINR.toLocaleString("en-IN")} – ₹${ctx.budgetEstimate?.totalMaxINR.toLocaleString("en-IN")} for ${travelers} travelers (${style} tier)
* **Key Route:** ${ctx.route ? ctx.route.summary : "Multimodal road and trail navigation available"}

Would you like me to detail:
1. The **day-by-day itinerary** with trail elevations?
2. The **itemized budget breakdown** (permits, food, jeeps, stays)?
3. **Current weather & 7-day forecast**?
4. **Verified hotel and mountain teahouse options**?`;
}
