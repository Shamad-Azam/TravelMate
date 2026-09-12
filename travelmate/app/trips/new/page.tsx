import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import Navbar from "@/components/Navbar";
import TripCreationForm from "./TripCreationForm";

export const dynamic = "force-dynamic";

interface NewTripPageProps {
  searchParams: Promise<{
    destination?: string;
    startDate?: string;
    travelers?: string;
    budget?: string;
    startLocation?: string;
  }>;
}

export default async function NewTripPage({ searchParams }: NewTripPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const initialTravelers = params.travelers ? parseInt(params.travelers, 10) : undefined;
  const initialBudget = params.budget ? parseFloat(params.budget) : undefined;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar userName={session.name} userEmail={session.email} activePath="/trips/new" />
      <TripCreationForm
        userName={session.name}
        initialDestination={params.destination}
        initialStartDate={params.startDate}
        initialTravelers={initialTravelers && !isNaN(initialTravelers) ? initialTravelers : undefined}
        initialBudget={initialBudget && !isNaN(initialBudget) ? initialBudget : undefined}
        initialStartLocation={params.startLocation}
      />
    </div>
  );
}


