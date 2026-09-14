# TravelMate

TravelMate is a full-stack travel planning platform built with Next.js and TypeScript. It brings trip planning, destination discovery, route exploration, weather information, budgeting, accommodation discovery and an AI travel assistant into one application.

## Overview

TravelMate is designed to make travel planning easier from the first destination search to the final itinerary.

Users can create trips, explore destinations, check travel information, view routes on an interactive map, estimate expenses and use TravelMate AI for personalized travel guidance.

## Features

### Trip Planning

- Create and manage trips
- Select destinations and travel dates
- Choose traveller count and budget
- Select travel style
- Add custom travel requirements
- View detailed trip information

### TravelMate AI

The AI Travel Agent provides conversational travel assistance for:

- Day-by-day itineraries
- Budget planning
- Packing suggestions
- Destination recommendations
- Travel routes
- Weather questions
- Local travel guidance
- General trip planning

The assistant supports follow-up questions so users can continue a travel conversation instead of receiving only a single generic response.

### Destination & Travel Data

TravelMate integrates travel-related services for:

- Destination search and geocoding
- Weather information
- Currency conversion
- Places and attractions
- Route information
- Accommodation information

### Maps & Routes

Trip details include an interactive map for exploring the journey.

Routes can include different travel modes such as:

- Road travel
- Local transport
- Trekking routes

For trekking destinations, important route points and elevation information can also be displayed.

### Budget Planning

TravelMate provides an itemized estimated travel budget covering areas such as:

- Transportation
- Accommodation
- Food
- Activities
- Permits
- Local travel
- Additional buffer

Prices and availability can vary depending on the destination, dates and provider.

### Accommodation

Users can explore accommodation information related to their trip.

Where live pricing is not available, TravelMate avoids presenting an invented price and instead indicates that the price needs to be verified with the provider.

### Travel Buddy

The Find Buddy feature allows users to discover other travellers based on their travel plans and destinations without exposing private account information.

### Authentication

TravelMate supports:

- Email and password authentication
- Google authentication
- Email verification
- Password reset
- Session-based authentication
- Google account linking

## Application Flow

```text
Landing Page
     |
     v
 Login / Signup
     |
     v
 Dashboard
     |
     +----> Create Trip
     |          |
     |          v
     |     Trip Details
     |          |
     |          +----> Map & Routes
     |          +----> Weather
     |          +----> Budget
     |          +----> Accommodation
     |          +----> AI Assistant
     |
     +----> AI Travel Agent
     |
     +----> Find Travel Buddy
## Development

TravelMate is actively developed with a focus on improving travel planning and user experience.
