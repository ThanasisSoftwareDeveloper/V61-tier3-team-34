import { describe, it, expect } from "vitest";
import { cleanText } from "@/lib/parseFile";

describe("cleanText", () => {
  it("returns empty string for falsy input", () => {
    expect(cleanText("")).toBe("");
    expect(cleanText(null)).toBe("");
    expect(cleanText(undefined)).toBe("");
  });

  it("normalizes bullet characters to a dash", () => {
    expect(cleanText("• Item one\n◦ Item two\n▪ Item three")).toBe(
      "- Item one\n- Item two\n- Item three"
    );
  });

  it("collapses three or more blank lines down to two", () => {
    expect(cleanText("Line one\n\n\n\nLine two")).toBe("Line one\n\nLine two");
  });

  it("collapses runs of spaces but preserves newlines", () => {
    expect(cleanText("Hello    world\nNext   line")).toBe("Hello world\nNext line");
  });

  it("trims trailing whitespace per line", () => {
    expect(cleanText("Hello   \nWorld   ")).toBe("Hello\nWorld");
  });

  it("strips control characters", () => {
    expect(cleanText("Hello\u0000World")).toBe("HelloWorld");
  });
});
