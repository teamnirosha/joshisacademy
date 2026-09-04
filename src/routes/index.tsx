import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronDown,
  Quote,
  MapPin,
  Check,
  Compass,
  BookOpen,
  Atom,
  FlaskConical,
  Dna,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/classroom-hero.jpg";
import approachImage from "@/assets/academy-approach.jpg";
import classroomImage from "@/assets/classroom-wide.jpg";
import { LocalSeoAreas } from "@/components/sections/LocalSeoAreas";
import {
  approach,
  articles,
  courses,
  faqs,
  scienceDisciplines,
  methodology,
  results,
  testimonials,
  galleryItems,
  site,
} from "@/content/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Top Science Coaching Classes in Kharadi, Pune | CBSE & ICSE 9th & 10th | Joshi’s Academy" },
      {
        name: "description",
        content:
          "Best Science coaching classes in Kharadi, Pune for CBSE & ICSE Classes 9 & 10. Serving Chandan Nagar, Wagholi, Viman Nagar, Mundhwa. Small batches, concept-first Physics, Chemistry & Biology.",
      },
      { name: "keywords", content: "coaching classes in Kharadi, science tuition Kharadi, best coaching institute in Kharadi Pune, 10th CBSE science tuition Kharadi, ICSE science coaching Kharadi, tuition classes near Chandan Nagar, science tuition Wagholi, coaching classes Viman Nagar" },
      { property: "og:title", content: "Joshi’s Academy — Top Science Coaching Classes in Kharadi, Pune" },
      {
        property: "og:description",
        content: "Concept-first CBSE & ICSE Science Coaching for Classes 9 & 10 in Kharadi, Pune. Verified 90%+ board results.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://joshisacademy.com/brand/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://joshisacademy.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["EducationalOrganization", "LocalBusiness"],
          name: "Joshi’s Academy",
          slogan: "Gyan Ki Varsha",
          description:
            "Specialist CBSE and ICSE Science coaching for Classes IX and X in Kharadi, Pune.",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Kharadi",
            addressLocality: "Kharadi, Pune",
            addressRegion: "Maharashtra",
            postalCode: "411014",
            addressCountry: "IN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 18.5515,
            longitude: 73.9468,
          },
          areaServed: site.nearbyLocations,
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Secondary Science Coaching",
            itemListElement: courses.map((c) => ({
              "@type": "Course",
              name: c.title,
              description: c.description,
              provider: {
                "@type": "EducationalOrganization",
                name: "Joshi’s Academy",
              },
            })),
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.a,
            },
          })),
        }),
      },
    ],
  }),
  component: HomePage,
});

const openEnquiry = () => window.dispatchEvent(new Event("open-enquiry"));

function HomePage() {
  const [activeApproach, setActiveApproach] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeMethodStep, setActiveMethodStep] = useState(0);

  // Auto-advance testimonials gently
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const currentTestimonial = testimonials[activeTestimonial] ?? testimonials[0]!;

  return (
    <>
      {/* 01 — HERO (Editorial Asymmetrical Hero) */}
      <section className="relative min-h-[96svh] overflow-hidden bg-ink text-ivory flex flex-col justify-end">
        {/* Background authentic classroom photo with refined editorial darkening */}
        <div className="absolute inset-0 size-full">
          <img
            src={heroImage}
            width={1600}
            height={1200}
            fetchPriority="high"
            className="image-reveal size-full object-cover object-center opacity-65 md:opacity-70"
            alt="Focused science teacher leading a small-batch demonstration at Joshi's Academy in Kharadi"
          />
          {/* Subtle directional gradient so text remains razor-sharp */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/65 to-transparent md:bg-[linear-gradient(90deg,var(--ink)_0%,rgba(17,17,17,0.85)_48%,rgba(17,17,17,0.3)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex min-h-[96svh] flex-col justify-end pb-16 pt-28 md:pb-20">
          <div className="w-full max-w-3xl mt-[3rem]">
            <p className="eyebrow reveal text-lavender tracking-[0.22em] text-[11px]">
              CBSE • ICSE • SCIENCE • IX–X
            </p>

            <h1
              className="reveal mt-5 font-display text-[clamp(2.25rem,7vw,6.5rem)] leading-[0.95] text-ivory tracking-tight"
              style={{ animationDelay: "100ms" }}
            >
              Science,
              <br />
              <em className="font-normal italic text-lavender">Understood.</em>
            </h1>

            <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,580px)_1fr] md:items-end">
              <div className="reveal" style={{ animationDelay: "220ms" }}>
                <p className="max-w-[560px] text-[17px] leading-[1.65] text-ivory/75">
                  Concept-focused Science coaching for CBSE and ICSE Classes IX–X, taught through
                  small batches, structured practice and individual attention in Kharadi, Pune.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    variant="hero"
                    size="default"
                    onClick={openEnquiry}
                    className="h-[50px] px-6 text-[13px] tracking-[0.1em]"
                  >
                    Book a Free Counselling Session <ArrowRight className="size-3.5" />
                  </Button>
                  <Button
                    variant="heroOutline"
                    size="default"
                    asChild
                    className="h-[50px] px-6 text-[13px] tracking-[0.1em]"
                  >
                    <Link to="/courses">Explore Courses</Link>
                  </Button>
                </div>
              </div>

              {/* Institutional Metadata Badges */}
              <div className="hidden justify-end gap-10 text-right md:flex border-l border-ivory/20 pl-8">
                <div>
                  <p className="eyebrow text-ivory/45 text-[10px]">Location</p>
                  <p className="mt-1.5 text-[11px] font-extrabold tracking-wider uppercase text-ivory">
                    KHARADI • PUNE
                  </p>
                </div>
                <div>
                  <p className="eyebrow text-ivory/45 text-[10px]">Curriculum</p>
                  <p className="mt-1.5 text-[11px] font-extrabold tracking-wider uppercase text-ivory">
                    CBSE • ICSE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — TRUST STRIP (Editorial Statistics) */}
      <section
        className="border-b border-border bg-ivory text-ink"
        aria-label="Credibility Statistics"
      >
        <div className="section-shell grid grid-cols-2 md:grid-cols-4">
          {[
            { num: "100+", label: "Students Passed Out", sub: "Verified alumni milestone" },
            { num: "25+", label: "Scored 90%+", sub: "In CBSE Board Examination" },
            { num: "CBSE + ICSE", label: "Science Focus", sub: "Classes IX & X specialised" },
            {
              num: "Small Batches",
              label: "Personalised Attention",
              sub: "Individual doubt clearance",
            },
          ].map((item, idx) => (
            <div
              key={item.label}
              className={`py-7 md:py-9 ${idx % 2 === 0 ? "border-r border-border pr-5 md:pr-8" : "pl-5 md:pl-8"
                } ${idx < 2 ? "border-b md:border-b-0 border-border" : ""} ${idx === 1 ? "md:border-r border-border" : ""
                } ${idx === 2 ? "md:border-r border-border" : ""}`}
            >
              <p className="font-display text-2xl sm:text-3xl lg:text-[2.6rem] text-ink font-normal tracking-tight">
                {item.num}
              </p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-ink/85">
                {item.label}
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-violet">THE JOSHI'S APPROACH</p>
            <h2 className="mt-4 font-display text-3xl sm:text-[2.6rem] md:text-[3.25rem] leading-[1.05] text-ink">
              Science becomes easier when concepts become clear.
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
              <p>
                Joshi’s Academy focuses on conceptual clarity, personalised attention, structured
                preparation and consistent assessment for CBSE and ICSE Science students.
              </p>
              <p>
                We slow down where understanding needs time, connect ideas across chapters, and use
                regular practice to turn clarity into confidence. The aim is not simply to complete
                the syllabus—it is to help every student think scientifically.
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-border flex items-center gap-6">
              <div>
                <span className="font-display text-2xl text-ink">1 : 1</span>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                  Doubt Attention
                </p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <span className="font-display text-2xl text-ink">Weekly</span>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                  Tested Progress
                </p>
              </div>
            </div>
          </div>

          <figure className="relative">
            <div className="overflow-hidden border border-border/70 bg-muted">
              <img
                src={approachImage}
                width={1200}
                height={1504}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                alt="Science educator explaining conceptual physics problems to students"
              />
            </div>
            <figcaption className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground flex justify-between">
              <span>Focused teaching. Thoughtful questions. Real understanding.</span>
              <span className="font-semibold text-ink">Kharadi Classroom</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-ink py-20 text-ivory md:py-28 border-y border-border/15">
        <div className="section-shell">
          <p className="eyebrow text-lavender">Why Joshi’s Academy</p>
          <div className="mt-6 grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="mb-10 max-w-3xl font-display text-3xl sm:text-[2.6rem] md:text-[3.25rem] text-ivory leading-tight">
                A different approach to Science education.
              </h2>

              <div className="divide-y divide-ivory/15 border-y border-ivory/15" role="tablist">
                {approach.map((item, idx) => (
                  <button
                    key={item.title}
                    type="button"
                    className="group w-full py-6 text-left transition-colors cursor-pointer"
                    onMouseEnter={() => setActiveApproach(idx)}
                    onFocus={() => setActiveApproach(idx)}
                    onClick={() => setActiveApproach(idx)}
                    aria-selected={activeApproach === idx}
                    role="tab"
                  >
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-5">
                        <span className="font-sans text-[11px] font-bold text-violet tracking-wider">
                          {item.num}
                        </span>
                        <h3
                          className={`font-display text-xl transition-colors sm:text-2xl ${activeApproach === idx ? "text-ivory font-normal" : "text-ivory/45"
                            }`}
                        >
                          {item.title}
                        </h3>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-lavender/50 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                        View
                      </span>
                    </div>

                    <div
                      className={`grid transition-all duration-300 ${activeApproach === idx
                        ? "grid-rows-[1fr] opacity-100 mt-4"
                        : "grid-rows-[0fr] opacity-0"
                        }`}
                    >
                      <p className="overflow-hidden pl-9 text-[14px] leading-relaxed text-ivory/70 max-w-xl">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative hidden min-h-[600px] lg:block">
              <div className="sticky top-32 overflow-hidden border border-ivory/20 bg-ink">
                <img
                  src={
                    activeApproach % 3 === 0
                      ? approachImage
                      : activeApproach % 3 === 1
                        ? classroomImage
                        : heroImage
                  }
                  width={1200}
                  height={1500}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover transition-all duration-500"
                  alt="Authentic learning environment at Joshi’s Academy"
                />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border border-ivory/25 bg-ink/80 px-4 py-3 backdrop-blur-sm text-[11px]">
                  <span className="font-sans tracking-wider uppercase text-lavender">
                    {(approach[activeApproach] ?? approach[0]!).title}
                  </span>
                  <span className="font-bold text-ivory">0{activeApproach + 1} / 06</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-20 md:py-28">
        <div>
          <p className="eyebrow text-violet">The Sciences</p>
          <h2 className="mt-4 font-display text-3xl sm:text-[2.6rem] text-ink tracking-tight">
            Physics. Chemistry. Biology.
          </h2>
          <p className="mt-4 text-[16px] text-muted-foreground max-w-xl">
            Three disciplines. One foundation: understanding.
          </p>
        </div>

        <div className="mt-16 divide-y divide-border border-y border-border">
          {scienceDisciplines.map((disc, idx) => {
            const Icon = idx === 0 ? Atom : idx === 1 ? FlaskConical : Dna;
            return (
              <div
                key={disc.name}
                className="group py-10 transition-colors hover:bg-lavender/30 sm:px-6"
              >
                <div className="grid gap-8 lg:grid-cols-[80px_1fr_1.4fr_140px] lg:items-center">
                  <div className="flex items-center gap-3">
                    <Icon className="size-5 text-violet stroke-[1.5]" />
                    <span className="font-sans text-[11px] font-bold text-violet">0{idx + 1}</span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl text-ink transition-transform duration-300 group-hover:translate-x-2">
                      {disc.name}
                    </h3>
                    <p className="mt-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      {disc.subtitle}
                    </p>
                  </div>

                  <div>
                    <p className="text-[14px] leading-relaxed text-muted-foreground">
                      {disc.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {disc.topics.map((t) => (
                        <span
                          key={t}
                          className="rounded bg-white border border-border px-2 py-1 text-[10px] font-medium text-ink/80"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-left lg:text-right border-t border-border/50 pt-4 lg:border-t-0 lg:pt-0">
                    <span className="block font-mono text-[13px] font-semibold text-royal">
                      {disc.annotation}
                    </span>
                    <span className="mt-1 block text-[10px] font-mono text-muted-foreground">
                      {disc.secondaryAnnotation}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-violet text-ivory py-20 md:py-28 relative overflow-hidden">
        <div className="section-shell relative z-10">
          <div className="max-w-4xl">
            <div className="h-[3px] w-12 bg-royal mb-8" />

            <blockquote className="font-display text-3xl sm:text-4xl md:text-[3.5rem] leading-[1.0] tracking-tight text-ivory">
              We don't teach students
              <br />
              <em className="font-normal italic text-lavender/90">what to remember.</em>
              <br />
              <br />
              We teach them
              <br />
              <em className="font-normal italic text-white">how to understand.</em>
            </blockquote>

            <div className="mt-12 border-t border-white/20 pt-8 grid gap-8 md:grid-cols-2 md:items-end">
              <p className="text-[16px] leading-[1.7] text-ivory/80 max-w-[520px]">
                Understanding changes the way students approach unfamiliar questions. It gives them
                the confidence to reason, apply and explain—skills that matter well beyond one
                examination.
              </p>
              <div className="md:text-right">
                <Button variant="hero" size="default" onClick={openEnquiry}>
                  Explore Our Pedagogy →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-20 md:py-28 border-b border-border overflow-hidden">
        <div className="section-shell">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-violet">TEACHING METHOD</p>
              <h2 className="mt-4 font-display text-3xl sm:text-[2.6rem] text-ink">
                A connected journey to confidence.
              </h2>
            </div>
            <p className="text-[14px] text-muted-foreground max-w-md">
              A systematic 6-phase progression converting foundational clarity into repeatable board
              examination composure.
            </p>
          </div>

          <div className="mt-16">
            <div className="hidden lg:grid grid-cols-6 gap-6 relative">
              <div className="absolute top-3 left-0 right-0 h-0.5 bg-border -z-0" />

              {methodology.map((m, idx) => (
                <div
                  key={m.name}
                  className="relative group pt-8 cursor-pointer"
                  onMouseEnter={() => setActiveMethodStep(idx)}
                >
                  <span
                    className={`absolute top-1.5 left-0 size-3 rounded-full border-2 transition-all ${activeMethodStep === idx
                      ? "border-violet bg-violet scale-125"
                      : "border-royal bg-ivory"
                      }`}
                  />
                  <span className="text-[11px] font-bold text-violet">0{idx + 1}</span>
                  <h3 className="mt-4 font-display text-xl text-ink">{m.name}</h3>
                  <p className="mt-1 text-[10px] font-bold text-royal uppercase tracking-wider">
                    {m.headline}
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                    {m.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="lg:hidden space-y-8 pl-6 border-l-2 border-border relative">
              {methodology.map((m, idx) => (
                <div key={m.name} className="relative">
                  <span className="absolute -left-[31px] top-1.5 size-3 rounded-full border-2 border-violet bg-ivory" />
                  <span className="text-[11px] font-bold text-violet">0{idx + 1}</span>
                  <h3 className="mt-1 font-display text-xl text-ink">{m.name}</h3>
                  <p className="text-[10px] font-bold text-royal uppercase tracking-wider">
                    {m.headline}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                    {m.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-ivory md:py-28 border-b border-border/15">
        <div className="section-shell">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="eyebrow text-lavender">Verified Outcomes</p>
              <h2 className="mt-5 font-display text-3xl sm:text-[2.6rem] text-ivory leading-tight">
                {results.headline}
              </h2>
              <p className="mt-6 text-[15px] text-ivory/70 max-w-md">{results.subheadline}</p>

              <div className="mt-10">
                <Button variant="heroOutline" asChild>
                  <Link to="/results">
                    Examine Results Methodology <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="divide-y divide-ivory/15 border-y border-ivory/15">
              {results.stats.map((st) => (
                <div
                  key={st.label}
                  className="py-7 sm:py-9 grid sm:grid-cols-[120px_1fr] gap-6 items-baseline"
                >
                  <span className="font-display text-[2.5rem] sm:text-[3rem] text-lavender font-normal tracking-tight">
                    {st.value}
                  </span>
                  <div>
                    <h3 className="font-display text-lg sm:text-xl text-ivory">{st.label}</h3>
                    <p className="mt-2 text-[13px] text-ivory/60 leading-relaxed">{st.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-12 text-[10px] text-ivory/45 border-t border-ivory/10 pt-6">
            {results.note}
          </p>
        </div>
      </section>

      <section className="section-shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.35fr_1fr] items-start">
          <div>
            <Quote className="size-8 text-violet stroke-[1.5]" />
            <p className="eyebrow text-violet mt-5">Student Stories</p>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Authentic student experiences from board examination batches at Joshi’s Academy.
            </p>
          </div>

          <div>
            <blockquote className="font-display text-2xl sm:text-3xl md:text-[2.6rem] text-ink leading-[1.2]">
              “{currentTestimonial.quote}”
            </blockquote>

            <div className="mt-10 flex flex-wrap items-baseline justify-between gap-4 border-t border-border pt-6">
              <div>
                <p className="font-sans text-[15px] font-extrabold text-ink">
                  {currentTestimonial.author}
                </p>
                <p className="text-[10px] font-semibold text-royal uppercase tracking-wider mt-0.5">
                  {currentTestimonial.context}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveTestimonial(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    className={`h-1 transition-all cursor-pointer ${activeTestimonial === idx
                      ? "w-10 bg-violet"
                      : "w-4 bg-border hover:bg-royal/50"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-lavender/30 py-20 md:py-28 border-y border-border">
        <div className="section-shell">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="eyebrow text-violet">FACULTY STANDARDS</p>
              <h2 className="mt-4 font-display text-3xl sm:text-[2.6rem] text-ink leading-tight">
                The people behind the teaching.
              </h2>
              <p className="mt-5 text-[16px] leading-[1.7] text-muted-foreground max-w-sm">
                Good teaching is personal. Every educator at Joshi’s Academy holds verified academic
                subject credentials, proven pedagogical patience, and complete dedication to student
                understanding.
              </p>
              <div className="mt-8">
                <Button variant="outline" asChild>
                  <Link to="/faculty">Read Faculty Principles →</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: "Subject Specialisation",
                  desc: "Physics, Chemistry, and Biology are guided with dedicated subject precision.",
                },
                {
                  title: "Pedagogical Patience",
                  desc: "No student is rushed through formulas. Questions are explored until fully clear.",
                },
                {
                  title: "Marking Rubric Insight",
                  desc: "Instruction directly reflects current CBSE and ICSE board marking criteria.",
                },
                {
                  title: "Individual Mentorship",
                  desc: "Regular feedback loops with parents on student conceptual growth and test analytics.",
                },
              ].map((pill) => (
                <div key={pill.title} className="bg-white border border-border p-6">
                  <h3 className="font-display text-xl text-ink">{pill.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {pill.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-20 md:py-28">
        <div>
          <p className="eyebrow text-violet">ACADEMIC PROGRAMMES</p>
          <h2 className="mt-4 font-display text-3xl sm:text-[2.6rem] text-ink">
            Choose the right Science programme.
          </h2>
          <p className="mt-3 text-[16px] text-muted-foreground max-w-lg">
            Four specialized courses engineered for CBSE and ICSE secondary science curricula.
          </p>
        </div>

        <div className="mt-16 divide-y divide-border border-y border-border">
          {courses.map((course, idx) => (
            <Link
              key={course.id}
              to="/courses/$slug"
              params={{ slug: course.slug }}
              className="group grid gap-6 py-10 transition-colors hover:bg-lavender/30 sm:px-6 md:grid-cols-[70px_1.1fr_1.3fr_160px] md:items-center"
            >
              <span className="font-sans text-[11px] font-bold text-violet">0{idx + 1}</span>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-royal">
                  {course.board} • {course.className}
                </span>
                <h3 className="font-display text-2xl text-ink transition-transform duration-300 group-hover:translate-x-2 mt-1">
                  {course.title}
                </h3>
              </div>

              <div>
                <p className="text-[14px] leading-relaxed text-muted-foreground max-w-lg">
                  {course.description}
                </p>
                <p className="mt-2 text-[11px] font-semibold text-ink/75">
                  Physics • Chemistry • Biology
                </p>
              </div>

              <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-violet group-hover:text-royal transition-colors">
                <span>Explore Course</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-2" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative min-h-[75svh] overflow-hidden bg-ink">
        <img
          src={classroomImage}
          width={1600}
          height={1008}
          loading="lazy"
          className="absolute inset-0 size-full object-cover opacity-60 transition-transform duration-1000 hover:scale-[1.02]"
          alt="Focused students engaged in conceptual science learning at Joshi's Academy in Kharadi"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="section-shell relative z-10 flex min-h-[75svh] flex-col justify-end pb-16 text-ivory">
          <p className="eyebrow text-lavender tracking-[0.22em] text-[11px]">
            Classroom Atmosphere
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl sm:text-[2.8rem] text-ivory leading-[1.1]">
            Small batches.
            <br />
            Focused attention.
            <br />
            <em className="font-normal italic text-lavender">Better learning.</em>
          </h2>
        </div>
      </section>

      <section className="section-shell py-20 md:py-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="eyebrow text-violet">EDITORIAL GALLERY</p>
            <h2 className="mt-3 font-display text-3xl sm:text-[2.8rem] text-ink">
              Observing learning up close.
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/gallery">View Full Masonry Gallery →</Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.slice(0, 3).map((item) => (
            <div key={item.id} className="group overflow-hidden border border-border bg-white">
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={
                    item.id === "1" ? heroImage : item.id === "2" ? approachImage : classroomImage
                  }
                  alt={item.title}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-royal">
                  {item.category}
                </span>
                <h3 className="font-display text-xl text-ink mt-1 group-hover:text-violet transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-lavender/30 py-20 md:py-28 border-y border-border">
        <div className="section-shell">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="eyebrow text-violet">ACADEMIC JOURNAL</p>
              <h2 className="mt-3 font-display text-3xl sm:text-[2.8rem] text-ink">
                Thinking clearly about Science.
              </h2>
            </div>
            <Button variant="outline" asChild>
              <Link to="/journal">All Journal Articles →</Link>
            </Button>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-2">
            {articles.slice(0, 4).map((art, idx) => (
              <Link
                key={art.slug}
                to="/journal/$slug"
                params={{ slug: art.slug }}
                className="group bg-white p-8 md:p-12 transition-colors hover:bg-ivory flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="eyebrow text-royal">{art.category}</span>
                    <span>0{idx + 1}</span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl sm:text-3xl text-ink group-hover:text-violet transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="mt-4 text-[13px] sm:text-[14px] leading-relaxed text-muted-foreground">
                    {art.excerpt}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-ink group-hover:text-violet transition-colors">
                  <span>Read Guide</span>
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-violet">Kharadi • Pune</p>
            <h2 className="mt-4 font-display text-3xl sm:text-[2.8rem] text-ink">
              Come learn with us.
            </h2>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="size-5 text-violet shrink-0 mt-1" />
                <div>
                  <strong className="block text-[15px] font-bold text-ink">Joshi’s Academy</strong>
                  <span className="text-[13px] text-muted-foreground">
                    Kharadi, Pune, Maharashtra, India
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-6 text-[14px] leading-relaxed text-muted-foreground max-w-md">
              Specialist CBSE and ICSE Science coaching serving students across Kharadi, Wadgaon
              Sheri, Viman Nagar, and East Pune.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild>
                <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
                  Get Directions <Compass className="size-4 ml-1" />
                </a>
              </Button>
              <Button variant="outline" onClick={openEnquiry}>
                Book a Visit
              </Button>
            </div>
          </div>

          <div className="flex flex-col justify-between border border-border bg-white p-8 md:p-12">
            <div>
              <span className="eyebrow text-royal">Admissions Conversation</span>
              <h3 className="mt-4 font-display text-2xl sm:text-3xl text-ink">
                Schedule your student counselling session.
              </h3>
              <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
                We assess the student’s current conceptual standing, clarify curriculum differences
                between CBSE and ICSE, and recommend an aligned academic study plan.
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-border">
              <Button variant="default" size="lg" className="w-full" onClick={openEnquiry}>
                Request a Counselling Call <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Local SEO Footprint: Serving Kharadi & Nearby Areas ──────── */}
      <LocalSeoAreas />

      <section className="bg-ink text-ivory py-20 md:py-28 border-t border-border/15">
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="eyebrow text-lavender">Your Next Step</p>
            <h2 className="mt-5 font-display text-3xl sm:text-[2.8rem] md:text-[3.75rem] text-ivory leading-tight">
              Your child's next academic step starts with{" "}
              <em className="font-normal italic text-lavender">understanding.</em>
            </h2>
            <p className="mt-6 text-[16px] sm:text-lg text-ivory/70 max-w-2xl">
              Talk to Joshi’s Academy about the right Science programme for Class IX or X.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
              <Button variant="hero" size="lg" onClick={openEnquiry}>
                Book a Free Counselling Session <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="heroOutline"
                size="lg"
                onClick={() => {
                  if (site.whatsapp) {
                    window.open(`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`, "_blank");
                  } else {
                    openEnquiry();
                  }
                }}
              >
                WhatsApp Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
