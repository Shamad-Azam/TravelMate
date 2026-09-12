import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import SignupForm from "./SignupForm";

export const dynamic = "force-dynamic";

interface SignUpPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  return <SignupForm oauthError={params.error} />;
}

