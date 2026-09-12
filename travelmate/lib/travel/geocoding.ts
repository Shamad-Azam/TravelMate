import { DestinationSearchResult } from "./types";

// Curated verified geocoded anchors for major iconic destinations
const CURATED_DESTINATIONS: Record<string, DestinationSearchResult> = {
  "annapurna base camp": {
    id: "abc-nepal-4130m",
    name: "Annapurna Base Camp",
    displayName: "Annapurna Base Camp, Gandaki Province, Nepal",
    latitude: 28.5306,
    longitude: 83.8780,
    country: "Nepal",
    countryCode: "NP",
    destinationType: "Trekking / Himalayan Sanctuary",
    placeId: "osm-node-abc-4130",
    state: "Gandaki Province",
  },
  "everest base camp": {
    id: "ebc-nepal-5364m",
    name: "Everest Base Camp",
    displayName: "Everest Base Camp, Khumbu, Nepal",
    latitude: 28.0040,
    longitude: 86.8564,
    country: "Nepal",
    countryCode: "NP",
    destinationType: "Trekking / High-Altitude Base Camp",
    placeId: "osm-node-ebc-5364",
    state: "Koshi Province",
  },
  "pokhara": {
    id: "pokhara-nepal",
    name: "Pokhara",
    displayName: "Pokhara, Gandaki Province, Nepal",
    latitude: 28.2096,
    longitude: 83.9856,
    country: "Nepal",
    countryCode: "NP",
    destinationType: "City / Lakes & Mountain Gateway",
    placeId: "osm-relation-pokhara",
    state: "Gandaki Province",
  },
  "kathmandu": {
    id: "kathmandu-nepal",
    name: "Kathmandu",
    displayName: "Kathmandu, Bagmati Province, Nepal",
    latitude: 27.7172,
    longitude: 85.3240,
    country: "Nepal",
    countryCode: "NP",
    destinationType: "Capital City / Cultural Heritage",
    placeId: "osm-relation-kathmandu",
    state: "Bagmati Province",
  },
  "delhi": {
    id: "delhi-india",
    name: "Delhi",
    displayName: "Delhi, India",
    latitude: 28.6139,
    longitude: 77.2090,
    country: "India",
    countryCode: "IN",
    destinationType: "Capital City / Major Transit Hub",
    placeId: "osm-relation-delhi",
    state: "Delhi",
  },
  "manali": {
    id: "manali-india",
    name: "Manali",
    displayName: "Manali, Himachal Pradesh, India",
    latitude: 32.2432,
    longitude: 77.1892,
    country: "India",
    countryCode: "IN",
    destinationType: "Hill Station / Adventure Hub",
    placeId: "osm-relation-manali",
    state: "Himachal Pradesh",
  },
  "leh-ladakh": {
    id: "leh-india",
    name: "Leh-Ladakh",
    displayName: "Leh, Ladakh, India",
    latitude: 34.1526,
    longitude: 77.5771,
    country: "India",
    countryCode: "IN",
    destinationType: "High-Altitude Desert & Monasteries",
    placeId: "osm-relation-leh",
    state: "Ladakh",
  },
  "kashmir": {
    id: "kashmir-srinagar-india",
    name: "Kashmir",
    displayName: "Srinagar, Kashmir, India",
    latitude: 34.0837,
    longitude: 74.7973,
    country: "India",
    countryCode: "IN",
    destinationType: "Valley / Lakes & Alpine Landscapes",
    placeId: "osm-relation-srinagar",
    state: "Jammu and Kashmir",
  },
  "goa": {
    id: "goa-india",
    name: "Goa",
    displayName: "Goa, India",
    latitude: 15.2993,
    longitude: 74.1240,
    country: "India",
    countryCode: "IN",
    destinationType: "Coastal / Beaches & Heritage",
    placeId: "osm-relation-goa",
    state: "Goa",
  },
  "dubai": {
    id: "dubai-uae",
    name: "Dubai",
    displayName: "Dubai, United Arab Emirates",
    latitude: 25.2048,
    longitude: 55.2708,
    country: "United Arab Emirates",
    countryCode: "AE",
    destinationType: "Modern Metropolis / Luxury & Desert",
    placeId: "osm-relation-dubai",
  },
  "bali": {
    id: "bali-indonesia",
    name: "Bali",
    displayName: "Bali, Indonesia",
    latitude: -8.4095,
    longitude: 115.1889,
    country: "Indonesia",
    countryCode: "ID",
    destinationType: "Island / Tropical Beaches & Culture",
    placeId: "osm-relation-bali",
  },
  "paris": {
    id: "paris-france",
    name: "Paris",
    displayName: "Paris, France",
    latitude: 48.8566,
    longitude: 2.3522,
    country: "France",
    countryCode: "FR",
    destinationType: "Capital City / Architecture & Art",
    placeId: "osm-relation-paris",
  }
};

/**
 * Real destination search using Photon (OpenStreetMap geocoding engine)
 * with graceful fallback to curated geospatial anchors.
 */
export async function searchDestinations(query: string): Promise<DestinationSearchResult[]> {
  const clean = query.trim().toLowerCase();
  if (!clean || clean.length < 2) return [];

  // Check curated matches first for high-quality instant metadata
  const results: DestinationSearchResult[] = [];
  for (const [key, dest] of Object.entries(CURATED_DESTINATIONS)) {
    if (key.includes(clean) || dest.name.toLowerCase().includes(clean) || dest.displayName.toLowerCase().includes(clean)) {
      results.push(dest);
    }
  }

  try {
    // Query live geocoding API
    const encoded = encodeURIComponent(query.trim());
    const res = await fetch(`https://photon.komoot.io/api/?q=${encoded}&limit=8`, {
      headers: { "User-Agent": "TravelMate-App/1.0" },
      next: { revalidate: 86400 }, // 24h cache
    });

    if (res.ok) {
      const data = await res.json();
      const features = data.features || [];

      for (const f of features) {
        const props = f.properties || {};
        const coords = f.geometry?.coordinates || []; // [lng, lat]
        if (coords.length < 2) continue;

        const lng = coords[0];
        const lat = coords[1];
        const name = props.name || props.city || props.country || query;
        const country = props.country || "International";
        const state = props.state || props.county || "";
        const type = props.osm_value || props.type || "place";

        // Filter out duplicates with curated results
        const isDuplicate = results.some(
          (r) => Math.abs(r.latitude - lat) < 0.05 && Math.abs(r.longitude - lng) < 0.05
        );

        if (!isDuplicate) {
          const displayName = [name, state, country].filter(Boolean).join(", ");
          results.push({
            id: `geo-${props.osm_id || Math.round(lat * 1000)}-${Math.round(lng * 1000)}`,
            name,
            displayName,
            latitude: lat,
            longitude: lng,
            country,
            countryCode: props.countrycode?.toUpperCase(),
            destinationType: type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " "),
            placeId: props.osm_id ? `osm-${props.osm_type || "node"}-${props.osm_id}` : undefined,
            state,
          });
        }
      }
    }
  } catch (error) {
    console.warn("[Geocoding] Photon lookup error:", error);
  }

  // Fallback: If still empty, return closest curated match
  if (results.length === 0) {
    for (const [key, dest] of Object.entries(CURATED_DESTINATIONS)) {
      if (key.startsWith(clean.slice(0, 3))) {
        results.push(dest);
        break;
      }
    }
  }

  return results.slice(0, 8);
}

/**
 * Resolves precise coordinates for a place name.
 */
export async function getPlaceCoordinates(placeName: string): Promise<DestinationSearchResult | null> {
  const list = await searchDestinations(placeName);
  return list.length > 0 ? list[0] : null;
}
