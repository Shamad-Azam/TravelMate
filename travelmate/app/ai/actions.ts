"use server";

import { getSession } from "@/lib/auth/session";
import { generateTravelAdviceWithHistory, ChatMessage, TravelContext } from "@/lib/ai";

export async function askTravelMateAction(
  prompt: string,
  context?: TravelContext,
  history?: ChatMessage[]
): Promise<{ success: boolean; text?: string; error?: string }> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Please log in to use TravelMate AI." };
  }

  const trimmed = prompt.trim();
  if (!trimmed) {
    return { success: false, error: "Please enter a question or destination." };
  }

  try {
    const text = await generateTravelAdviceWithHistory(trimmed, history || [], context);
    return { success: true, text };
  } catch (error) {
    console.error("[AI] askTravelMateAction error:", error);
    return {
      success: false,
      error: "Unable to reach TravelMate AI right now. Please try again.",
    };
  }
}
