"use client";

import { useState } from "react";
import { ChatMessage } from "@/lib/travel/types";

interface TripAiAssistantProps {
  destination: string;
  startLocation?: string | null;
  travelStyle?: string | null;
  budget: number;
  travelers: number;
}

export default function TripAiAssistant({
  destination,
  startLocation,
  travelStyle,
  budget,
  travelers,
}: TripAiAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hello! I'm TravelMate AI, your dedicated expedition guide for **${destination}**. I have full access to your real route from ${startLocation || "Delhi"}, current weather forecasts, permit guidelines, and cost benchmarks. How can I help you prepare?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    `What packing list do I need for ${destination}?`,
    `How do I obtain the ACAP and TIMS permits?`,
    `What are the best acclimatization tips for 4,130m?`,
    `Can I do this trek independently without a guide?`,
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: query };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: updatedHistory,
          tripContext: {
            destination,
            startLocation: startLocation || "Delhi",
            travelStyle: travelStyle || "Comfort",
            budget,
            travelers,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([
          ...updatedHistory,
          {
            role: "assistant",
            content: data.reply || "I've analyzed your itinerary. Let me know if you need specific details!",
          },
        ]);
      } else {
        setMessages([
          ...updatedHistory,
          {
            role: "assistant",
            content: "I'm temporarily experiencing connectivity issues with the travel intelligence layer. Please try again shortly.",
          },
        ]);
      }
    } catch (err) {
      console.error("AI assistant error:", err);
      setMessages([
        ...updatedHistory,
        {
          role: "assistant",
          content: "Network request failed. Please check your internet connection.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-4 sm:p-8 text-white shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-xl backdrop-blur-md flex-shrink-0">
            ✨
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Ask TravelMate AI about {destination}
            </h3>
            <p className="text-xs text-slate-300">
              Grounded AI assistant with real-time weather, routing, and permit knowledge.
            </p>
          </div>
        </div>

        <span className="self-start sm:self-center px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30">
          Live Intelligence
        </span>
      </div>

      {/* Chat Messages Log */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 sm:gap-3 text-xs leading-relaxed ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-xl bg-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                TM
              </div>
            )}
            <div
              className={`p-3.5 sm:p-4 rounded-2xl max-w-[88%] sm:max-w-xl break-words [overflow-wrap:anywhere] whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-teal-600 text-white rounded-br-none"
                  : "bg-white/10 text-slate-100 rounded-bl-none border border-white/10 backdrop-blur-md"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-xl bg-slate-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                You
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-xs text-teal-300">
            <div className="w-7 h-7 rounded-xl bg-teal-600/50 animate-pulse flex items-center justify-center">
              ⏳
            </div>
            <p className="animate-pulse">TravelMate is retrieving verified field data...</p>
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-300 block uppercase tracking-wider">
            Suggested Questions:
          </span>
          <span className="text-[10px] text-slate-400 sm:hidden">Swipe →</span>
        </div>
        <div className="flex overflow-x-auto sm:flex-wrap gap-2 pb-1 scrollbar-none snap-x">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              className="px-3 py-2 min-h-[38px] rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-slate-200 transition-colors text-left cursor-pointer snap-start flex-shrink-0 whitespace-nowrap"
            >
              💡 {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2 pt-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${destination} routes, weather, packing...`}
          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-base sm:text-xs text-white placeholder:text-slate-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all backdrop-blur-md"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-5 sm:px-6 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer flex-shrink-0 flex items-center justify-center"
        >
          Send 💬
        </button>
      </form>
    </div>
  );
}
