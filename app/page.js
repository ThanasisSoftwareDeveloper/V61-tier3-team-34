"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadZone from "@/components/UploadZone";
import SampleQuestionsPreview from "@/components/SampleQuestionsPreview";
import Footer from "@/components/Footer";
import { saveSession } from "@/lib/clientSession";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(input) {
    setIsLoading(true);
    setError("");

    try {
      // Step 1: ingest (extract + store raw text)
      let ingestRes;
      if (input.type === "file") {
        const formData = new FormData();
        formData.append("file", input.value);
        ingestRes = await fetch("/api/ingest", { method: "POST", body: formData });
      } else {
        ingestRes = await fetch("/api/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: input.value }),
        });
      }

      const ingestData = await ingestRes.json();
      if (!ingestRes.ok) {
        throw new Error(ingestData.error || "Could not process the job description.");
      }

      // Step 2: parse via Groq into structured JSON
      const parseRes = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: ingestData.sessionId,
          jdText: ingestData.jdText,
        }),
      });
      const parseData = await parseRes.json();
      if (!parseRes.ok) {
        throw new Error(parseData.error || "Could not analyze the job description.");
      }

      saveSession({
        sessionId: parseData.sessionId,
        jdText: ingestData.jdText,
        extractedJob: parseData.extractedJob,
        questions: null,
      });

      router.push("/job-summary");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-dark mb-4">
            DashFetch
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink leading-tight mb-4">
            Know what they&apos;ll ask, before you walk in.
          </h1>
          <p className="text-base text-ink/60 mb-10 max-w-xl">
            Paste a job description or upload the file. We&apos;ll predict the
            technical, behavioral, and experience questions a recruiter is
            likely to ask — so you can practice with a clear head.
          </p>

          <UploadZone onSubmit={handleSubmit} isLoading={isLoading} />

          {error && (
            <p role="alert" className="mt-4 text-sm text-error">
              {error}
            </p>
          )}

          <SampleQuestionsPreview />
        </div>
      </main>
      <Footer />
    </div>
  );
}
