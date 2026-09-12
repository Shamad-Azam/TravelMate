import Link from "next/link";
import { verifyEmailToken } from "@/lib/auth/verification";

interface VerifyEmailPageProps {
  searchParams: Promise<{
    token?: string;
    email?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams;
  const token = params.token;
  const email = params.email || "your email";

  let status: "success" | "invalid" | "pending" = "pending";

  if (token) {
    const verifiedUserId = await verifyEmailToken(token);
    if (verifiedUserId) {
      status = "success";
    } else {
      status = "invalid";
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-xl p-1"
          aria-label="TravelMate Home"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 4a6 6 0 1 1-6 6 6 6 0 0 1 6-6zm0 2v4l3 3"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 bg-clip-text text-transparent">
            TravelMate
          </span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-5 sm:px-10 shadow-xl shadow-slate-200/60 rounded-2xl sm:rounded-3xl border border-slate-200 text-center">
          {status === "success" && (
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-600 mx-auto flex items-center justify-center">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Email Verified!
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                Your email has been successfully confirmed. You now have full access
                to TravelMate.
              </p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-block w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-sm shadow-md transition-all"
                >
                  Continue to Sign In
                </Link>
              </div>
            </div>
          )}

          {status === "invalid" && (
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Verification Failed
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                This verification link is invalid, has expired, or has already
                been used.
              </p>
              <div className="pt-4 space-y-3">
                <Link
                  href="/login"
                  className="inline-block w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md transition-all"
                >
                  Back to Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-block text-xs font-medium text-slate-500 hover:text-teal-600 transition-colors"
                >
                  Create a new account
                </Link>
              </div>
            </div>
          )}

          {status === "pending" && (
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center border border-teal-100">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Verify your email address
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                We’ve sent a verification link to{" "}
                <span className="font-semibold text-slate-800">{email}</span>.
                Please check your inbox and click the link to activate your
                account.
              </p>

              <div className="pt-4 space-y-3">
                <Link
                  href="/login"
                  className="inline-block w-full py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Return to Sign In
                </Link>
              </div>

              <div className="pt-4 border-t border-slate-100 text-left text-xs text-slate-500 space-y-1">
                <p className="font-medium text-slate-700">
                  Security considerations:
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>Verification links expire after 24 hours</li>
                  <li>Links are single-use and cryptographically verified</li>
                  <li>Check your spam folder if the email doesn&apos;t arrive within 2 minutes</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
