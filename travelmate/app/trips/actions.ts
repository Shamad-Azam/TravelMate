"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export type SaveTripResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  tripId?: string;
};

export async function saveTripAction(
  _prevState: SaveTripResult | null,
  formData: FormData
): Promise<SaveTripResult> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const destination = String(formData.get("destination") || "").trim();
  const country = String(formData.get("country") || "India").trim();
  const startDate = String(formData.get("startDate") || "").trim();
  const endDate = String(formData.get("endDate") || "").trim();
  const travelers = Number(formData.get("travelers") || 1);
  const budget = Number(formData.get("budget") || 0);
  const travelTypes = String(formData.get("travelTypes") || "Adventure").trim();
  const accommodation = String(formData.get("accommodation") || "Hotel").trim();
  const requirements = String(formData.get("requirements") || "").trim();

  const fieldErrors: Record<string, string> = {};

  if (!destination) {
    fieldErrors.destination = "Destination is required.";
  }

  if (!startDate) {
    fieldErrors.startDate = "Start date is required.";
  }

  if (!endDate) {
    fieldErrors.endDate = "End date is required.";
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    fieldErrors.endDate = "End date cannot be before start date.";
  }

  if (!Number.isInteger(travelers) || travelers < 1) {
    fieldErrors.travelers = "Travelers must be at least 1.";
  }

  if (!Number.isFinite(budget) || budget <= 0) {
    fieldErrors.budget = "Please enter a valid budget amount.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: "Please correct the errors below.",
      fieldErrors,
    };
  }

  try {
    const trip = await prisma.trip.create({
      data: {
        userId: session.userId,
        destination,
        country,
        startDate: new Date(`${startDate}T00:00:00`),
        endDate: new Date(`${endDate}T00:00:00`),
        travelers,
        budget,
        travelTypes,
        accommodation: accommodation || null,
        requirements: requirements || null,
      },
    });

    console.log(`[Trips] Trip created: ${trip.id} for user ${session.userId}`);
  } catch (error) {
    console.error("[Trips] Failed to save trip:", error);
    return {
      success: false,
      error: "Unable to save your trip right now. Please try again.",
    };
  }

  redirect("/dashboard");
}
