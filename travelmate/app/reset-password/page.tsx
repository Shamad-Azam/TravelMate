"use client";

import { useActionState, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPasswordAction } from "@/lib/auth/actions";
import { evaluatePasswordStrength } from "@/lib/auth/validation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [state, formAction, isPending] = useActionState(resetPasswordAction, null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const strength = evaluatePasswordStrength(password);

  return (
    <div className="bg-white py-8 px-5 sm:px-10 shadow-xl shadow-slate-200/60 rounded-2xl sm:rounded-3xl border border-slate-200">
      {/* Success Notification */}
      {state?.success ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Password reset successful!</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your TravelMate password has been securely updated. You can now sign in with your new password.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-block w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow transition-colors"
            >
              Sign In to TravelMate
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Missing Token Warning */}
          {!token && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm">
              <p className="font-semibold">Reset Token Required</p>
              <p className="mt-0.5">
                No reset token was found in the link. Please use the link sent to your email, or request a new one below.
              </p>
            </div>
          )}

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
              <div className="text-xs sm:text-sm">
                <p className="font-semibold">Reset Error</p>
                <p className="mt-0.5 leading-relaxed">{state.error}</p>
              </div>
            </div>
          )}

          <form action={formAction} className="space-y-5" noValidate>
            <input type="hidden" name="token" value={token} />

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Enter new password"
                  className="w-full pl-4 pr-11 py-3 bg-slate-50 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 rounded-lg m-1"
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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

              {/* Password strength */}
              {password && (
                <div className="mt-2 text-xs flex items-center justify-between">
                  <span className="text-slate-500">Strength:</span>
                  <span className="font-semibold text-teal-600">{strength.label}</span>
                </div>
              )}
              {state?.fieldErrors?.newPassword && (
                <p className="mt-1.5 text-xs text-red-600">{state.fieldErrors.newPassword}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder="Re-enter new password"
                className="w-full px-4 py-3 bg-slate-50 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600">Passwords do not match.</p>
              )}
              {state?.fieldErrors?.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600">{state.fieldErrors.confirmPassword}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending || !token}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-sm shadow-md shadow-teal-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPending ? "Updating password..." : "Set New Password"}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link href="/forgot-password" className="text-xs text-teal-600 hover:underline">
              Request a new reset link
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
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
          Create new password
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Your new password must be secure and different from previous ones
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Suspense fallback={<div className="bg-white p-8 rounded-2xl text-center text-sm text-slate-500">Loading reset form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
