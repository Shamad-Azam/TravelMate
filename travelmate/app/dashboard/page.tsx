import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { logoutAction } from "@/lib/auth/actions";

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
              TM
            </div>
            <span className="font-bold text-lg text-slate-900">TravelMate</span>
          </Link>

          <div className="flex items-center gap-4">
            {session ? (
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  Secure Logout
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Protected Account Center
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Server-side authorization and session guard architecture
          </p>
        </div>

        {session ? (
          // Active Session Card
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Session Verified</h2>
                <p className="text-xs text-slate-500">
                  Authenticated via secure HttpOnly session cookie
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                Active Session
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block mb-1">User ID</span>
                <span className="font-mono font-medium text-slate-800 break-all">{session.userId}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block mb-1">Email</span>
                <span className="font-medium text-slate-800">{session.email}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block mb-1">Verification Status</span>
                <span className="font-medium text-slate-800">
                  {session.isEmailVerified ? "Verified" : "Pending Verification"}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors cursor-pointer"
                >
                  Terminate Session & Logout
                </button>
              </form>
            </div>
          </div>
        ) : (
          // Unauthenticated State (Security Architecture Demonstration)
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Protected Route Demonstration</h2>
                <p className="text-xs text-slate-500">
                  No active HttpOnly session cookie was detected on the incoming server request.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 text-xs space-y-3">
              <h3 className="font-semibold text-slate-800">How Protected Routes Work in TravelMate:</h3>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-600 leading-relaxed">
                <li>
                  <strong className="text-slate-700">Server-Side Authorization:</strong> The server inspects incoming HttpOnly request cookies before rendering private data.
                </li>
                <li>
                  <strong className="text-slate-700">Zero Client Exposure:</strong> Tokens are never accessible to client-side scripts, completely eliminating localStorage token theft via XSS.
                </li>
                <li>
                  <strong className="text-slate-700">Session Invalidation:</strong> Logging out explicitly destroys the cookie with `maxAge: 0` and invalidates the session signature.
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm text-center shadow transition-colors"
              >
                Go to Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm text-center transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
