"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { askTravelMateAction } from "./actions";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const SUGGESTED_PROMPTS = [
  "Plan a 5-day trip to Dubai under ₹50,000",
  "What are the best places to visit in Kashmir?",
  "Make a 4-day itinerary for Goa",
  "What should I pack for a mountain trek?",
  "Suggest budget destinations in India",
];

export default function AiChatView({
  userName,
  initialQuery = "",
  initialDestination = "",
}: {
  userName: string;
  initialQuery?: string;
  initialDestination?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi ${userName}! I'm your TravelMate AI assistant 🌍\nWhere are you dreaming of traveling? Ask me for custom day-by-day itineraries, budget breakdowns, best seasons, or packing tips.`,
      time: "Just now",
    },
  ]);

  const [input, setInput] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Auto-send initial query if provided
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSend(initialQuery);
    }
  }, []);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: "user-" + Date.now(),
      role: "user",
      content: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const historyToSend = messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    try {
      const res = await askTravelMateAction(
        query,
        {
          destination: initialDestination,
        },
        historyToSend
      );

      if (res.success && res.text) {
        const replyText = res.text;
        setMessages((prev) => [
          ...prev,
          {
            id: "ai-" + Date.now(),
            role: "assistant",
            content: replyText,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: "ai-err-" + Date.now(),
            role: "assistant",
            content:
              res.error ||
              "Sorry, I encountered an issue preparing that travel advice. Please try again.",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "ai-err-" + Date.now(),
          role: "assistant",
          content: "Network error. Please try asking again in a moment.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-64px)] max-h-[calc(100dvh-64px)] bg-slate-50 overflow-hidden w-full">
      {/* Sub-Header bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white font-black text-xs shadow-sm flex-shrink-0">
            AI
          </div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
              TravelMate AI Assistant
            </h1>
            <p className="text-[10px] text-slate-500 truncate">Real-time travel intelligence</p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 min-h-[40px] px-3 flex items-center rounded-lg hover:bg-slate-50 transition-colors flex-shrink-0"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 sm:px-6 py-4 sm:py-6 space-y-4 max-w-4xl w-full mx-auto overscroll-contain">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            } w-full`}
          >
            <div
              className={`max-w-[92%] sm:max-w-[80%] rounded-2xl p-3.5 sm:p-5 shadow-sm break-words [overflow-wrap:anywhere] ${
                msg.role === "user"
                  ? "bg-teal-600 text-white rounded-br-none"
                  : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
              }`}
            >
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
                {msg.content}
              </div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2 max-w-[90%]">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3.5 shadow-sm flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 font-medium text-[11px] sm:text-xs">TravelMate AI is planning...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Sticky Controls & Input Area */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 p-3 sm:p-4 shadow-lg flex-shrink-0 z-20">
        <div className="max-w-4xl mx-auto space-y-2.5">
          {/* Touch-Swipeable Suggestion Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar overscroll-x-contain">
            <span className="text-slate-400 flex-shrink-0 font-medium text-[11px] hidden sm:inline">
              Suggestions:
            </span>
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-teal-500 hover:bg-teal-50 active:bg-teal-100 hover:text-teal-700 text-slate-600 flex-shrink-0 transition-all cursor-pointer whitespace-nowrap text-[11px] min-h-[36px] flex items-center"
              >
                ✨ {prompt}
              </button>
            ))}
          </div>

          {/* Accessible Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your trip..."
              disabled={loading}
              className="flex-1 min-w-0 px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all disabled:opacity-60 min-h-[44px]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex-shrink-0 min-h-[44px] flex items-center justify-center gap-1.5"
              aria-label="Send travel question"
            >
              <span className="hidden sm:inline">Send</span>
              <span>💬</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
