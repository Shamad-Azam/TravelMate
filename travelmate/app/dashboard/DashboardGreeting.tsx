"use client";

import { useEffect, useState } from "react";
import { getTimeGreeting, extractFirstName } from "@/lib/utils/greeting";

interface DashboardGreetingProps {
  initialGreeting: string;
  name?: string | null;
}

export default function DashboardGreeting({
  initialGreeting,
  name,
}: DashboardGreetingProps) {
  const [greeting, setGreeting] = useState(initialGreeting);
  const firstName = extractFirstName(name);

  useEffect(() => {
    function updateGreeting() {
      try {
        const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setGreeting(getTimeGreeting(new Date(), userTz));
      } catch {
        setGreeting(getTimeGreeting(new Date()));
      }
    }

    // Evaluate on client mount using user's actual browser timezone & clock
    updateGreeting();

    // Re-evaluate every minute to keep greeting accurate over time
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
        <span>
          {greeting}, {firstName}
        </span>
        <span>👋</span>
      </h1>
      <p className="text-xs sm:text-base font-semibold text-slate-700 mt-1">
        Ready to plan your next adventure?
      </p>
    </div>
  );
}
