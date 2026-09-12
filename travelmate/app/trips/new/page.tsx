import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import TripCreationForm from "./TripCreationForm";

export const dynamic = "force-dynamic";

export default async function NewTripPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return <TripCreationForm userName={session.name} />;
}
