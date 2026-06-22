const SAMPLE_QUESTIONS = [
  {
    category: "Technical",
    question: "Walk me through how you'd structure state in a mid-size React app.",
  },
  {
    category: "Behavioral",
    question: "Tell me about a time you disagreed with a teammate's approach.",
  },
  {
    category: "Experience",
    question: "What's the most complex feature you've shipped in the last year?",
  },
];

export default function SampleQuestionsPreview() {
  return (
    <section aria-labelledby="sample-questions-heading" className="mt-12">
      <h2
        id="sample-questions-heading"
        className="font-display text-lg font-semibold text-ink mb-1"
      >
        The kind of questions you&apos;ll get
      </h2>
      <p className="text-sm text-ink/60 mb-5">
        A preview — your real questions are generated from your job description.
      </p>

      <ul className="grid gap-3 md:grid-cols-3">
        {SAMPLE_QUESTIONS.map((item) => (
          <li
            key={item.category}
            className="rounded-xl border border-line bg-white p-4"
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-wide text-amber-dark mb-2">
              {item.category}
            </span>
            <p className="text-sm text-ink leading-relaxed">{item.question}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
