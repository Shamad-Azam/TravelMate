"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/auth/actions";
import GoogleSignInButton from "@/components/GoogleSignInButton";

interface LoginFormProps {
  oauthError?: string;
}

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  missing_credentials:
    "Google sign-in is not yet configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env.local file.",
  oauth_cancelled: "Google sign-in was cancelled.",
  invalid_state: "Security verification failed (state mismatch or expired). Please try again.",
  code_exchange_failed: "Failed to exchange authorization code with Google. Please try again.",
  user_info_failed: "Could not retrieve user information from Google. Please try again.",
  auth_failed: "Unable to complete Google sign-in. Please try again.",
  invalid_request: "Invalid authentication request from Google. Please try again.",
};

export default function LoginForm({ oauthError }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  const displayOAuthError = oauthError
    ? OAUTH_ERROR_MESSAGES[oauthError] || "Unable to complete Google sign-in. Please try again."
    : null;

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        {/* TravelMate Logo */}
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

        <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Sign in to connect with travelers and manage your trips
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-3 sm:px-0">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-10 shadow-xl shadow-slate-200/60 rounded-2xl sm:rounded-3xl border border-slate-200">
          {/* OAuth Error Alert */}
          {displayOAuthError && !state?.error && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-6 p-4 rounded-xl text-sm border bg-amber-50 border-amber-200 text-amber-900 flex items-start gap-3"
            >
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3.3 1.732 3z"
                />
              </svg>
              <div>
                <p className="font-semibold">Google Sign In</p>
                <p className="mt-0.5 text-xs sm:text-sm leading-relaxed">{displayOAuthError}</p>
              </div>
            </div>
          )}

          {/* Form Error / Status Alert */}
          {state?.error && (
            <div
              role="alert"
              aria-live="assertive"
              className={`mb-6 p-4 rounded-xl text-sm border flex items-start gap-3 ${
                state.code === "EMAIL_NOT_VERIFIED"
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <svg
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  state.code === "EMAIL_NOT_VERIFIED"
                    ? "text-amber-600"
                    : "text-red-500"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3.3 1.732 3z"
                />
              </svg>

              <div>
                <p className="font-semibold">
                  {state.code === "EMAIL_NOT_VERIFIED"
                    ? "Verification Required"
                    : "Sign In Error"}
                </p>

                <p className="mt-0.5 text-xs sm:text-sm leading-relaxed">
                  {state.error}
                </p>
              </div>
            </div>
          )}

          {/* 1. Continue with Google */}
          <GoogleSignInButton label="Continue with Google" from="login" />

          {/* OR Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-white px-3 text-slate-400 font-bold">or</span>
            </div>
          </div>

          {/* 2. Email & Password Form */}
          <form action={formAction} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className={`w-full px-4 py-3 bg-slate-50 focus:bg-white border rounded-xl text-slate-900 text-base sm:text-sm focus:outline-none focus:ring-2 transition-all ${
                  state?.fieldErrors?.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                }`}
              />

              {state?.fieldErrors?.email && (
                <p className="mt-1.5 text-xs text-red-600">
                  {state.fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className={`w-full pl-4 pr-11 py-3 bg-slate-50 focus:bg-white border rounded-xl text-slate-900 text-base sm:text-sm focus:outline-none focus:ring-2 transition-all ${
                    state?.fieldErrors?.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {state?.fieldErrors?.password && (
                <p className="mt-1.5 text-xs text-red-600">
                  {state.fieldErrors.password}
                </p>
              )}
            </div>

            {/* Remember */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded cursor-pointer"
              />

              <label
                htmlFor="remember-me"
                className="ml-2 block text-xs text-slate-600 cursor-pointer"
              >
                Remember this device for 7 days
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-sm shadow-md shadow-teal-600/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Footer: Create Account */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Don’t have an account yet?{" "}
              <Link
                href="/signup"
                className="font-semibold text-teal-600 hover:text-teal-700 hover:underline"
              >
                Create Account / Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Security indicators */}
        <div className="mt-8 text-center text-xs text-slate-500 space-y-1">
          <p>🔒 Protected by secure HttpOnly session tokens</p>
          <p>Argon2id cryptographic password security</p>
        </div>
      </div>
    </div>
  );
}
