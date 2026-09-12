import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import Navbar from "@/components/Navbar";
import AiChatView from "./AiChatView";

export const dynamic = "force-dynamic";

interface AiPageProps {
  searchParams: Promise<{
    q?: string;
    destination?: string;
  }>;
}

export default async function AiPage({ searchParams }: AiPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const initialQuery = params.q || "";
  const initialDestination = params.destination || "";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar userName={session.name} userEmail={session.email} activePath="/ai" />
      <AiChatView
        userName={session.name}
        initialQuery={initialQuery}
        initialDestination={initialDestination}
      />
    </div>
  );
}
