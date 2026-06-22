import { describe, it, expect } from "vitest";
import {
  normalizeExtractedJob,
  parseLLMJson,
  EMPTY_EXTRACTED_JOB,
} from "@/lib/jobExtraction";

describe("normalizeExtractedJob", () => {
  it("returns the empty schema when given null", () => {
    expect(normalizeExtractedJob(null)).toEqual(EMPTY_EXTRACTED_JOB);
  });

  it("returns the empty schema when given a non-object", () => {
    expect(normalizeExtractedJob("not an object")).toEqual(EMPTY_EXTRACTED_JOB);
  });

  it("keeps valid string fields and trims whitespace", () => {
    const result = normalizeExtractedJob({ job_title: "  Frontend Developer  " });
    expect(result.job_title).toBe("Frontend Developer");
  });

  it("ignores non-string values for string fields", () => {
    const result = normalizeExtractedJob({ job_title: 12345 });
    expect(result.job_title).toBe("");
  });

  it("keeps valid array fields and trims each item", () => {
    const result = normalizeExtractedJob({
      required_skills: [" React ", "JavaScript", " CSS"],
    });
    expect(result.required_skills).toEqual(["React", "JavaScript", "CSS"]);
  });

  it("drops empty strings from array fields", () => {
    const result = normalizeExtractedJob({
      required_skills: ["React", "", "   ", "CSS"],
    });
    expect(result.required_skills).toEqual(["React", "CSS"]);
  });

  it("falls back to empty array when field is not an array", () => {
    const result = normalizeExtractedJob({ required_skills: "React" });
    expect(result.required_skills).toEqual([]);
  });

  it("ignores unknown fields not in the schema", () => {
    const result = normalizeExtractedJob({ made_up_field: "should not appear" });
    expect(result.made_up_field).toBeUndefined();
  });
});

describe("parseLLMJson", () => {
  it("parses plain JSON", () => {
    expect(parseLLMJson('{"a": 1}')).toEqual({ a: 1 });
  });

  it("strips markdown json code fences", () => {
    expect(parseLLMJson('```json\n{"a": 1}\n```')).toEqual({ a: 1 });
  });

  it("strips plain code fences without language tag", () => {
    expect(parseLLMJson('```\n{"a": 1}\n```')).toEqual({ a: 1 });
  });

  it("throws on invalid JSON", () => {
    expect(() => parseLLMJson("not json")).toThrow();
  });
});
