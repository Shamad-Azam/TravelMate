import { DayItinerary } from "./types";

/**
 * Authentic, day-by-day itinerary generator for trips.
 * Provides synchronized map coordinates, route info, activities, accommodation areas,
 * and cost estimates per day.
 */
export function generateTripItinerary(
  destination: string,
  origin: string = "Delhi",
  durationDays: number = 9
): DayItinerary[] {
  const isAnnapurna =
    destination.toLowerCase().includes("annapurna") ||
    destination.toLowerCase().includes("abc") ||
    destination.toLowerCase().includes("pokhara");

  if (isAnnapurna) {
    return [
      {
        day: 1,
        title: "Journey to Kathmandu & Permit Registration",
        fromLocation: origin,
        toLocation: "Kathmandu (1,400m)",
        transportMode: "Flight / Cross-Border Transit",
        estimatedTravelTime: "1h 30m flight (or overland coach)",
        distanceKm: 815,
        accommodationArea: "Thamel, Kathmandu",
        activities: [
          "Arrive at Tribhuvan International Airport (KTM)",
          "Obtain official ACAP & TIMS trekking permits at Nepal Tourism Board Office",
          "Last-minute gear check and rental in Thamel gear shops",
          "Evening traditional Nepali dinner with cultural music",
        ],
        meals: {
          breakfast: "En-route / Departure airport",
          lunch: "Traditional Newari Thakali Thali in Thamel",
          dinner: "Dal Bhat or wood-fired pizza in Kathmandu",
        },
        estimatedCostINR: { min: 8500, max: 12500 },
        mapPoints: [
          { name: origin, latitude: 28.6139, longitude: 77.2090, type: "start" },
          { name: "Kathmandu (Thamel)", latitude: 27.7172, longitude: 85.3240, type: "transit" },
        ],
        notes: "Keep 4 passport-size photos and passport copies ready for permit counters.",
      },
      {
        day: 2,
        title: "Scenic Drive / Flight to Pokhara Lakeside",
        fromLocation: "Kathmandu",
        toLocation: "Pokhara Lakeside (822m)",
        transportMode: "Tourist AC Coach or 25-min domestic flight",
        estimatedTravelTime: "6h 30m by highway bus (or 25m flight)",
        distanceKm: 205,
        accommodationArea: "Lakeside, Pokhara",
        activities: [
          "Drive along the winding Trishuli and Marsyangdi river valleys",
          "Check in to lakeside hotel in Pokhara with Annapurna mountain backdrop",
          "Afternoon boat ride across Phewa Lake to Tal Barahi temple",
          "Sunset stroll along the Lakeside promenade with views of Fishtail (Machapuchare)",
        ],
        meals: {
          breakfast: "Hotel breakfast in Kathmandu",
          lunch: "Highway riverside restaurant stop (Trishuli)",
          dinner: "Moondance Restaurant or Busy Bee Cafe, Lakeside",
        },
        estimatedCostINR: { min: 3200, max: 5500 },
        mapPoints: [
          { name: "Kathmandu", latitude: 27.7172, longitude: 85.3240, type: "transit" },
          { name: "Pokhara (Phewa Lake)", latitude: 28.2096, longitude: 83.9856, type: "transit" },
        ],
        notes: "Highway schedules may vary depending on road widening conditions. Morning departures recommended.",
      },
      {
        day: 3,
        title: "Trailhead Drive to Nayapul & Trek to Ulleri",
        fromLocation: "Pokhara",
        toLocation: "Ulleri (1,960m) via Nayapul & Tikhedhunga",
        transportMode: "Jeep/Taxi to Nayapul (1.5h) then Mountain Trek",
        estimatedTravelTime: "1.5h drive + 4h 30m foot trek",
        distanceKm: 53,
        accommodationArea: "Ulleri Teahouse Village",
        activities: [
          "Drive from Pokhara to Nayapul trailhead check-post",
          "Pass through Birethanti village and present ACAP permits",
          "Climb the famous 3,200 stone steps through Ulleri oak forest",
          "First clear views of Annapurna South (7,219m) and Hiunchuli",
        ],
        meals: {
          breakfast: "Lakeside bakery in Pokhara",
          lunch: "Noodle soup & Tibetan bread at Tikhedhunga",
          dinner: "Steaming hot organic Dal Bhat at Ulleri lodge",
        },
        estimatedCostINR: { min: 2200, max: 3600 },
        mapPoints: [
          { name: "Pokhara", latitude: 28.2096, longitude: 83.9856, type: "transit" },
          { name: "Nayapul Trailhead", latitude: 28.3075, longitude: 83.7744, type: "trailhead" },
          { name: "Ulleri Village", latitude: 28.3542, longitude: 83.7420, type: "trek_camp" },
        ],
        notes: "Trekking poles are highly recommended for the stone steps ascending into Ulleri.",
      },
      {
        day: 4,
        title: "Ascent through Rhododendron Forests to Ghorepani",
        fromLocation: "Ulleri",
        toLocation: "Ghorepani (2,874m)",
        transportMode: "Mountain Foot Trek",
        estimatedTravelTime: "5h trek",
        distanceKm: 12,
        accommodationArea: "Upper Ghorepani",
        activities: [
          "Trek through ancient rhododendron and mossy alpine forests",
          "Cross crystalline mountain streams and wooden suspension footbridges",
          "Arrive at Ghorepani mountain pass overlooking the Kaligandaki gorge",
          "Afternoon rest and hot lemon honey tea by the lodge stove",
        ],
        meals: {
          breakfast: "Porridge or pancakes at Ulleri lodge",
          lunch: "Fried potatoes and vegetable momos at Banthanti",
          dinner: "Hot garlic soup and Gurung bread at Ghorepani",
        },
        estimatedCostINR: { min: 1400, max: 2200 },
        mapPoints: [
          { name: "Ulleri", latitude: 28.3542, longitude: 83.7420, type: "trek_camp" },
          { name: "Ghorepani Pass", latitude: 28.4005, longitude: 83.7012, type: "trek_camp" },
        ],
        notes: "Garlic soup aids natural high-altitude acclimatization.",
      },
      {
        day: 5,
        title: "Poon Hill Sunrise & Traverse to Chhomrong",
        fromLocation: "Ghorepani",
        toLocation: "Chhomrong Village (2,170m)",
        transportMode: "Mountain Foot Trek",
        estimatedTravelTime: "6h 30m trek",
        distanceKm: 15,
        accommodationArea: "Chhomrong Village",
        activities: [
          "Early 4:30 AM sunrise hike to Poon Hill (3,210m) for 360° golden Himalayan glow",
          "Witness Dhaulagiri (8,167m), Annapurna I (8,091m), and Nilgiri",
          "Descend to Tadapani and traverse the Kimrong Khola canyon",
          "Ascend to Chhomrong, the premier amphitheater village under Annapurna South",
        ],
        meals: {
          breakfast: "Breakfast at lodge after Poon Hill sunrise",
          lunch: "Vegetable thukpa at Tadapani",
          dinner: "Famous Chhomrong apple pie and local hot meal",
        },
        estimatedCostINR: { min: 1600, max: 2400 },
        mapPoints: [
          { name: "Ghorepani", latitude: 28.4005, longitude: 83.7012, type: "trek_camp" },
          { name: "Chhomrong", latitude: 28.4208, longitude: 83.8211, type: "trek_camp" },
        ],
        notes: "Chhomrong is the final permanent village before entering the inner sanctuary.",
      },
      {
        day: 6,
        title: "Deep Valley Gorge Trek to Bamboo & Dovan",
        fromLocation: "Chhomrong",
        toLocation: "Bamboo / Dovan (2,505m)",
        transportMode: "Mountain Foot Trek",
        estimatedTravelTime: "5h trek",
        distanceKm: 10,
        accommodationArea: "Bamboo / Dovan Lodges",
        activities: [
          "Descend 2,500 stone steps to Chhomrong Khola suspension bridge",
          "Climb through Sinuwa with towering views back toward Chhomrong",
          "Enter dense bamboo and damp fern forest where waterfalls plunge from cliffs",
          "Rest overnight alongside the rushing glacial waters of Modi Khola",
        ],
        meals: {
          breakfast: "Eggs and muesli at Chhomrong",
          lunch: "Tibetan noodle soup at Upper Sinuwa",
          dinner: "Lentil Dal Bhat with spinach at Bamboo",
        },
        estimatedCostINR: { min: 1400, max: 2100 },
        mapPoints: [
          { name: "Chhomrong", latitude: 28.4208, longitude: 83.8211, type: "trek_camp" },
          { name: "Bamboo / Dovan", latitude: 28.4680, longitude: 83.8560, type: "trek_camp" },
        ],
        notes: "Keep your fleece and water purification tablets accessible.",
      },
      {
        day: 7,
        title: "Climb through Alpine Valley to Deurali",
        fromLocation: "Bamboo / Dovan",
        toLocation: "Deurali (3,200m)",
        transportMode: "Alpine Foot Trek",
        estimatedTravelTime: "4h 30m trek",
        distanceKm: 9,
        accommodationArea: "Deurali Alpine Lodge",
        activities: [
          "Trek past the sacred weeping Hinku Cave cliff overhang",
          "Notice vegetation transitioning from lush forest to stunted alpine juniper",
          "Enter the steep rock gateway gorge between Hiunchuli and Machapuchare",
          "Arrive at Deurali for acclimatization rest and hydration",
        ],
        meals: {
          breakfast: "Porridge and hot tea at Dovan",
          lunch: "Potato rosti or vegetable chowmein at Himalaya Hotel",
          dinner: "Hearty hot soup and Dal Bhat at Deurali",
        },
        estimatedCostINR: { min: 1600, max: 2400 },
        mapPoints: [
          { name: "Bamboo / Dovan", latitude: 28.4680, longitude: 83.8560, type: "trek_camp" },
          { name: "Deurali Gorge", latitude: 28.5085, longitude: 83.8692, type: "trek_camp" },
        ],
        notes: "Drink 3 to 4 liters of clean fluids daily to maintain high altitude acclimatization.",
      },
      {
        day: 8,
        title: "Sanctuary Gateway: MBC to Annapurna Base Camp (ABC)",
        fromLocation: "Deurali",
        toLocation: "Annapurna Base Camp (4,130m) via MBC",
        transportMode: "High Altitude Glacier Trek",
        estimatedTravelTime: "4h 30m trek",
        distanceKm: 8,
        accommodationArea: "Annapurna Base Camp Summit Sanctuary",
        activities: [
          "Follow the lateral moraine into Machapuchare Base Camp (3,700m)",
          "Marvel at the sacred Fishtail pinnacle up close",
          "Gentle 2-hour ascent through the open glacial valley directly into ABC",
          "Surrounded by a monumental amphitheater of 10 Himalayan peaks over 7,000 meters",
          "Sunset watching the summit ice of Annapurna I glow amber and purple",
        ],
        meals: {
          breakfast: "Tibetan bread and honey at Deurali",
          lunch: "Hot garlic broth & vegetable noodles at MBC",
          dinner: "Steaming Dal Bhat celebration meal at ABC sanctuary lodge",
        },
        estimatedCostINR: { min: 1800, max: 2600 },
        mapPoints: [
          { name: "Deurali", latitude: 28.5085, longitude: 83.8692, type: "trek_camp" },
          { name: "Machapuchare Base Camp (MBC)", latitude: 28.5300, longitude: 83.8710, type: "trek_camp" },
          { name: "Annapurna Base Camp (ABC)", latitude: 28.5306, longitude: 83.8780, type: "destination" },
        ],
        notes: "Night temperatures at 4,130m can drop below freezing (-5°C to -10°C). Warm down jacket and thermal inner layers essential.",
      },
      {
        day: 9,
        title: "Sunrise over Annapurna Glacier & Return Descent",
        fromLocation: "Annapurna Base Camp (ABC)",
        toLocation: "Bamboo / Pokhara return",
        transportMode: "Descent Trek & Trailhead Transfer",
        estimatedTravelTime: "6h descent",
        distanceKm: 18,
        accommodationArea: "Pokhara Lakeside Hotel",
        activities: [
          "Watch the morning sun illuminate the massive south face of Annapurna I (8,091m)",
          "Capture unforgettable photographs of the glacial amphitheater",
          "Swift downhill descent with oxygen enrichment as you lose elevation",
          "Return to Pokhara for celebratory dinner, hot shower, and restful lakeside recovery",
        ],
        meals: {
          breakfast: "Early tea and porridge watching ABC sunrise",
          lunch: "Lunch stop at Dovan / Sinuwa during descent",
          dinner: "Lakeside celebratory dinner in Pokhara",
        },
        estimatedCostINR: { min: 2500, max: 4200 },
        mapPoints: [
          { name: "Annapurna Base Camp (ABC)", latitude: 28.5306, longitude: 83.8780, type: "destination" },
          { name: "Pokhara Lakeside", latitude: 28.2096, longitude: 83.9856, type: "transit" },
        ],
        notes: "Knee braces or trekking poles help ease knee impact during the extended downhill return.",
      },
    ];
  }

  // Generic 5-day template for other destinations (e.g. Manali, Kashmir, Dubai, etc.)
  return [
    {
      day: 1,
      title: `Arrival & Settling in ${destination}`,
      fromLocation: origin,
      toLocation: destination,
      transportMode: "Flight / Train / Road Transfer",
      estimatedTravelTime: "Varies by departure terminal",
      accommodationArea: `${destination} Central District`,
      activities: [
        `Travel from ${origin} to ${destination}`,
        "Check in to accommodation and freshen up",
        "Leisurely exploration of the surrounding neighborhood and orientation walk",
        "Welcome dinner with authentic regional flavors",
      ],
      meals: {
        breakfast: "Departure city",
        lunch: "En-route meal",
        dinner: `Local specialty restaurant in ${destination}`,
      },
      estimatedCostINR: { min: 2500, max: 4500 },
      mapPoints: [
        { name: origin, latitude: 28.6139, longitude: 77.2090, type: "start" },
        { name: destination, latitude: 28.2, longitude: 84.0, type: "destination" },
      ],
    },
    {
      day: 2,
      title: "Iconic Landmarks & Historical Discovery",
      fromLocation: destination,
      toLocation: destination,
      transportMode: "Local Cab / Metro / Walking",
      estimatedTravelTime: "Full day sightseeing",
      accommodationArea: `${destination} Central District`,
      activities: [
        "Morning visit to the most famous landmark and heritage monument",
        "Guided walking tour through historic quarters and architectural gems",
        "Afternoon visit to renowned cultural museum or scenic viewpoint",
        "Sunset photography and evening bazaar exploration",
      ],
      meals: {
        breakfast: "Hotel breakfast",
        lunch: "Recommended local cafe",
        dinner: "Traditional rooftop dinner",
      },
      estimatedCostINR: { min: 2000, max: 3800 },
      mapPoints: [
        { name: `${destination} Center`, latitude: 28.2, longitude: 84.0, type: "attraction" },
      ],
    },
    {
      day: 3,
      title: "Scenic Excursion & Nature Adventure",
      fromLocation: destination,
      toLocation: `${destination} Outskirts & Viewpoints`,
      transportMode: "Private Day Hire / Tour",
      estimatedTravelTime: "45m to 1h 30m transfer",
      accommodationArea: `${destination} Central District`,
      activities: [
        "Day trip to nearby natural park, waterfall, or mountain viewpoint",
        "Outdoor adventure activity (trek, boat ride, or wildlife spotting)",
        "Picnic or countryside lunch with sweeping vistas",
        "Return for an evening relaxation and cafe stroll",
      ],
      meals: {
        breakfast: "Hotel breakfast",
        lunch: "Scenic outdoor dining",
        dinner: "Lively downtown culinary spot",
      },
      estimatedCostINR: { min: 2800, max: 4800 },
      mapPoints: [
        { name: `${destination} Scenic Point`, latitude: 28.22, longitude: 84.05, type: "viewpoint" },
      ],
    },
    {
      day: 4,
      title: "Local Culture, Culinary Gems & Leisure",
      fromLocation: destination,
      toLocation: destination,
      transportMode: "Walking & Local Transit",
      estimatedTravelTime: "Flexible pacing",
      accommodationArea: `${destination} Central District`,
      activities: [
        "Artisan craft workshops and authentic handicraft markets",
        "Sampling signature street foods and local culinary delicacies",
        "Unscheduled afternoon for leisurely photography or cafe hopping",
        "Farewell dinner overlooking the illuminated city skyline or waterfront",
      ],
      meals: {
        breakfast: "Neighborhood bakery",
        lunch: "Street food / local bistro",
        dinner: "Fine dining farewell meal",
      },
      estimatedCostINR: { min: 2200, max: 4200 },
      mapPoints: [
        { name: `${destination} Culture Hub`, latitude: 28.21, longitude: 83.99, type: "attraction" },
      ],
    },
    {
      day: 5,
      title: `Memories & Departure back to ${origin}`,
      fromLocation: destination,
      toLocation: origin,
      transportMode: "Flight / Train Transfer",
      estimatedTravelTime: "Return transit",
      accommodationArea: "Home",
      activities: [
        "Morning souvenir shopping and packing",
        "Last scenic coffee with a view",
        `Transfer to departure terminal for return journey to ${origin}`,
      ],
      meals: {
        breakfast: "Hotel breakfast",
        lunch: "Terminal / En-route",
        dinner: "Home arrival",
      },
      estimatedCostINR: { min: 1500, max: 3000 },
      mapPoints: [
        { name: destination, latitude: 28.2, longitude: 84.0, type: "destination" },
        { name: origin, latitude: 28.6139, longitude: 77.2090, type: "start" },
      ],
    },
  ];
}
