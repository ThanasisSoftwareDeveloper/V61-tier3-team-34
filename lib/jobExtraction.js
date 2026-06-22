/**
 * Defines the structured-output contract for job-description extraction.
 * Used both to build the LLM prompt and to validate/normalize its response.
 */

export const EMPTY_EXTRACTED_JOB = {
  job_title: "",
  job_description: "",
  type_of_work: "",
  location: "",
  industry_sector: "",
  responsibilities: [],
  required_skills: [],
  required_qualifications: [],
  certifications: [],
  education: [],
  preferred_skills: [],
  experience: [],
  core_competencies: [],
  soft_skills: [],
  hard_skills: [],
  tools_and_technologies: [],
  work_authorization: "",
  security_clearance: "",
};

const STRING_FIELDS = [
  "job_title",
  "job_description",
  "type_of_work",
  "location",
  "industry_sector",
  "work_authorization",
  "security_clearance",
];

const ARRAY_FIELDS = [
  "responsibilities",
  "required_skills",
  "required_qualifications",
  "certifications",
  "education",
  "preferred_skills",
  "experience",
  "core_competencies",
  "soft_skills",
  "hard_skills",
  "tools_and_technologies",
];

export function buildExtractionPrompt(jdText) {
  return `You are an expert technical recruiter. Read the job description below and extract structured information from it.

Return ONLY a single valid JSON object — no markdown fences, no commentary, no preamble — matching exactly this shape:

{
  "job_title": "",
  "job_description": "",
  "type_of_work": "",
  "location": "",
  "industry_sector": "",
  "responsibilities": [],
  "required_skills": [],
  "required_qualifications": [],
  "certifications": [],
  "education": [],
  "preferred_skills": [],
  "experience": [],
  "core_competencies": [],
  "soft_skills": [],
  "hard_skills": [],
  "tools_and_technologies": [],
  "work_authorization": "",
  "security_clearance": ""
}

Rules:
- "type_of_work" should be one of: "Remote", "On Site", "Hybrid", or "" if not stated.
- "job_description" should be a 2-3 sentence plain-language summary of the role, written by you, not copied verbatim.
- Array fields must contain short strings (one item per skill/responsibility/etc.), never nested objects.
- If a field is not mentioned in the job description, return "" for string fields and [] for array fields. Never invent information.
- Do not include any field not listed above.

Job description:
"""
${jdText}
"""`;
}

/**
 * Validates and normalizes a parsed LLM response against the expected
 * schema, filling in safe defaults for anything missing or malformed.
 */
export function normalizeExtractedJob(raw) {
  const result = { ...EMPTY_EXTRACTED_JOB };

  if (!raw || typeof raw !== "object") {
    return result;
  }

  for (const field of STRING_FIELDS) {
    if (typeof raw[field] === "string") {
      result[field] = raw[field].trim();
    }
  }

  for (const field of ARRAY_FIELDS) {
    if (Array.isArray(raw[field])) {
      result[field] = raw[field]
        .map((item) => (typeof item === "string" ? item.trim() : String(item)))
        .filter(Boolean);
    }
  }

  return result;
}

/**
 * Strips markdown code fences some LLMs add despite instructions,
 * then parses JSON. Throws if the result still isn't valid JSON.
 */
export function parseLLMJson(rawResponse) {
  const cleaned = rawResponse
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  return JSON.parse(cleaned);
}
