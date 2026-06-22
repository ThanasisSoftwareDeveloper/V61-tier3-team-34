import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper-alt mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        <div>
          <span className="font-display text-lg font-semibold text-ink">
            DashFetch
          </span>
          <p className="mt-2 text-sm text-ink/60 max-w-xs">
            Transforming job descriptions into interview success.
          </p>
        </div>

        <div className="flex gap-12 text-sm">
          <div>
            <h3 className="font-medium text-ink mb-3">Quick Links</h3>
            <ul className="space-y-2 text-ink/60">
              <li>
                <Link href="/" className="hover:text-ink focus-ring rounded">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-ink focus-ring rounded">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-ink/40 max-w-xs">
          DashFetch analyzes job descriptions to generate practice interview
          questions. Built by Chingu Voyage V61, Tier 3, Team 34.
        </p>
      </div>
    </footer>
  );
}
