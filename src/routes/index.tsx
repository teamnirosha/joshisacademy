import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  GraduationCap,
  Users,
  Award,
  BookOpen,
  MessageSquare,
  Star,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import varshaImage from "@/assets/varsha-joshi.jpg";
import heroImage from "@/assets/classroom-hero.jpg";
import approachImage from "@/assets/academy-approach.jpg";
import classroomImage from "@/assets/classroom-wide.jpg";
import { LocalSeoAreas } from "@/components/sections/LocalSeoAreas";
import {
  courses,
  faqs,
  site,
} from "@/content/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Varsha Joshi Science Coaching Kharadi | CBSE & ICSE 9th & 10th | Joshi’s Academy" },
      {
        name: "description",
        content:
          "Experienced educator Varsha Joshi provides concept-first CBSE & ICSE Science coaching for Classes 9 & 10 in Kharadi, Pune. Small batches, individual attention, and verified 90%+ board results.",
      },
      { name: "keywords", content: "Varsha Joshi teacher Kharadi, Varsha Joshi science coaching, coaching classes in Kharadi, science tuition Kharadi, 10th CBSE science tuition Kharadi, ICSE science coaching Kharadi" },
      { property: "og:title", content: "Varsha Joshi — Experienced Science Educator & Mentor in Kharadi, Pune" },
      {
        property: "og:description",
        content: "An Experienced Educator. A Mentor Who Cares. Concept-focused CBSE & ICSE Science Coaching for Classes 9 & 10.",
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
            "Specialist CBSE and ICSE Science coaching by Varsha Joshi for Classes IX and X in Kharadi, Pune.",
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
  return (
    <>
      {/* 01 — HERO SECTION: Full-bleed Varsha background, left panel semi-transparent overlay */}
      <section className="relative bg-ink text-ivory overflow-hidden min-h-screen lg:min-h-screen">
        {/* Full-bleed Varsha image covering the entire section */}
        <div className="absolute inset-0 size-full">
          <img
            src={varshaImage}
            alt="Varsha Joshi — Principal Science Educator & Mentor at Joshi's Academy"
            width={1600}
            height={1000}
            fetchPriority="high"
            className="size-full object-cover object-[50%_6%] sm:object-[50%_8%] lg:object-[85%_12%] xl:object-[88%_15%] image-reveal"
          />
          {/* On mobile: subtle top tint for header, clear un-darkened view of centered teacher face in upper 30-35%, smooth dark gradient downwards for 100% text clarity */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-transparent via-18% via-ink/65 via-34% to-ink to-85% lg:hidden" />
          {/* On desktop: left-to-right gradient — solid dark left column, fades smoothly right to reveal teacher portrait */}
          <div className="absolute inset-0 hidden lg:block bg-[linear-gradient(98deg,rgba(17,17,17,0.92)_0%,rgba(17,17,17,0.84)_44%,rgba(17,17,17,0.30)_68%,rgba(17,17,17,0.02)_100%)]" />
        </div>

        {/* Content grid — single flex container over the image */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:min-h-screen">

          {/* LEFT PANEL — transparent bg, content overlays the image */}
          <div className="relative flex flex-col justify-center w-full lg:w-[54%] xl:w-[50%] px-5 sm:px-8 lg:px-12 xl:px-16 pt-[32vh] sm:pt-[34vh] lg:pt-[calc(72px+3rem)] pb-14 lg:pb-24">
            {/* Extra spacer on desktop for aesthetic vertical centering */}
            <div className="hidden lg:block h-4 shrink-0" />

            {/* Gold Eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.22em] text-amber-400">
                MEET VARSHA JOSHI
              </span>
              <div className="h-px w-10 bg-amber-400/60 flex-shrink-0" />
            </div>

            {/* Headline */}
            <h1 className="font-display text-[clamp(2.2rem,5vw,4.4rem)] leading-[1.06] tracking-tight text-ivory mb-4">
              <span className="block font-bold">An Experienced Educator.</span>
              <span className="block text-lavender font-normal italic mt-1">A Mentor Who Cares.</span>
            </h1>

            {/* Subheading */}
            <p className="max-w-lg text-sm sm:text-base leading-relaxed text-ivory/75 font-sans mb-6">
              Concept-focused Science coaching for CBSE &amp; ICSE Classes IX–X, taught through small batches, structured practice and individual attention in Kharadi, Pune.
            </p>

            {/* Credibility Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-ivory/15 bg-white/5 rounded-xl px-4 mb-6">
              <div className="flex flex-col space-y-1 sm:border-r border-ivory/15 pr-2">
                <GraduationCap className="size-5 text-lavender mb-1" />
                <span className="text-[11px] font-bold text-ivory leading-tight">M.Sc. (Science)</span>
                <span className="text-[10px] font-bold text-ivory leading-tight">B.Ed.</span>
                <span className="text-[9px] text-ivory/50 mt-0.5">Verified Qualifications</span>
              </div>
              <div className="flex flex-col space-y-1 sm:border-r border-ivory/15 pr-2">
                <Users className="size-5 text-lavender mb-1" />
                <span className="text-[11px] font-bold text-ivory leading-tight">25+ Years</span>
                <span className="text-[9px] text-ivory/50 mt-1">Teaching Experience</span>
              </div>
              <div className="flex flex-col space-y-1 sm:border-r border-ivory/15 pr-2">
                <Award className="size-5 text-lavender mb-1" />
                <span className="text-[11px] font-bold text-ivory leading-tight">Recognised Educator</span>
                <span className="text-[9px] text-ivory/50 mt-1">Awards &amp; Appreciation</span>
              </div>
              <div className="flex flex-col space-y-1 pl-1">
                <BookOpen className="size-5 text-lavender mb-1" />
                <span className="text-[11px] font-bold text-ivory leading-tight">CBSE &amp; ICSE</span>
                <span className="text-[9px] text-ivory/50 mt-1">IX–X Specialist</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 items-center">
              <Button
                onClick={openEnquiry}
                className="h-11 sm:h-12 px-5 sm:px-6 bg-violet hover:bg-violet/90 text-ivory text-[11px] font-extrabold uppercase tracking-wider rounded-md shadow-lg cursor-pointer transition-all"
              >
                SPEAK TO VARSHA MA'AM →
              </Button>
              <a
                href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 sm:h-12 px-4 sm:px-5 border border-ivory/30 bg-ivory/8 hover:bg-ivory/15 text-ivory text-[11px] font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-2 backdrop-blur-sm transition-all"
              >
                <MessageSquare className="size-4 text-emerald-400 shrink-0" />
                WHATSAPP
              </a>
              <Link
                to="/courses"
                className="h-11 sm:h-12 px-4 sm:px-5 border border-ivory/20 bg-transparent hover:bg-ivory/10 text-ivory text-[11px] font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-1 backdrop-blur-sm transition-all"
              >
                COURSES →
              </Link>
            </div>

            {/* AT A GLANCE — Left Side Corner Box (Responsive for Desktop & Mobile) */}
            <div className="mt-7 bg-[#1c1244]/90 backdrop-blur-md text-white p-4 sm:p-5 rounded-2xl border border-amber-400/25 shadow-2xl max-w-xl">
              <div className="flex items-center justify-between border-b border-ivory/15 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex size-5.5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-ink font-bold text-[11px] shadow-xs">✓</span>
                  <span className="text-[10.5px] font-extrabold uppercase tracking-[0.20em] text-amber-300">AT A GLANCE</span>
                </div>
                <span className="text-[9px] sm:text-[9.5px] text-ivory/60 uppercase tracking-widest font-semibold">Specialized Coaching</span>
              </div>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-[11px] sm:text-xs text-white/95 font-medium">
                {[
                  "Concept Clarity",
                  "Strong Fundamentals",
                  "Exam Focused",
                  "Doubt Solving",
                  "Personal Attention",
                  "Board Mentorship",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-amber-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT PANEL — Clear area on desktop so Varsha's portrait is prominently displayed */}
          <div className="hidden lg:flex lg:w-[46%] xl:w-[50%] relative" />

        </div>
      </section>


      {/* 02 — TRUST STATISTICS FLOATING STRIP */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-20 -mt-6 sm:-mt-10 mb-16">
        <div className="bg-white rounded-2xl shadow-lg border border-border/70 py-6 px-6 sm:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-border/60">
            {/* Col 1 */}
            <div className="pt-2 md:pt-0 px-2 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-1">
                <Users className="size-5 text-[#d97706]" />
                <span className="font-display text-2xl sm:text-3xl text-ink font-bold">100+</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Students Mentored</span>
            </div>

            {/* Col 2 */}
            <div className="pt-4 md:pt-0 px-2 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-1">
                <Star className="size-5 text-[#d97706]" />
                <span className="font-display text-2xl sm:text-3xl text-ink font-bold">90%+</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Scored in Board Exams</span>
            </div>

            {/* Col 3 */}
            <div className="pt-4 md:pt-0 px-2 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="size-5 text-[#d97706]" />
                <span className="font-display text-2xl sm:text-3xl text-ink font-bold">CBSE + ICSE</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Classes IX &amp; X</span>
            </div>

            {/* Col 4 */}
            <div className="pt-4 md:pt-0 px-2 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-1">
                <Users className="size-5 text-[#d97706]" />
                <span className="font-display text-2xl sm:text-3xl text-ink font-bold">Small Batches</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Maximum Personal Attention</span>
            </div>
          </div>
        </div>
      </div>

      {/* 03 — WHY VARSHA SECTION */}
      <section className="bg-[#faf8f5] py-16 sm:py-24 border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
            <div>
              <span className="eyebrow text-[#35208f]">WHY VARSHA?</span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl text-ink">
                Personal Guidance.
                <br />
                <span className="italic font-normal text-[#35208f]">Proven Results.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                Every child is unique. My focus is to build strong concepts, boost confidence and prepare students to excel in board exams and beyond.
              </p>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#35208f] hover:underline shrink-0"
            >
              KNOW MORE ABOUT MY APPROACH →
            </Link>
          </div>

          {/* 5 Feature Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="border border-border/70 bg-white p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="overflow-hidden rounded-lg aspect-[16/10] bg-muted">
                <img src={approachImage} alt="Concept-focused science teaching" className="size-full object-cover" />
              </div>
              <div>
                <span className="eyebrow text-royal text-[10px]">Pillar 01</span>
                <h3 className="font-display text-xl text-ink mt-1">Concept-Focused Teaching</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Making Science simple, logical and enjoyable through fundamental physical principles.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="border border-border/70 bg-white p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="overflow-hidden rounded-lg aspect-[16/10] bg-muted">
                <img src={classroomImage} alt="Individual student attention in small batches" className="size-full object-cover" />
              </div>
              <div>
                <span className="eyebrow text-royal text-[10px]">Pillar 02</span>
                <h3 className="font-display text-xl text-ink mt-1">Individual Attention</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Every student gets the focus they truly deserve with close observation of learning gaps.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="border border-border/70 bg-white p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="overflow-hidden rounded-lg aspect-[16/10] bg-muted">
                <img src={heroImage} alt="Regular doubt solving session" className="size-full object-cover" />
              </div>
              <div>
                <span className="eyebrow text-royal text-[10px]">Pillar 03</span>
                <h3 className="font-display text-xl text-ink mt-1">Regular Doubt Solving</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Questions encouraged, concepts strengthened with dedicated doubt resolution slots.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="border border-border/70 bg-white p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="overflow-hidden rounded-lg aspect-[16/10] bg-muted">
                <img src={approachImage} alt="Structured practice and test series" className="size-full object-cover" />
              </div>
              <div>
                <span className="eyebrow text-royal text-[10px]">Pillar 04</span>
                <h3 className="font-display text-xl text-ink mt-1">Structured Practice</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Tests, assignments and practice to build exam confidence strictly on council standards.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="border border-border/70 bg-white p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow space-y-4 lg:col-span-2">
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="w-full sm:w-1/2 overflow-hidden rounded-lg aspect-[16/10] bg-muted">
                  <img src={classroomImage} alt="Mentorship and student motivation" className="size-full object-cover" />
                </div>
                <div className="w-full sm:w-1/2 space-y-2">
                  <span className="eyebrow text-royal text-[10px]">Pillar 05</span>
                  <h3 className="font-display text-2xl text-ink">Mentorship &amp; Motivation</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Guiding students with care, discipline and encouragement to build academic confidence for life.
                  </p>
                  <div className="pt-2">
                    <Button onClick={openEnquiry} size="sm" variant="outline" className="text-xs font-bold cursor-pointer">
                      Speak with Varsha Ma'am →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — RESULTS & TESTIMONIALS */}
      <section className="bg-white py-16 sm:py-24 border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] items-start">
            
            {/* Results Column */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="eyebrow text-[#35208f]">STUDENT ACHIEVEMENTS</span>
                  <h2 className="mt-2 font-display text-3xl sm:text-4xl text-ink">
                    Real Students. Real Results.
                  </h2>
                </div>
                <Link
                  to="/results"
                  className="text-xs font-bold uppercase tracking-wider text-[#35208f] hover:underline shrink-0"
                >
                  VIEW ALL RESULTS →
                </Link>
              </div>

              {/* Student Result Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="border border-border bg-[#faf8f5] p-5 rounded-xl text-center space-y-2">
                  <span className="eyebrow text-[#35208f] text-[10px]">Anay Kulkarni</span>
                  <p className="text-[11px] text-muted-foreground font-semibold">CBSE | Class X | 2024–25</p>
                  <p className="text-[10px] text-muted-foreground truncate">The Lexicon International</p>
                  <div className="pt-2">
                    <span className="font-display text-3xl text-[#35208f] font-bold">96%</span>
                  </div>
                </div>

                <div className="border border-border bg-[#faf8f5] p-5 rounded-xl text-center space-y-2">
                  <span className="eyebrow text-[#35208f] text-[10px]">Sia Deshmukh</span>
                  <p className="text-[11px] text-muted-foreground font-semibold">ICSE | Class X | 2024–25</p>
                  <p className="text-[10px] text-muted-foreground truncate">Bishop's School, Pune</p>
                  <div className="pt-2">
                    <span className="font-display text-3xl text-[#35208f] font-bold">94.2%</span>
                  </div>
                </div>

                <div className="border border-border bg-[#faf8f5] p-5 rounded-xl text-center space-y-2">
                  <span className="eyebrow text-[#35208f] text-[10px]">Vedant Patil</span>
                  <p className="text-[11px] text-muted-foreground font-semibold">CBSE | Class X | 2024–25</p>
                  <p className="text-[10px] text-muted-foreground truncate">DPS, Pune</p>
                  <div className="pt-2">
                    <span className="font-display text-3xl text-[#35208f] font-bold">93.4%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials Column */}
            <div className="border border-border/80 bg-[#faf8f5] p-8 rounded-2xl space-y-6 shadow-xs">
              <span className="eyebrow text-royal">WHAT PARENTS SAY</span>
              <blockquote className="font-display text-xl sm:text-2xl text-ink leading-relaxed italic">
                "Varsha Ma'am's way of teaching builds concepts so well that our child now loves Science and scores with confidence."
              </blockquote>
              <div className="border-t border-border pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-ink">— Parent of Anay Kulkarni</p>
                <p className="text-xs text-muted-foreground">Kharadi, Pune</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 05 — COURSES OVERVIEW */}
      <section className="bg-[#faf8f5] py-16 sm:py-24 border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="eyebrow text-[#35208f]">SCIENCE PROGRAMMES</span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink">
              Curriculum Tailored for IX &amp; X.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Four specialized courses engineered for CBSE and ICSE secondary science curricula.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {courses.map((c) => (
              <div key={c.id} className="border border-border/80 bg-white p-6 sm:p-8 rounded-2xl space-y-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="eyebrow text-[#35208f] text-[10px]">{c.board} • {c.className}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Small Batches</span>
                  </div>
                  <h3 className="font-display text-2xl text-ink mt-3">{c.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{c.description}</p>
                </div>
                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Physics • Chemistry • Biology</span>
                  <Link
                    to="/courses/$slug"
                    params={{ slug: c.slug }}
                    className="text-xs font-bold uppercase tracking-wider text-[#35208f] hover:underline inline-flex items-center gap-1"
                  >
                    EXPLORE COURSE →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — BRAND PILLARS */}
      <section className="bg-white py-12 border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="font-display text-lg font-bold text-ink">Concept Clarity</span>
              <p className="text-xs text-muted-foreground">Strong foundation for life</p>
            </div>
            <div className="space-y-1">
              <span className="font-display text-lg font-bold text-ink">Exam Ready</span>
              <p className="text-xs text-muted-foreground">Focused preparation strategy</p>
            </div>
            <div className="space-y-1">
              <span className="font-display text-lg font-bold text-ink">Confidence Building</span>
              <p className="text-xs text-muted-foreground">Better understanding, better results</p>
            </div>
            <div className="space-y-1">
              <span className="font-display text-lg font-bold text-ink">Bright Future</span>
              <p className="text-xs text-muted-foreground">Preparing for tomorrow's challenges</p>
            </div>
          </div>
        </div>
      </section>

      {/* 07 — FINAL CTA BANNER */}
      <section className="bg-ink text-ivory py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="eyebrow text-lavender/90 tracking-[0.20em]">DIRECT ADMISSIONS &amp; COUNSELLING</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ivory">
            Let's understand what your child needs.
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-ivory/75 leading-relaxed">
            Have questions about the right class, batch or preparation plan? Speak directly with Varsha Ma'am.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={openEnquiry}
              className="h-12 px-8 bg-[#35208f] hover:bg-[#2b177d] text-ivory text-xs font-bold uppercase tracking-wider rounded-md shadow-md cursor-pointer"
            >
              SPEAK TO VARSHA MA'AM →
            </Button>
            <a
              href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-8 border border-ivory/30 bg-transparent text-ivory hover:bg-white/10 text-xs font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare className="size-4 text-emerald-400 shrink-0" />
              WHATSAPP US
            </a>
          </div>
        </div>
      </section>

      {/* Local SEO Areas Footer Component */}
      <LocalSeoAreas />
    </>
  );
}
