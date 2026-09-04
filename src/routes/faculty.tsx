import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, GraduationCap, ShieldAlert, Award, BookCheck } from "lucide-react";
import { PageHero, seoMeta } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { facultyStandards } from "@/content/site";

export const Route = createFileRoute("/faculty")({
  head: () => ({
    meta: [
      ...seoMeta(
        "Expert Science Faculty & Educators in Kharadi, Pune | Joshi’s Academy",
        "Meet the specialist Physics, Chemistry & Biology faculty at Joshi’s Academy in Kharadi, Pune. Expert teaching for CBSE & ICSE 9th & 10th grade students.",
      ),
      { name: "keywords", content: "best science teachers in Kharadi, physics tutor Kharadi, chemistry tuition teacher Kharadi, biology coaching teacher Pune, coaching faculty Kharadi" },
    ],
    links: [{ rel: "canonical", href: "https://joshisacademy.com/faculty" }],
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
              name: "Faculty Standards",
              item: "https://joshisacademy.com/faculty",
            },
          ],
        }),
      },
    ],
  }),
  component: FacultyPage,
});

const openEnquiry = () => window.dispatchEvent(new Event("open-enquiry"));

function FacultyPage() {
  return (
    <>
      <PageHero
        eyebrow="Pedagogical Standard"
        title={facultyStandards.headline}
        intro="Good teaching is personal. Faculty profiles and educator credentials are published strictly after formal verification by the academy."
      />

      <section className="section-shell py-24 md:py-36">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] items-start">
          <div>
            <span className="eyebrow text-violet">Teaching Philosophy</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl text-ink leading-tight">
              Clarity. Patience. Serious attention.
            </h2>
            <p className="mt-6 text-sm sm:text-base leading-relaxed text-muted-foreground">
              {facultyStandards.intro}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Every educator at Joshi’s Academy is required to satisfy our four core teaching
              pillars: proven conceptual depth, mastery over board curriculum changes, empathetic
              communication, and disciplined student accountability.
            </p>

            <div className="mt-10 border-t border-border pt-8">
              <Button variant="default" onClick={openEnquiry}>
                Book a Session with Faculty <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {facultyStandards.pillars.map((pillar, i) => (
              <div key={pillar.title} className="border border-border bg-white p-8">
                <span className="eyebrow text-royal">Standard 0{i + 1}</span>
                <h3 className="font-display text-2xl text-ink mt-2">{pillar.title}</h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Policy Banner */}
        <div className="mt-20 border border-border bg-lavender/30 p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="size-5 text-violet" />
                <span className="eyebrow text-violet">Institutional Transparency</span>
              </div>
              <h3 className="font-display text-2xl text-ink">Verified Faculty Disclosure Policy</h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                We never publish invented credentials, stock photos, or unverified degrees. Formal
                academic cvs and educator portfolios are available upon request for enrolled
                families at our Kharadi academic centre.
              </p>
            </div>
            <Button variant="outline" onClick={openEnquiry} className="shrink-0">
              Request Faculty Profile
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
