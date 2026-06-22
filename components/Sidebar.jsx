"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/job-summary", label: "Job Summary" },
  { href: "/interview-questions", label: "Interview Questions" },
  { href: "/mock-interview", label: "Mock Interview" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="md:w-60 md:shrink-0 md:border-r md:border-line md:min-h-screen md:py-10 md:px-6 border-b border-line px-4 py-3 md:flex md:flex-col"
    >
      <Link
        href="/"
        className="hidden md:block font-display text-xl font-semibold text-ink mb-10 focus-ring rounded"
      >
        DashFetch
      </Link>

      <ul className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`block whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-ring ${
                  isActive
                    ? "bg-ink text-paper"
                    : "text-ink/70 hover:bg-paper-alt hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="hidden md:block mt-auto pt-10">
        <Link
          href="/"
          className="block w-full text-center rounded-lg border border-ink/15 px-4 py-2.5 text-sm font-medium text-ink hover:bg-paper-alt transition-colors focus-ring"
        >
          New Analysis
        </Link>
      </div>
    </nav>
  );
}
