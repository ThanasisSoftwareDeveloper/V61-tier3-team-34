/**
 * Extracts raw text from an uploaded job-description file.
 * Supports: .txt, .pdf, .docx
 * Legacy .doc is explicitly rejected with a clear message — reliable
 * parsing of the old binary Word format needs LibreOffice/antiword,
 * which is not worth the operational weight for an MVP.
 */

const SUPPORTED_EXTENSIONS = ["txt", "pdf", "docx"];

export class UnsupportedFileError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnsupportedFileError";
  }
}

function getExtension(filename) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

/**
 * @param {Buffer} buffer - raw file bytes
 * @param {string} filename - original filename, used to pick a parser
 * @returns {Promise<string>} extracted, cleaned plain text
 */
export async function extractTextFromFile(buffer, filename) {
  const ext = getExtension(filename);

  if (ext === "doc") {
    throw new UnsupportedFileError(
      "Legacy .doc files aren't supported. Please save the file as .docx or .pdf and try again."
    );
  }

  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    throw new UnsupportedFileError(
      `Unsupported file type ".${ext || "unknown"}". Please upload a .txt, .pdf, or .docx file.`
    );
  }

  let rawText = "";

  if (ext === "txt") {
    rawText = buffer.toString("utf-8");
  } else if (ext === "pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const result = await pdfParse(buffer);
    rawText = result.text;
  } else if (ext === "docx") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    rawText = result.value;
  }

  return cleanText(rawText);
}

/**
 * Normalizes whitespace and strips control characters while
 * preserving bullet points and paragraph structure.
 */
export function cleanText(text) {
  if (!text) return "";

  return text
    // Remove null bytes / control chars (keep \n and \t)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    // Normalize different bullet characters to a consistent dash
    .replace(/[•◦▪‣]/g, "-")
    // Collapse 3+ blank lines down to a max of 2
    .replace(/\n{3,}/g, "\n\n")
    // Collapse runs of spaces/tabs (not newlines) into one space
    .replace(/[ \t]{2,}/g, " ")
    // Trim trailing whitespace on each line
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}
