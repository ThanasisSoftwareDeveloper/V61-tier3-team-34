/**
 * Defines the structured-output contract for interview question generation.
 */

export const QUESTION_CATEGORIES = ["technical", "behavioral", "experience"];

export const EMPTY_QUESTIONS = {
  technical: [],
  behavioral: [],
  experience: [],
};

export function buildQuestionGenerationPrompt(extractedJob, quantityPerCategory = 5) {
  return `You are an experienced interviewer preparing to interview a candidate for this role.

Job title: ${extractedJob.job_title || "Unknown"}
Summary: ${extractedJob.job_description || "N/A"}
Required skills: ${extractedJob.required_skills.join(", ") || "N/A"}
Preferred skills: ${extractedJob.preferred_skills.join(", ") || "N/A"}
Responsibilities: ${extractedJob.responsibilities.join("; ") || "N/A"}
Tools/Technologies: ${extractedJob.tools_and_technologies.join(", ") || "N/A"}
Experience required: ${extractedJob.experience.join("; ") || "N/A"}
Core competencies: ${extractedJob.core_competencies.join(", ") || "N/A"}

Generate exactly ${quantityPerCategory} interview questions for each of these three categories:
- "technical": questions testing hands-on knowledge of the required tools, skills, and technologies.
- "behavioral": questions about how the candidate has handled past situations (teamwork, conflict, leadership, communication).
- "experience": questions probing the candidate's specific past experience relevant to this role's responsibilities and seniority.

Each question must include a concise sample answer (3-5 sentences) showing what a strong response looks like, written in first person as if the candidate is answering.

Return ONLY a single valid JSON object — no markdown fences, no commentary — matching exactly this shape:

{
  "technical": [{ "question": "", "sample_answer": "" }],
  "behavioral": [{ "question": "", "sample_answer": "" }],
  "experience": [{ "question": "", "sample_answer": "" }]
}`;
}

function normalizeQuestionList(rawList) {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .filter((item) => item && typeof item === "object")
    .map((item, index) => ({
      id: `${index}`,
      question: typeof item.question === "string" ? item.question.trim() : "",
      sample_answer:
        typeof item.sample_answer === "string" ? item.sample_answer.trim() : "",
    }))
    .filter((item) => item.question.length > 0);
}

export function normalizeQuestions(raw) {
  const result = { ...EMPTY_QUESTIONS };
  if (!raw || typeof raw !== "object") return result;

  for (const category of QUESTION_CATEGORIES) {
    result[category] = normalizeQuestionList(raw[category]);
  }

  return result;
}
