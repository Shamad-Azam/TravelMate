import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import SignupForm from "./SignupForm";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return <SignupForm />;
}
