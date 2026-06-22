import { NextResponse } from "next/server";
import { extractTextFromFile, cleanText, UnsupportedFileError } from "@/lib/parseFile";
import { getSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * POST /api/ingest
 * Accepts either:
 *  - multipart/form-data with a "file" field (.txt/.pdf/.docx), or
 *  - application/json with a "text" field (pasted JD)
 *
 * Extracts and cleans the job description text, stores a new session
 * row in Supabase, and returns the session id + extracted text.
 */
export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let jdText = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");

      if (!file || typeof file === "string") {
        return NextResponse.json(
          { error: "No file was provided." },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      try {
        jdText = await extractTextFromFile(buffer, file.name);
      } catch (err) {
        if (err instanceof UnsupportedFileError) {
          return NextResponse.json({ error: err.message }, { status: 400 });
        }
        throw err;
      }
    } else {
      const body = await request.json();
      jdText = cleanText(body.text || "");
    }

    if (!jdText || jdText.trim().length < 30) {
      return NextResponse.json(
        {
          error:
            "The job description looks too short or empty. Please provide more detail.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("jd_sessions")
      .insert({ jd_text: jdText })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error (jd_sessions):", error);
      return NextResponse.json(
        { error: "Could not save the job description. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ sessionId: data.id, jdText });
  } catch (err) {
    console.error("Ingest error:", err);
    return NextResponse.json(
      { error: "Something went wrong while processing your job description." },
      { status: 500 }
    );
  }
}
