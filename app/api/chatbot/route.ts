import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { chatbotSchema } from "@/lib/validations";
import { buildPortfolioKnowledge, localAssistantReply } from "@/services/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = chatbotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: localAssistantReply(parsed.data.message),
        mode: "local",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `${buildPortfolioKnowledge()}\n\nUser question: ${parsed.data.message}\n\nRespond in 2-5 concise sentences.`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text().trim();

    return NextResponse.json({
      reply: reply || localAssistantReply(parsed.data.message),
      mode: "gemini",
    });
  } catch {
    return NextResponse.json({
      reply:
        "I hit a temporary issue generating a reply. Please try again, or browse the portfolio sections directly.",
      mode: "fallback",
    });
  }
}
