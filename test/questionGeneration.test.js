import { describe, it, expect } from "vitest";
import { normalizeQuestions, EMPTY_QUESTIONS } from "@/lib/questionGeneration";

describe("normalizeQuestions", () => {
  it("returns empty categories when given null", () => {
    expect(normalizeQuestions(null)).toEqual(EMPTY_QUESTIONS);
  });

  it("keeps valid questions and assigns ids", () => {
    const result = normalizeQuestions({
      technical: [{ question: "What is React?", sample_answer: "A library." }],
    });
    expect(result.technical).toEqual([
      { id: "0", question: "What is React?", sample_answer: "A library." },
    ]);
  });

  it("drops items with an empty question", () => {
    const result = normalizeQuestions({
      behavioral: [{ question: "", sample_answer: "n/a" }],
    });
    expect(result.behavioral).toEqual([]);
  });

  it("defaults sample_answer to an empty string when missing", () => {
    const result = normalizeQuestions({
      experience: [{ question: "Tell me about a project." }],
    });
    expect(result.experience[0].sample_answer).toBe("");
  });

  it("ignores non-array category values", () => {
    const result = normalizeQuestions({ technical: "not an array" });
    expect(result.technical).toEqual([]);
  });
});
