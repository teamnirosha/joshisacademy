import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { PageHero, seoMeta } from "@/components/page-hero";
import { courses } from "@/content/site";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      ...seoMeta(
        "CBSE & ICSE Science Coaching Classes in Kharadi, Pune | Courses — Joshi’s Academy",
        "Explore CBSE & ICSE Science coaching programmes for Classes 9 & 10 at Joshi’s Academy in Kharadi, Pune. Serving Chandan Nagar, Wagholi, Viman Nagar. Physics, Chemistry & Biology small batch classes.",
      ),
      { name: "keywords", content: "science coaching classes in Kharadi, CBSE class 10 science coaching Kharadi, ICSE class 10 science classes Kharadi, CBSE class 9 science tuition, 10th science tuition Chandan Nagar, Wagholi science classes" },
    ],
    links: [{ rel: "canonical", href: "https://joshisacademy.com/courses" }],
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
              name: "Courses",
              item: "https://joshisacademy.com/courses",
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Science Coaching Programmes in Kharadi, Pune",
          itemListElement: courses.map((c, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Course",
              name: c.title,
              description: c.description,
              url: `https://joshisacademy.com/courses/${c.slug}`,
              provider: {
                "@type": "EducationalOrganization",
                name: "Joshi’s Academy",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Kharadi, Pune",
                  addressRegion: "Maharashtra",
                  addressCountry: "IN",
                },
              },
            },
          })),
        }),
      },
    ],
  }),
  component: CoursesDirectoryPage,
});

function CoursesDirectoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Academic Directory"
        title="Science programmes built around understanding."
        intro="Four focused programmes. One consistent method: clear concepts, disciplined practice, regular testing and personal attention."
      />

      <section className="section-shell py-24 md:py-36">
        <div className="divide-y divide-border border-y border-border">
          {courses.map((c, i) => (
            <Link
              key={c.id}
              to="/courses/$slug"
              params={{ slug: c.slug }}
              className="group grid gap-6 py-12 transition-colors hover:bg-lavender/30 sm:px-6 md:grid-cols-[80px_1.1fr_1.3fr_180px] md:items-center"
            >
              <span className="font-sans text-xs font-bold text-violet">0{i + 1}</span>

              <div>
                <span className="eyebrow text-royal">{c.board}</span>
                <h2 className="mt-1 font-display text-3xl sm:text-4xl text-ink transition-transform duration-300 group-hover:translate-x-2">
                  {c.className}
                  <br />
                  Science
                </h2>
              </div>

              <div>
                <p className="text-sm leading-relaxed text-muted-foreground max-w-lg">
                  {c.description}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs font-bold text-ink/80">
                  <span className="flex items-center gap-1">
                    <Check className="size-3 text-violet" /> Physics
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="size-3 text-violet" /> Chemistry
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="size-3 text-violet" /> Biology
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet group-hover:text-royal transition-colors">
                <span>Explore Course</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-2" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
