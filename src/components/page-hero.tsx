import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-gradient-to-b from-lavender/40 via-ivory to-ivory pb-16 pt-32 text-ink md:pb-24 md:pt-40 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow text-violet font-extrabold tracking-[0.2em]">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-ink leading-[1.06] tracking-tight">
          {title}
        </h1>
        <div className="mt-8 grid gap-8 border-t border-border pt-8 md:grid-cols-2 md:items-end">
          <p className="max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">{intro}</p>
          {children && <div className="md:justify-self-end">{children}</div>}
        </div>
      </div>
    </section>

  );
}

export function Crumbs({ items }: { items: string[] }) {
  return (
    <nav aria-label="Breadcrumb" className="eyebrow text-ink/60 mb-6">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="hover:text-violet transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, idx) => (
          <li
            key={item}
            className={`before:mr-2 before:content-['/'] before:text-ink/40 ${
              idx === items.length - 1 ? "text-ink font-bold" : "hover:text-violet"
            }`}
          >
            {item}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export const seoMeta = (title: string, description: string) => [
  { title },
  { name: "description", content: description },
  { property: "og:title", content: title },
  { property: "og:description", content: description },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
];
