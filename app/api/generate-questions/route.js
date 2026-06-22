import { NextResponse } from "next/server";
import { getGroqClient, GROQ_MODEL } from "@/lib/groq";
import {
  buildQuestionGenerationPrompt,
  normalizeQuestions,
} from "@/lib/questionGeneration";
import { parseLLMJson } from "@/lib/jobExtraction";
import { getSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * POST /api/generate-questions
 * Body: { sessionId: string, extractedJob: object, quantityPerCategory?: number }
 *
 * Sends the extracted job data to Groq to generate Technical, Behavioral,
 * and Experience-based interview questions with sample answers.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { sessionId, extractedJob, quantityPerCategory = 5 } = body;

  if (!extractedJob || typeof extractedJob !== "object") {
    return NextResponse.json(
      { error: "Missing extracted job data — analyze a job description first." },
      { status: 400 }
    );
  }

  const safeQuantity = Math.min(Math.max(Number(quantityPerCategory) || 5, 1), 20);

  let questions;
  try {
    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "user",
          content: buildQuestionGenerationPrompt(extractedJob, safeQuantity),
        },
      ],
      temperature: 0.6,
      response_format: { type: "json_object" },
    });

    const rawContent = completion.choices?.[0]?.message?.content || "";
    const parsed = parseLLMJson(rawContent);
    questions = normalizeQuestions(parsed);
  } catch (err) {
    console.error("Groq question generation error:", err);
    return NextResponse.json(
      {
        error:
          "We couldn't generate questions right now. Please try again in a moment.",
      },
      { status: 502 }
    );
  }

  if (sessionId) {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("jd_sessions")
        .update({ generated_questions: questions })
        .eq("id", sessionId);

      if (error) {
        console.error("Supabase update error (generated_questions):", error);
      }
    } catch (err) {
      console.error("Supabase write skipped:", err);
    }
  }

  return NextResponse.json({ sessionId: sessionId || null, questions });
}
