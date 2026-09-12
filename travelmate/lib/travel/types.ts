export interface DestinationSearchResult {
  id: string;
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode?: string;
  destinationType: string;
  placeId?: string;
  state?: string;
}

export interface WeatherCurrent {
  temperature: number; // °C
  apparentTemperature: number;
  precipitation: number; // mm
  windSpeed: number; // km/h
  weatherCode: number;
  weatherDescription: string;
  humidity: number;
  elevation?: number;
  timestamp: string;
}

export interface WeatherDailyForecast {
  date: string;
  minTemp: number;
  maxTemp: number;
  precipitationProbability: number;
  weatherCode: number;
  weatherDescription: string;
}

export interface DestinationWeatherData {
  destination: string;
  latitude: number;
  longitude: number;
  current: WeatherCurrent;
  daily: WeatherDailyForecast[];
  elevation?: number;
  updatedAt: string;
  source: string;
}

export interface ExchangeRateResult {
  from: string;
  to: string;
  rate: number;
  updatedAt: string;
  source: string;
}

export interface RouteWaypoint {
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  type: "start" | "transit" | "trailhead" | "trek_camp" | "destination" | "attraction";
  description?: string;
  day?: number;
}

export interface RouteSegment {
  from: string;
  to: string;
  mode: "driving" | "walking" | "trekking" | "flight";
  distanceKm: number;
  durationHours: number;
  coordinates: [number, number][]; // [lat, lng]
  elevationGainM?: number;
  description: string;
  day?: number;
}

export interface ComputedRouteResult {
  origin: string;
  destination: string;
  totalDistanceKm: number;
  totalDurationHours: number;
  hasTrek: boolean;
  segments: RouteSegment[];
  waypoints: RouteWaypoint[];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  summary: string;
  updatedAt: string;
}

export interface RealPlaceItem {
  id: string;
  name: string;
  category: "attraction" | "restaurant" | "hotel" | "transit" | "viewpoint" | "permit_office";
  latitude: number;
  longitude: number;
  rating?: number;
  address?: string;
  tags?: string[];
  description?: string;
}

export interface HotelRecommendation {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  rating?: number;
  roomType?: string;
  pricePerNightINR?: number | null;
  originalPrice?: number | null;
  originalCurrency?: string;
  isPriceAvailable: boolean;
  availabilityTimestamp: string;
  provider: string;
  bookingUrl: string;
  amenities: string[];
}

export interface BudgetCategoryBreakdown {
  category: string;
  minAmountINR: number;
  maxAmountINR: number;
  notes: string;
  source: string;
}

export interface TripBudgetEstimate {
  destination: string;
  origin: string;
  durationDays: number;
  travelers: number;
  travelStyle: "Budget" | "Comfort" | "Premium";
  currency: string;
  totalMinINR: number;
  totalMaxINR: number;
  perPersonMinINR: number;
  perPersonMaxINR: number;
  categories: BudgetCategoryBreakdown[];
  calculatedAt: string;
  dataSources: string[];
}

export interface DayItinerary {
  day: number;
  title: string;
  fromLocation: string;
  toLocation: string;
  transportMode: string;
  estimatedTravelTime: string;
  distanceKm?: number;
  accommodationArea: string;
  activities: string[];
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  estimatedCostINR: {
    min: number;
    max: number;
  };
  mapPoints: {
    name: string;
    latitude: number;
    longitude: number;
    type: string;
  }[];
  notes?: string;
}

export type WeatherResult = DestinationWeatherData;
export type ItemizedBudgetResult = TripBudgetEstimate;
export type HotelResult = HotelRecommendation;
export type RealPlaceResult = RealPlaceItem;

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  time?: string;
}
