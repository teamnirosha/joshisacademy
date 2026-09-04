import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ShieldCheck, TrendingUp } from "lucide-react";
import { PageHero, seoMeta } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { results } from "@/content/site";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: seoMeta(
      "Academic Results & Board Performance | Joshi’s Academy Kharadi",
      "Verified board examination outcomes for CBSE Class 10 Science at Joshi’s Academy in Kharadi, Pune. 50% of the 2024–25 batch scored 90%+.",
    ),
    links: [{ rel: "canonical", href: "https://joshisacademy.com/results" }],
  }),
  component: ResultsPage,
});

const openEnquiry = () => window.dispatchEvent(new Event("open-enquiry"));

function ResultsPage() {
  return (
    <>
      <PageHero
        eyebrow="Academic Outcomes"
        title="Results are a reflection of understanding."
        intro="We publish only the verified statistical outcomes supplied and approved by the academy. No marks, names, or rankings are exaggerated."
      />

      <section className="section-shell py-24 md:py-36">
        {/* Core Statistical Pillars */}
        <div className="grid gap-8 md:grid-cols-3">
          {results.stats.map((st) => (
            <div
              key={st.label}
              className="border-t-2 border-violet pt-8 bg-white p-8 border-x border-b border-border"
            >
              <span className="eyebrow text-royal">Verified Milestone</span>
              <p className="mt-4 font-display text-6xl sm:text-7xl lg:text-8xl text-ink font-normal tracking-tight">
                {st.value}
              </p>
              <h2 className="mt-3 font-display text-2xl text-ink">{st.label}</h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{st.detail}</p>
            </div>
          ))}
        </div>

        {/* Academic Integrity & Methodology */}
        <div className="mt-20 grid gap-14 lg:grid-cols-[1.1fr_0.9fr] border-t border-border pt-16 items-start">
          <div>
            <span className="eyebrow text-violet">Our Pedagogy of Excellence</span>
            <h2 className="mt-4 font-display text-3xl sm:text-5xl text-ink leading-tight">
              Why our students consistently perform in Board Exams.
            </h2>
            <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
              <p>
                At Joshi’s Academy, board distinction is treated as the natural consequence of
                disciplined conceptual study, not frantic last-minute revision. We start by
                deconstructing student misconceptions in Physics, balancing chemical equations
                systematically, and teaching precise biological nomenclature.
              </p>
              <p>
                Every student maintains an error log from weekly tests. We don’t just count marks;
                we diagnose why a mark was missed—whether due to mathematical calculation, unit
                omission, or inadequate answer framing according to CBSE/ICSE rubrics.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              {[
                "Step-wise marks optimization aligned with board marking rubrics",
                "Dedicated numerical speed sessions for Physics mechanics and circuits",
                "Structured diagram drafting sessions meeting council precision",
                "Spaced retrieval revision cycles preventing pre-board burnout",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3 text-xs sm:text-sm text-ink">
                  <CheckCircle2 className="size-4 text-violet shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-border bg-lavender/30 p-8 sm:p-12 space-y-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-6 text-violet" />
              <h3 className="font-display text-2xl text-ink">Verification Standard</h3>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Individual student roll numbers, detailed marks, and student photographs are kept
              confidential unless explicit parental consent is granted. We believe respectful,
              truthful institutional communication is the foundation of academic trust.
            </p>
            <div className="border-t border-border pt-6">
              <Button variant="default" className="w-full" onClick={openEnquiry}>
                Discuss Your Child’s Target Score <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
