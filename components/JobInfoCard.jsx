function formatValue(value) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value : null;
  }
  return value && value.trim().length > 0 ? value : null;
}

export default function JobInfoCard({ label, value }) {
  const formatted = formatValue(value);

  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/50 mb-2">
        {label}
      </h3>
      {!formatted ? (
        <p className="text-sm text-ink/40 italic">Not provided</p>
      ) : Array.isArray(formatted) ? (
        <ul className="flex flex-wrap gap-2">
          {formatted.map((item, i) => (
            <li
              key={i}
              className="rounded-full bg-paper-alt px-3 py-1 text-xs text-ink/80"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink leading-relaxed">{formatted}</p>
      )}
    </div>
  );
}
