"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/lib/auth/actions";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, null);

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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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

        <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your account email and we’ll send you instructions to reset your password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-5 sm:px-10 shadow-xl shadow-slate-200/60 rounded-2xl sm:rounded-3xl border border-slate-200">
          {/* Success / Anti-Enumeration Confirmation */}
          {state?.success && (
            <div
              role="alert"
              aria-live="polite"
              className="p-5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 mb-6 text-sm"
            >
              <div className="flex items-center gap-3 mb-2 font-semibold">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Check your inbox</span>
              </div>
              <p className="text-xs leading-relaxed text-teal-800">
                {state.message}
              </p>
              <p className="mt-3 text-[11px] text-teal-700">
                Tip: The reset link expires in 1 hour. If you don&apos;t see the email, check your spam or junk folder.
              </p>
            </div>
          )}

          {/* Error Alert */}
          {state?.error && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-6 p-4 rounded-xl text-sm bg-red-50 border border-red-200 text-red-800"
            >
              <p className="font-semibold">Reset Error</p>
              <p className="mt-0.5 text-xs">{state.error}</p>
            </div>
          )}

          {/* Form */}
          <form action={formAction} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Account Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-required="true"
                aria-describedby={state?.fieldErrors?.email ? "email-error" : undefined}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 bg-slate-50 focus:bg-white border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 transition-all ${
                  state?.fieldErrors?.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                }`}
              />
              {state?.fieldErrors?.email && (
                <p id="email-error" className="mt-1.5 text-xs text-red-600">
                  {state.fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-sm shadow-md shadow-teal-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Sending reset instructions...</span>
                  </>
                ) : (
                  <span>Send Reset Instructions</span>
                )}
              </button>
            </div>
          </form>

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded px-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to login</span>
            </Link>
          </div>
        </div>

        {/* Anti-enumeration Note */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>For your security, we never disclose whether an email address is registered.</p>
        </div>
      </div>
    </div>
  );
}
