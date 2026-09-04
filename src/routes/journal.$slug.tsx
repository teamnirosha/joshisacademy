import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, Clock, BookOpen, CheckCircle, Tag } from "lucide-react";
import { Crumbs } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { articles, courses } from "@/content/site";

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const art = articles.find((x) => x.slug === params.slug);
    if (!art) throw notFound();
    return art;
  },
  head: ({ loaderData: art }) => ({
    meta: [
      { title: `${art?.title ?? "Science Guide"} | The Joshi’s Journal` },
      { name: "description", content: art?.excerpt ?? "Science study guidance." },
      { property: "og:title", content: art?.title ?? "The Joshi’s Journal" },
      { property: "og:description", content: art?.excerpt ?? "Science study guidance." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `https://joshisacademy.com/journal/${art?.slug ?? ""}` }],
    scripts: art
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: art.title,
              description: art.excerpt,
              author: {
                "@type": "EducationalOrganization",
                name: "Joshi’s Academy",
              },
              publisher: {
                "@type": "EducationalOrganization",
                name: "Joshi’s Academy",
                logo: {
                  "@type": "ImageObject",
                  url: "https://joshisacademy.com/brand/logo.png",
                },
              },
              datePublished: "2026-08-01",
            }),
          },
        ]
      : [],
  }),
  component: JournalArticlePage,
});

const openEnquiry = () => window.dispatchEvent(new Event("open-enquiry"));

function JournalArticlePage() {
  const art = Route.useLoaderData();
  const otherArticles = articles.filter((a) => a.slug !== art.slug).slice(0, 2);

  return (
    <article className="min-h-screen bg-background">
      {/* Article Header */}
      <header className="bg-ink px-6 pb-16 pt-32 text-ivory md:px-10 md:pb-24 md:pt-40 border-b border-border/15">
        <div className="mx-auto max-w-5xl">
          <Crumbs items={["Journal", art.title]} />

          <div className="flex items-center gap-4 text-xs text-lavender/80 mt-6">
            <span className="eyebrow text-lavender">{art.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {art.readingTime}
            </span>
            <span>•</span>
            <span>{art.date}</span>
          </div>

          <h1 className="mt-5 max-w-4xl font-display text-3xl sm:text-5xl md:text-6xl text-ivory leading-[1.08] tracking-tight">
            {art.title}
          </h1>

          <p className="mt-6 max-w-3xl text-base sm:text-lg leading-relaxed text-ivory/75">
            {art.excerpt}
          </p>
        </div>
      </header>

      {/* Article Body with Editorial Two-Column (TOC + Content) */}
      <div className="section-shell py-20 md:py-28">
        <div className="grid gap-16 lg:grid-cols-[280px_1fr] items-start max-w-5xl mx-auto">
          {/* Table of Contents & Metadata Sidebar */}
          <aside className="lg:sticky lg:top-32 space-y-8 border-b lg:border-b-0 lg:border-r border-border pb-8 lg:pb-0 lg:pr-8">
            <div>
              <p className="eyebrow text-violet mb-3">Contents</p>
              <ul className="space-y-2 text-xs font-semibold text-muted-foreground">
                {art.sections.map((sec, i) => (
                  <li key={sec.heading}>
                    <a
                      href={`#sec-${i}`}
                      className="hover:text-violet transition-colors block py-1"
                    >
                      0{i + 1}. {sec.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <p className="eyebrow text-royal">Audience</p>
              <p className="text-xs text-ink font-bold">{art.classLevel} Students & Parents</p>
            </div>

            <div className="border-t border-border pt-6">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Written by the academic faculty at Joshi’s Academy Kharadi.
              </p>
            </div>
          </aside>

          {/* Main Article Prose */}
          <div className="space-y-12">
            {/* Key Takeaways Callout Box */}
            <div className="border border-border bg-lavender/25 p-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet mb-3">
                <CheckCircle className="size-4" />
                Key Academic Takeaway
              </div>
              <p className="font-display text-xl sm:text-2xl text-ink leading-snug">
                “Strong Science board results come from a disciplined, weekly diagnostic process—not
                a desperate burst of memorisation before the exam.”
              </p>
            </div>

            {/* Article Sections */}
            {art.sections.map((sec, idx) => (
              <section key={sec.heading} id={`sec-${idx}`} className="space-y-4 pt-4">
                <span className="font-sans text-xs font-bold text-violet uppercase tracking-widest">
                  Part 0{idx + 1}
                </span>
                <h2 className="font-display text-3xl sm:text-4xl text-ink">{sec.heading}</h2>
                <div className="text-base sm:text-lg leading-relaxed text-muted-foreground space-y-4">
                  <p>{sec.content}</p>
                </div>
              </section>
            ))}

            {/* Subtle Scientific Formula Callout */}
            <aside className="border-l-2 border-violet bg-white p-6 border-y border-r border-border my-8">
              <p className="eyebrow text-royal mb-2">Scientific Method Note</p>
              <p className="font-display text-xl text-ink">
                Clarity first. Practice second. Speed follows naturally.
              </p>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                When you understand the fundamental principle, every exam question is simply a
                variation of a familiar truth.
              </p>
            </aside>

            {/* Related Courses Callout */}
            <div className="border border-border bg-white p-8 space-y-6">
              <div>
                <span className="eyebrow text-violet">Recommended Programme</span>
                <h3 className="font-display text-2xl text-ink mt-1">
                  Ready to master Science with personalised attention?
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                  Our small-batch CBSE and ICSE programmes in Kharadi ensure you build deep
                  conceptual clarity across Physics, Chemistry, and Biology.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="default" onClick={openEnquiry}>
                  Book Free Counselling <ArrowRight className="size-4 ml-1" />
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/courses">Explore All Courses</Link>
                </Button>
              </div>
            </div>

            {/* Back to Journal Link */}
            <div className="border-t border-border pt-8 flex items-center justify-between">
              <Link
                to="/journal"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink hover:text-violet transition-colors"
              >
                <ArrowLeft className="size-4" /> Back to The Joshi’s Journal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
