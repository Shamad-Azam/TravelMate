"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signupAction } from "@/lib/auth/actions";
import { evaluatePasswordStrength } from "@/lib/auth/validation";

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(signupAction, null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const strength = evaluatePasswordStrength(password);

  const getStrengthBarColor = () => {
    switch (strength.score) {
      case 1:
        return "bg-red-500 w-1/4";
      case 2:
        return "bg-amber-500 w-2/4";
      case 3:
        return "bg-teal-500 w-3/4";
      case 4:
        return "bg-emerald-500 w-full";
      default:
        return "bg-slate-200 w-0";
    }
  };

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

        <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Join the community
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Find travel buddies, plan adventures, and travel safely
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white py-8 px-5 sm:px-10 shadow-xl shadow-slate-200/60 rounded-2xl sm:rounded-3xl border border-slate-200">
          {/* Status Alert */}
          {state?.error && (
            <div
              role="alert"
              aria-live="assertive"
              className={`mb-6 p-4 rounded-xl text-sm border flex items-start gap-3 ${
                state.code === "DB_NOT_CONFIGURED"
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <svg
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  state.code === "DB_NOT_CONFIGURED" ? "text-amber-600" : "text-red-500"
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="font-semibold">
                  {state.code === "DB_NOT_CONFIGURED" ? "Environment Notice" : "Sign Up Error"}
                </p>
                <p className="mt-0.5 text-xs sm:text-sm leading-relaxed">{state.error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form action={formAction} className="space-y-5" noValidate>
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                aria-required="true"
                aria-describedby={state?.fieldErrors?.name ? "name-error" : undefined}
                placeholder="e.g. Alex Rivera"
                className={`w-full px-4 py-3 bg-slate-50 focus:bg-white border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 transition-all ${
                  state?.fieldErrors?.name
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                }`}
              />
              {state?.fieldErrors?.name && (
                <p id="name-error" className="mt-1.5 text-xs text-red-600">
                  {state.fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Email Address
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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  aria-required="true"
                  aria-describedby="password-rules"
                  placeholder="Create a strong password"
                  className={`w-full pl-4 pr-11 py-3 bg-slate-50 focus:bg-white border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 transition-all ${
                    state?.fieldErrors?.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg m-1"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2.5 space-y-1.5" aria-live="polite">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Password strength:</span>
                    <span
                      className={`font-semibold ${
                        strength.score <= 1
                          ? "text-red-600"
                          : strength.score === 2
                          ? "text-amber-600"
                          : strength.score === 3
                          ? "text-teal-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${getStrengthBarColor()}`} />
                  </div>
                </div>
              )}

              {/* Criteria Checklist */}
              <div id="password-rules" className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] text-slate-500">
                <div className={`flex items-center gap-1.5 ${strength.checks.minLength ? "text-teal-600 font-medium" : ""}`}>
                  <span>{strength.checks.minLength ? "✓" : "•"}</span>
                  <span>8+ characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${strength.checks.hasUppercase && strength.checks.hasLowercase ? "text-teal-600 font-medium" : ""}`}>
                  <span>{strength.checks.hasUppercase && strength.checks.hasLowercase ? "✓" : "•"}</span>
                  <span>Upper & lowercase</span>
                </div>
                <div className={`flex items-center gap-1.5 ${strength.checks.hasNumber ? "text-teal-600 font-medium" : ""}`}>
                  <span>{strength.checks.hasNumber ? "✓" : "•"}</span>
                  <span>At least 1 number</span>
                </div>
                <div className={`flex items-center gap-1.5 ${strength.checks.hasSpecial ? "text-teal-600 font-medium" : ""}`}>
                  <span>{strength.checks.hasSpecial ? "✓" : "•"}</span>
                  <span>Special symbol</span>
                </div>
              </div>

              {state?.fieldErrors?.password && (
                <p className="mt-1.5 text-xs text-red-600">{state.fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                aria-required="true"
                placeholder="Re-enter your password"
                className={`w-full px-4 py-3 bg-slate-50 focus:bg-white border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 transition-all ${
                  confirmPassword && password !== confirmPassword
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                }`}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600">Passwords do not match.</p>
              )}
              {state?.fieldErrors?.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600">{state.fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Terms & Privacy Agreement */}
            <div>
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 mt-0.5 text-teal-600 focus:ring-teal-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="terms" className="ml-2 block text-xs text-slate-600 leading-relaxed cursor-pointer">
                  I agree to the{" "}
                  <a href="#" className="font-semibold text-teal-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-semibold text-teal-600 hover:underline">
                    Privacy Policy
                  </a>
                  . My information is protected with industry-standard security.
                </label>
              </div>
              {state?.fieldErrors?.terms && (
                <p className="mt-1.5 text-xs text-red-600">{state.fieldErrors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
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
                    <span>Creating secure account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </div>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-teal-600 hover:text-teal-700 hover:underline focus:outline-none focus:ring-2 focus:ring-teal-500 rounded px-1"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
