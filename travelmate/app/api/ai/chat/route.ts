import { NextRequest, NextResponse } from "next/server";
import { generateTravelAdviceWithHistory, ChatMessage, TravelContext } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = (body.prompt || body.message || "").trim();
    const history: ChatMessage[] = Array.isArray(body.history) ? body.history : [];
    const context: TravelContext | undefined = body.context || body.tripContext;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const reply = await generateTravelAdviceWithHistory(prompt, history, context);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[API ai/chat] error:", error);
    return NextResponse.json({ error: "Unable to complete travel consultation right now." }, { status: 500 });
  }
}
