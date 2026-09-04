import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Sparkles, Check } from "lucide-react";
import { PageHero, seoMeta } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import approachImg from "@/assets/academy-approach.jpg";
import classroomImg from "@/assets/classroom-wide.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: seoMeta(
      "About Joshi’s Academy | Gyan Ki Varsha | Kharadi Pune",
      "The founding vision, academic philosophy, and small-batch Science coaching methodology of Joshi’s Academy in Kharadi, Pune for CBSE and ICSE Classes IX & X.",
    ),
    links: [{ rel: "canonical", href: "https://joshisacademy.com/about" }],
  }),
  component: AboutPage,
});

const openEnquiry = () => window.dispatchEvent(new Event("open-enquiry"));

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Institutional Heritage"
        title="An academy built around a simple belief: clarity changes everything."
        intro="Joshi’s Academy specialises in Science for CBSE and ICSE Classes IX–X, bringing personal attention and a disciplined learning structure to students in Kharadi, Pune."
      />

      {/* Narrative Editorial Section */}
      <section className="section-shell py-24 md:py-36">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-8">
            <span className="eyebrow text-violet">Our Story</span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink leading-tight">
              Gyan Ki Varsha: The Shower of Authentic Knowledge.
            </h2>

            <div className="space-y-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
              <p>
                Joshi’s Academy was founded with an uncompromising pedagogical conviction: secondary
                school science should not be reduced to rote memorisation of textbook questions.
                When students understand the fundamental principle—why an apple falls, why atoms
                share electrons, or how cellular respiration releases ATP—science transforms from an
                intimidating hurdle into an exhilarating intellectual journey.
              </p>
              <p>
                Based in the vibrant educational hub of Kharadi, Pune, we deliberately maintain
                small, intimate batches. This allows us to observe where a student hesitates,
                provide immediate remediation, and ensure that no student slips through the cracks
                of a crowded lecture hall.
              </p>
              <p>
                By specializing exclusively in Science for Classes IX and X across CBSE and ICSE
                curricula, our faculty focuses their complete intellectual energy on these pivotal
                transition years that define a student’s future career path.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Button variant="default" size="lg" onClick={openEnquiry}>
                Book a Counselling Session <ArrowRight className="size-4" />
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/courses">Explore Programmes</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="border border-border/80 bg-white p-2">
              <img
                src={approachImg}
                alt="Teacher explaining science concepts to attentive students"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden sm:block border border-border bg-ivory p-6 max-w-xs shadow-lg">
              <p className="eyebrow text-royal">Core Specialisation</p>
              <p className="font-display text-2xl text-ink mt-1">Physics. Chemistry. Biology.</p>
              <p className="text-xs text-muted-foreground mt-1">
                Dedicated exclusively to Classes IX & X
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Tenets of Joshi's Academy */}
      <section className="bg-lavender/30 py-24 md:py-36 border-y border-border">
        <div className="section-shell">
          <div className="max-w-3xl mb-16">
            <span className="eyebrow text-violet">Our Pedagogical Foundation</span>
            <h2 className="mt-4 font-display text-4xl sm:text-6xl text-ink">
              Four principles that define every lecture.
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: "01",
                title: "Concept-First Teaching",
                desc: "No formulas are introduced without deriving their physical intuition and practical necessity.",
              },
              {
                num: "02",
                title: "Small, Interactive Batches",
                desc: "Strictly limited seating so teachers know every student’s learning velocity and hurdles.",
              },
              {
                num: "03",
                title: "Continuous Diagnostic Testing",
                desc: "Weekly evaluations with step-by-step mark deductions explained, turning errors into growth.",
              },
              {
                num: "04",
                title: "Board Examination Composure",
                desc: "Extensive multi-year paper practice ensuring students enter the examination hall calm and prepared.",
              },
            ].map((tenet) => (
              <div key={tenet.num} className="border border-border bg-white p-8">
                <span className="font-sans text-xs font-bold text-violet">{tenet.num}</span>
                <h3 className="font-display text-2xl text-ink mt-3">{tenet.title}</h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {tenet.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Location Callout */}
      <section className="section-shell py-24 md:py-36">
        <div className="border border-border bg-white p-8 sm:p-16 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <span className="eyebrow text-royal">Kharadi Centre</span>
            <h2 className="font-display text-4xl sm:text-5xl text-ink mt-2">
              Serving the Kharadi & East Pune student community.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Conveniently situated in Kharadi, our centre offers a peaceful, disciplined academic
              sanctuary away from distractions. Parents and students are always welcome to schedule
              a campus walk-through and meet our academic mentors.
            </p>
            <div className="mt-8">
              <Button asChild>
                <Link to="/contact">
                  View Location & Directions <ArrowRight className="size-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden border border-border">
            <img
              src={classroomImg}
              alt="Classroom facilities at Joshi's Academy"
              loading="lazy"
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
