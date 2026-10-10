
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const MODEL = "gemma-4-26b-a4b-it";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing from .env.local." },
        { status: 500 }
      );
    }

    let body: { task?: unknown };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const task = body.task;

    if (typeof task !== "string" || !task.trim()) {
      return NextResponse.json(
        { error: "Please enter a coding task." },
        { status: 400 }
      );
    }

    if (task.length > 10000) {
      return NextResponse.json(
        { error: "Task must be 10,000 characters or fewer." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are a coding assistant inside ProofForge Lite.

Help solve the coding task below.
- Provide clear, readable code.
- Explain the approach briefly.
- Consider relevant edge cases.
- Never claim that code was tested unless it was actually executed.

CODING TASK:
${task.trim()}
`;

    let lastError: unknown;

    // Retry temporary API/server errors up to 3 total attempts.
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const result = await ai.models.generateContent({
          model: MODEL,
          contents: prompt,
        });

        const text = result.text;

        if (!text?.trim()) {
          throw new Error("Gemma returned an empty response.");
        }

        return NextResponse.json({
          response: text,
          model: MODEL,
        });
      } catch (error) {
        lastError = error;

        console.error(
          `Gemma request attempt ${attempt} failed:`,
          error
        );

        if (attempt < 3) {
          await wait(attempt * 1000);
        }
      }
    }

    const details =
      lastError instanceof Error ? lastError.message : "";

    return NextResponse.json(
      {
        error:
          "Gemma could not generate a response after 3 attempts. " +
          "Please try again in a moment.",
        details: details.slice(0, 500),
      },
      { status: 502 }
    );
  } catch (error) {
    console.error("ProofForge API error:", error);

    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
