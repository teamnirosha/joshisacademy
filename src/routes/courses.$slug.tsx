import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronDown, BookOpen, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Crumbs } from "@/components/page-hero";
import { courses, articles } from "@/content/site";

export const Route = createFileRoute("/courses/$slug")({
  loader: ({ params }) => {
    const slug = params.slug.toLowerCase();
    // Find course by slug or aliases
    const course = courses.find((c) => c.slug === slug || c.aliases.includes(slug));
    if (!course) {
      throw notFound();
    }
    return course;
  },
  head: ({ loaderData: c }) => ({
    meta: [
      { title: `${c?.title ?? "Science Course"} Coaching in Kharadi | Joshi’s Academy` },
      {
        name: "description",
        content: c?.description ?? "Specialist CBSE & ICSE Science coaching.",
      },
      { property: "og:title", content: `${c?.title ?? "Course"} | Joshi’s Academy` },
      { property: "og:description", content: c?.description ?? "Science coaching." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `https://joshisacademy.com/courses/${c?.slug ?? ""}` }],
    scripts: c
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              name: c.title,
              description: c.description,
              provider: {
                "@type": "EducationalOrganization",
                name: "Joshi’s Academy",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Kharadi",
                  addressRegion: "Maharashtra",
                  addressCountry: "IN",
                },
              },
              educationalLevel: c.className,
            }),
          },
        ]
      : [],
  }),
  component: CourseDetailPage,
});

const openEnquiry = () => window.dispatchEvent(new Event("open-enquiry"));

function CourseDetailPage() {
  const c = Route.useLoaderData();
  const relatedJournalArticles = articles.filter((a) => c.relatedArticles.includes(a.slug));

  return (
    <>
      {/* Course Hero */}
      <section className="bg-ink px-6 pb-20 pt-36 text-ivory md:px-10 md:pt-44 border-b border-border/15">
        <div className="mx-auto max-w-[1500px]">
          <Crumbs items={["Courses", c.title]} />

          <p className="eyebrow text-lavender tracking-[0.24em] mt-8">
            {c.board} • {c.className} • SPECIALIST SCIENCE
          </p>

          <h1 className="mt-6 max-w-5xl font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-ivory leading-[0.94] tracking-tight">
            {c.title}
          </h1>

          <div className="mt-12 grid gap-8 border-t border-ivory/20 pt-8 md:grid-cols-[1.4fr_1fr] md:items-end">
            <p className="max-w-2xl text-base sm:text-xl leading-relaxed text-ivory/80">
              {c.tagline}. {c.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3.5 md:justify-end">
              <Button variant="hero" size="lg" onClick={openEnquiry}>
                Enquire for Admission <ArrowRight className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Course Content Grid */}
      <section className="section-shell py-24 md:py-36">
        <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">
          {/* Left Sticky Summary */}
          <div className="lg:sticky lg:top-32 lg:self-start space-y-8">
            <div>
              <p className="eyebrow text-violet">Course Overview</p>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl text-ink leading-tight">
                For students ready to understand Science deeply.
              </h2>
              <p className="mt-6 text-sm sm:text-base leading-relaxed text-muted-foreground">
                {c.overview}
              </p>
            </div>

            <div className="border-t border-border pt-6 space-y-4 text-xs">
              <div className="flex justify-between py-2 border-b border-border/60">
                <span className="text-muted-foreground uppercase tracking-wider font-bold">
                  Curriculum Board
                </span>
                <span className="font-extrabold text-ink">{c.board}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60">
                <span className="text-muted-foreground uppercase tracking-wider font-bold">
                  Grade Level
                </span>
                <span className="font-extrabold text-ink">{c.className}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60">
                <span className="text-muted-foreground uppercase tracking-wider font-bold">
                  Classroom Location
                </span>
                <span className="font-extrabold text-ink">Kharadi, Pune</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60">
                <span className="text-muted-foreground uppercase tracking-wider font-bold">
                  Batch Size
                </span>
                <span className="font-extrabold text-ink">Strictly Limited</span>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="default" className="w-full" onClick={openEnquiry}>
                Book a Free Counselling Session →
              </Button>
            </div>
          </div>

          {/* Right Detailed Sections */}
          <div className="space-y-16">
            {/* Target Student */}
            <div className="border-t border-border pt-8">
              <h3 className="font-display text-2xl sm:text-3xl text-ink">
                Who is this course for?
              </h3>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                {c.targetStudent}
              </p>
            </div>

            {/* Subject Breakdown: Physics, Chemistry, Biology */}
            <div className="border-t border-border pt-8">
              <h3 className="font-display text-2xl sm:text-3xl text-ink mb-8">
                Comprehensive 3-Discipline Curriculum
              </h3>

              <div className="space-y-6">
                {[c.subjects.physics, c.subjects.chemistry, c.subjects.biology].map((subj) => (
                  <div key={subj.title} className="border border-border bg-white p-6 sm:p-8">
                    <span className="eyebrow text-royal">{subj.title} Module</span>
                    <h4 className="font-display text-2xl text-ink mt-2">{subj.title} Syllabus</h4>
                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {subj.description}
                    </p>
                    <div className="mt-5 border-t border-border/70 pt-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink/75 mb-3">
                        Core Chapter Modules:
                      </p>
                      <ul className="grid gap-2 sm:grid-cols-2 text-xs text-muted-foreground">
                        {subj.topics.map((top) => (
                          <li key={top} className="flex items-start gap-2">
                            <Check className="size-3.5 text-violet shrink-0 mt-0.5" />
                            <span>{top}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Numerical Practice & Testing */}
            <div className="border-t border-border pt-8">
              <h3 className="font-display text-2xl sm:text-3xl text-ink">
                Numerical Practice & Testing Structure
              </h3>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                {c.numericalPractice}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {c.testingStructure.map((test) => (
                  <div
                    key={test}
                    className="border border-border bg-lavender/20 p-4 text-xs font-medium text-ink flex items-start gap-2.5"
                  >
                    <Check className="size-4 text-violet shrink-0 mt-0.5" />
                    <span>{test}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dedicated Doubt Solving */}
            <div className="border-t border-border pt-8">
              <h3 className="font-display text-2xl sm:text-3xl text-ink">
                Dedicated Doubt Solving
              </h3>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                {c.doubtSolving}
              </p>
            </div>

            {/* Board Preparation Timeline */}
            <div className="border-t border-border pt-8">
              <h3 className="font-display text-2xl sm:text-3xl text-ink mb-6">
                Academic Roadmap & Board Preparation Timeline
              </h3>
              <div className="divide-y divide-border border-y border-border">
                {c.boardTimeline.map((item, idx) => (
                  <div
                    key={item.phase}
                    className="py-5 grid sm:grid-cols-[160px_1fr] gap-4 items-baseline"
                  >
                    <span className="font-sans text-xs font-bold uppercase tracking-wider text-royal">
                      {item.phase}
                    </span>
                    <span className="text-sm leading-relaxed text-ink font-medium">
                      {item.milestone}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course FAQs */}
            {c.faqs.length > 0 && (
              <div className="border-t border-border pt-8">
                <h3 className="font-display text-2xl sm:text-3xl text-ink mb-6">
                  Frequently Asked Questions
                </h3>
                <div className="divide-y divide-border border-y border-border">
                  {c.faqs.map((faq) => (
                    <details key={faq.q} className="group py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between font-display text-xl text-ink">
                        <span>{faq.q}</span>
                        <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180 text-violet" />
                      </summary>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Related Journal Articles */}
            {relatedJournalArticles.length > 0 && (
              <div className="border-t border-border pt-8">
                <h3 className="font-display text-2xl sm:text-3xl text-ink mb-6">
                  Related Study Guides from The Joshi’s Journal
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedJournalArticles.map((art) => (
                    <Link
                      key={art.slug}
                      to="/journal/$slug"
                      params={{ slug: art.slug }}
                      className="group border border-border bg-white p-6 transition-colors hover:bg-lavender/30"
                    >
                      <span className="eyebrow text-royal">{art.category}</span>
                      <h4 className="font-display text-xl text-ink mt-2 group-hover:text-violet transition-colors">
                        {art.title}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {art.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Course Bottom CTA */}
      <section className="bg-ink py-20 text-ivory border-t border-border/15">
        <div className="section-shell flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <p className="eyebrow text-lavender">Admissions Desk</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-ivory">
              Enroll in {c.title}.
            </h2>
            <p className="mt-2 text-sm text-ivory/60">
              Limited seats per batch to preserve individual academic attention.
            </p>
          </div>
          <Button variant="hero" size="lg" onClick={openEnquiry}>
            Apply for Admission <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>
    </>
  );
}
