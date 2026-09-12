"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/lib/auth/actions";

interface NavbarProps {
  userName: string;
  userEmail?: string;
  activePath?: string;
}

export default function Navbar({ userName, userEmail, activePath = "/dashboard" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userInitial = (userName || "T").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo matching Mockup */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 group focus:outline-none min-h-[44px] items-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="text-blue-600 text-2xl flex-shrink-0">
              ✈️
            </div>
            <span className="text-xl font-black tracking-tight text-blue-700">
              TravelMate
            </span>
          </Link>

          {/* Desktop Navigation Pills */}
          <nav className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-600">
            <Link
              href="/dashboard"
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                activePath === "/dashboard"
                  ? "bg-blue-50 text-blue-700 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>🏠</span>
              <span>Home</span>
            </Link>

            <Link
              href="/dashboard#my-trips"
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                activePath === "/trips"
                  ? "bg-blue-50 text-blue-700 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>💼</span>
              <span>My Trips</span>
            </Link>

            <Link
              href="/ai"
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                activePath === "/ai"
                  ? "bg-blue-50 text-blue-700 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span className="text-amber-500">✨</span>
              <span>AI Travel Agent</span>
            </Link>

            <Link
              href="/find-buddies"
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                activePath === "/find-buddies"
                  ? "bg-blue-50 text-blue-700 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>👥</span>
              <span>Find Buddy</span>
            </Link>
          </nav>

          {/* User Profile & Notifications (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Bell notification with red dot */}
            <button
              type="button"
              className="relative p-2.5 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 py-1 pr-1.5 rounded-full hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center overflow-hidden shadow-sm">
                  {userInitial}
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {userName}
                </span>
                <span className="text-slate-400 text-xs">▼</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 divide-y divide-slate-100">
                  <div className="px-4 py-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                    {userEmail && (
                      <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
                    )}
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard#my-trips"
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      My Trips
                    </Link>
                    <Link
                      href="/find-buddies"
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Find Buddy
                    </Link>
                  </div>

                  <div className="pt-1">
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Right Controls: Bell + Hamburger */}
          <div className="md:hidden flex items-center gap-1">
            {/* Mobile notification icon */}
            <button
              type="button"
              className="relative p-2.5 text-slate-500 hover:text-slate-800 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* Mobile Avatar Circle */}
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {userInitial}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Toggle mobile navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer with Backdrop */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-50 md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            {/* User Profile Card */}
            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-slate-900 truncate">{userName}</p>
                {userEmail && <p className="text-xs text-slate-500 truncate">{userEmail}</p>}
              </div>
            </div>

            {/* Navigation Links with >= 48px Touch Targets */}
            <nav className="flex flex-col space-y-1.5">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`min-h-[48px] px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-3 transition-colors ${
                  activePath === "/dashboard"
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                }`}
              >
                <span className="text-lg">🏠</span>
                <span>Home</span>
              </Link>
              <Link
                href="/dashboard#my-trips"
                onClick={() => setMobileMenuOpen(false)}
                className={`min-h-[48px] px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-3 transition-colors ${
                  activePath === "/trips"
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                }`}
              >
                <span className="text-lg">💼</span>
                <span>My Trips</span>
              </Link>
              <Link
                href="/ai"
                onClick={() => setMobileMenuOpen(false)}
                className={`min-h-[48px] px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-3 transition-colors ${
                  activePath === "/ai"
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                }`}
              >
                <span className="text-lg text-amber-500">✨</span>
                <span>AI Travel Agent</span>
              </Link>
              <Link
                href="/find-buddies"
                onClick={() => setMobileMenuOpen(false)}
                className={`min-h-[48px] px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-3 transition-colors ${
                  activePath === "/find-buddies"
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                }`}
              >
                <span className="text-lg">👥</span>
                <span>Find Buddy</span>
              </Link>
            </nav>

            {/* Sign Out Action */}
            <div className="pt-2 border-t border-slate-100">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full min-h-[48px] px-4 py-3 rounded-2xl text-left font-bold text-sm text-red-600 hover:bg-red-50 active:bg-red-100 flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <span className="text-lg">🚪</span>
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
