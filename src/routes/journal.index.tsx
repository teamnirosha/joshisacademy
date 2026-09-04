import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock, Tag } from "lucide-react";
import { PageHero, seoMeta } from "@/components/page-hero";
import { articles } from "@/content/site";

export const Route = createFileRoute("/journal/")({
  head: () => ({
    meta: [
      ...seoMeta(
        "Academic Journal & Science Guides for Kharadi & Pune Students | Joshi’s Academy",
        "Read expert academic study guides, board exam preparation strategies, and curriculum advice for CBSE & ICSE Class 9 & 10 Science by Joshi’s Academy Kharadi.",
      ),
      { name: "keywords", content: "coaching guides Kharadi, CBSE 10th science preparation Kharadi, best science tuition guide Pune, ICSE 10th study strategy Kharadi" },
    ],
    links: [{ rel: "canonical", href: "https://joshisacademy.com/journal" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://joshisacademy.com/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Journal",
              item: "https://joshisacademy.com/journal",
            },
          ],
        }),
      },
    ],
  }),
  component: JournalIndexPage,
});

const categories = [
  "All",
  "CBSE Science",
  "Class X",
  "Class IX",
  "Physics",
  "Biology",
  "Curriculum Guide",
  "Board Strategy",
];

function JournalIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter(
          (a) =>
            a.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            a.classLevel.toLowerCase().includes(selectedCategory.toLowerCase()),
        );

  return (
    <>
      <PageHero
        eyebrow="The Joshi’s Journal"
        title="Thinking clearly about Science."
        intro="Practical, thoughtful academic guidance for students and parents—written by educators to improve authentic understanding, not to chase search trends."
      />

      <section className="section-shell py-24 md:py-36">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border pb-8 mb-16">
          <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground mr-2 flex items-center gap-1.5">
            <Tag className="size-3.5 text-violet" /> Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-violet text-ivory shadow-sm"
                  : "bg-white border border-border text-ink hover:bg-lavender/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Editorial Articles Grid */}
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((art, idx) => (
            <Link
              key={art.slug}
              to="/journal/$slug"
              params={{ slug: art.slug }}
              className="group bg-white p-8 md:p-10 transition-colors hover:bg-ivory flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/50 pb-4">
                  <span className="eyebrow text-royal">{art.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3 text-violet" />
                    {art.readingTime}
                  </span>
                </div>

                <h2 className="mt-6 font-display text-2xl sm:text-3xl text-ink group-hover:text-violet transition-colors leading-snug">
                  {art.title}
                </h2>

                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {art.excerpt}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-ink group-hover:text-violet transition-colors">
                <span>Read Guide</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
