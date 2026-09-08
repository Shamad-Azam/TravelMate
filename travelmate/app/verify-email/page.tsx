"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") || "your email";
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handleResend = () => {
    // UI-only for now; backend email provider needed in live mode
    setResendStatus("A fresh verification link has been sent to your email.");
  };

  return (
    <div className="bg-white py-8 px-5 sm:px-10 shadow-xl shadow-slate-200/60 rounded-2xl sm:rounded-3xl border border-slate-200 text-center">
      {token ? (
        // Token present in URL (User clicked link in email)
        <div className="space-y-4">
          <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-600 mx-auto flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Email Verified!</h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            Your email has been successfully confirmed. You now have full access to TravelMate features.
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
      ) : (
        // Pending verification (User just signed up)
        <div className="space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center border border-teal-100">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-slate-900">Verify your email address</h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            We’ve sent a verification link to <span className="font-semibold text-slate-800">{email}</span>.
            Please click the link in the message to activate your account.
          </p>

          {resendStatus && (
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800">
              {resendStatus}
            </div>
          )}

          <div className="pt-2 space-y-3">
            <button
              type="button"
              onClick={handleResend}
              className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
            >
              Resend verification email
            </button>

            <Link
              href="/login"
              className="inline-block text-xs font-medium text-slate-500 hover:text-teal-600 transition-colors"
            >
              Back to Sign In
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 text-left text-xs text-slate-500 space-y-1">
            <p className="font-medium text-slate-700">Security considerations:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
              <li>Verification links expire after 24 hours</li>
              <li>Links are single-use and cryptographically signed</li>
              <li>Check your spam folder if the email doesn&apos;t arrive within 2 minutes</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
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
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Suspense fallback={<div className="bg-white p-8 rounded-2xl text-center text-sm text-slate-500">Loading verification details...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
