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
import { LatestVideos } from "@/components/sections/LatestVideos";
import { GoogleReviewsSection } from "@/components/sections/GoogleReviewsSection";
import { courses, faqs, site } from "@/content/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Varsha Joshi Science Coaching Kharadi | CBSE & ICSE 9th & 10th | Joshi’s Academy" },
      {
        name: "description",
        content:
          "Experienced educator Varsha Joshi provides concept-first CBSE & ICSE Science coaching for Classes 9 & 10 in Kharadi, Pune. Small batches, individual attention, and verified 90%+ board results.",
      },
      {
        name: "keywords",
        content:
          "Varsha Joshi teacher Kharadi, Varsha Joshi science coaching, coaching classes in Kharadi, science tuition Kharadi, 10th CBSE science tuition Kharadi, ICSE science coaching Kharadi",
      },
      {
        property: "og:title",
        content: "Varsha Joshi - Experienced Science Educator & Mentor in Kharadi, Pune",
      },
      {
        property: "og:description",
        content:
          "An Experienced Educator. A Mentor Who Cares. Concept-focused CBSE & ICSE Science Coaching for Classes 9 & 10.",
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
      {/* 01 - ART-DIRECTED RESPONSIVE HERO SECTION */}
      <section className="relative bg-[#0d0d14] text-ivory overflow-hidden pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24">
        {/* Subtle Ambient Backlight Effects */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#35208f]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Editorial Hero Typography & CTAs */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 w-fit mb-4 sm:mb-5">
                <span className="inline-block size-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[1.5px] text-amber-300">
                  MEET VARSHA JOSHI
                </span>
              </div>

              {/* Premium Heading */}
              <h1 className="font-display text-[clamp(2.1rem,6vw,3.5rem)] leading-[1.08] tracking-tight text-white mb-4 sm:mb-5">
                <span className="block font-normal">An Experienced</span>
                <span className="block font-normal">Educator.</span>
                <span className="block text-amber-200/95 italic font-normal mt-0.5">
                  A Mentor Who Cares.
                </span>
              </h1>

              {/* Mobile Image: Shown prominently between title and paragraph on mobile */}
              <div className="block lg:hidden my-2 mb-5">
                <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-black/40 bg-ink">
                  <img
                    src={varshaImage}
                    alt="Varsha Joshi - Principal Science Educator & Mentor at Joshi's Academy"
                    width={800}
                    height={600}
                    fetchPriority="high"
                    className="w-full h-[260px] xs:h-[300px] sm:h-[360px] object-cover object-[50%_18%] brightness-[1.04] contrast-[1.02]"
                  />
                  {/* Floating Glassmorphism Tag */}
                  <div className="absolute bottom-3 left-3 right-3 bg-[#0d0d14]/85 backdrop-blur-md border border-white/15 rounded-xl px-3.5 py-2 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-emerald-400" />
                      <div>
                        <p className="text-[13px] font-semibold leading-tight text-white">Varsha Joshi</p>
                        <p className="text-[11px] text-ivory/75 leading-tight">Science Specialist (CBSE &amp; ICSE)</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-md">
                      15+ Yrs Exp
                    </span>
                  </div>
                </div>
              </div>

              {/* Concise Description Paragraph */}
              <p className="text-[15px] sm:text-[17px] lg:text-[18px] leading-[1.5] text-ivory/85 font-sans max-w-[560px] mb-6 sm:mb-8 font-normal">
                Concept-focused Science coaching for CBSE, ICSE &amp; State Board Classes IX-X, with
                small batches, structured practice and individual attention.
              </p>

              {/* Action CTAs */}
              <div className="flex items-center flex-wrap gap-3.5 sm:gap-4 mb-6">
                <button
                  onClick={openEnquiry}
                  className="inline-flex items-center justify-center min-h-[48px] px-6 sm:px-8 bg-amber-400 hover:bg-amber-300 text-ink text-[14.5px] sm:text-[15.5px] font-semibold rounded-lg shadow-lg shadow-amber-400/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  I'm Interested →
                </button>
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center min-h-[48px] px-5 sm:px-6 bg-white/10 hover:bg-white/15 border border-white/20 text-[14.5px] sm:text-[15.5px] font-medium text-white rounded-lg backdrop-blur-sm transition-all"
                >
                  Explore Courses →
                </Link>
              </div>

              {/* Mini Highlights */}
              <div className="flex items-center flex-wrap gap-x-5 gap-y-2 pt-3 text-[12px] sm:text-[13px] text-ivory/70 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-amber-400 flex-shrink-0" />
                  <span>Small Batches (Max 12)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-amber-400 flex-shrink-0" />
                  <span>90%+ Board Success</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-amber-400 flex-shrink-0" />
                  <span>Kharadi, Pune</span>
                </div>
              </div>
            </div>

            {/* Right Column: Desktop Educator Showcase Card */}
            <div className="hidden lg:block lg:col-span-5 relative">
              <div className="relative mx-auto max-w-[440px]">
                {/* Decorative background glow & accent frame */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-400/30 via-violet/40 to-amber-300/20 rounded-3xl blur-md opacity-70" />

                {/* Main Card */}
                <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-ink">
                  <img
                    src={varshaImage}
                    alt="Varsha Joshi - Principal Science Educator & Mentor at Joshi's Academy"
                    width={800}
                    height={1000}
                    fetchPriority="high"
                    className="w-full h-[480px] xl:h-[510px] object-cover object-[50%_18%] brightness-[1.04] contrast-[1.02] transition-transform duration-500 hover:scale-[1.02]"
                  />

                  {/* Gradient bottom shading */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

                  {/* Floating Glassmorphism Teacher Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-[#0d0d14]/85 backdrop-blur-md border border-white/15 rounded-xl p-3.5 shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-[15px] font-semibold text-white">Varsha Joshi</p>
                          <ShieldCheck className="size-4 text-amber-400" />
                        </div>
                        <p className="text-[12px] text-ivory/80">Science Specialist • Classes IX &amp; X</p>
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-md">
                        15+ Yrs
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 - COMPACT TRUST STATISTICS STRIP */}
      <div className="mx-auto max-w-6xl px-3.5 sm:px-6 lg:px-8 relative z-20 -mt-5 sm:-mt-8 mb-14">
        <div className="bg-white rounded-[18px] shadow-md border border-border/70 py-5 px-4 sm:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center divide-x-0 md:divide-x divide-border/60">
            {/* Col 1 */}
            <div className="px-1 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Users className="size-4 sm:size-5 text-[#d97706]" />
                <span className="font-sans text-lg sm:text-2xl text-ink font-normal">100+</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-normal uppercase tracking-wider text-muted-foreground leading-tight">
                Students Mentored
              </span>
            </div>

            {/* Col 2 */}
            <div className="px-1 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Star className="size-4 sm:size-5 text-[#d97706]" />
                <span className="font-sans text-lg sm:text-2xl text-ink font-normal">90%+</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-normal uppercase tracking-wider text-muted-foreground leading-tight">
                Scored in Board Exams
              </span>
            </div>

            {/* Col 3 */}
            <div className="px-1 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5 mb-0.5">
                <ShieldCheck className="size-4 sm:size-5 text-[#d97706]" />
                <span className="font-sans text-lg sm:text-2xl text-ink font-normal">
                  CBSE + ICSE
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-normal uppercase tracking-wider text-muted-foreground leading-tight">
                Classes IX &amp; X
              </span>
            </div>

            {/* Col 4 */}
            <div className="px-1 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Users className="size-4 sm:size-5 text-[#d97706]" />
                <span className="font-sans text-lg sm:text-2xl text-ink font-normal">
                  Small Batches
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-normal uppercase tracking-wider text-muted-foreground leading-tight">
                Maximum Personal Attention
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 03 - WHY VARSHA SECTION */}
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
                Every child is unique. My focus is to build strong concepts, boost confidence and
                prepare students to excel in board exams and beyond.
              </p>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#35208f] hover:underline shrink-0"
            >
              KNOW MORE ABOUT MY APPROACH →
            </Link>
          </div>

          {/* 5 Feature Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="border border-border/70 bg-white p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="overflow-hidden rounded-lg aspect-[16/10] bg-muted">
                <img
                  src={approachImage}
                  alt="Concept-focused science teaching"
                  className="size-full object-cover"
                />
              </div>
              <div>
                <span className="eyebrow text-royal text-[10px]">Pillar 01</span>
                <h3 className="font-display text-xl text-ink mt-1">Concept-Focused Teaching</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Making Science simple, logical and enjoyable through fundamental physical
                  principles.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="border border-border/70 bg-white p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="overflow-hidden rounded-lg aspect-[16/10] bg-muted">
                <img
                  src={classroomImage}
                  alt="Individual student attention in small batches"
                  className="size-full object-cover"
                />
              </div>
              <div>
                <span className="eyebrow text-royal text-[10px]">Pillar 02</span>
                <h3 className="font-display text-xl text-ink mt-1">Individual Attention</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Every student gets the focus they truly deserve with close observation of learning
                  gaps.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="border border-border/70 bg-white p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="overflow-hidden rounded-lg aspect-[16/10] bg-muted">
                <img
                  src={heroImage}
                  alt="Regular doubt solving session"
                  className="size-full object-cover"
                />
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
                <img
                  src={approachImage}
                  alt="Structured practice and test series"
                  className="size-full object-cover"
                />
              </div>
              <div>
                <span className="eyebrow text-royal text-[10px]">Pillar 04</span>
                <h3 className="font-display text-xl text-ink mt-1">Structured Practice</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Tests, assignments and practice to build exam confidence strictly on council
                  standards.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="border border-border/70 bg-white p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow space-y-4 lg:col-span-2">
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="w-full sm:w-1/2 overflow-hidden rounded-lg aspect-[16/10] bg-muted">
                  <img
                    src={classroomImage}
                    alt="Mentorship and student motivation"
                    className="size-full object-cover"
                  />
                </div>
                <div className="w-full sm:w-1/2 space-y-2">
                  <span className="eyebrow text-royal text-[10px]">Pillar 05</span>
                  <h3 className="font-display text-2xl text-ink">Mentorship &amp; Motivation</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Guiding students with care, discipline and encouragement to build academic
                    confidence for life.
                  </p>
                  <div className="pt-2">
                    <Button
                      onClick={openEnquiry}
                      size="sm"
                      variant="outline"
                      className="text-xs font-medium cursor-pointer"
                    >
                      I'm Interested →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 - RESULTS & TESTIMONIALS */}
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
                  className="text-xs font-medium uppercase tracking-wider text-[#35208f] hover:underline shrink-0"
                >
                  VIEW ALL RESULTS →
                </Link>
              </div>

              {/* Student Result Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="border border-border bg-[#faf8f5] p-5 rounded-xl text-center space-y-2">
                  <span className="eyebrow text-[#35208f] text-[10px]">Anay Kulkarni</span>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    CBSE | Class X | 2024-25
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    The Lexicon International
                  </p>
                  <div className="pt-2">
                    <span className="font-display text-3xl text-[#35208f] font-normal">96%</span>
                  </div>
                </div>

                <div className="border border-border bg-[#faf8f5] p-5 rounded-xl text-center space-y-2">
                  <span className="eyebrow text-[#35208f] text-[10px]">Sia Deshmukh</span>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    ICSE | Class X | 2024-25
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    Bishop's School, Pune
                  </p>
                  <div className="pt-2">
                    <span className="font-display text-3xl text-[#35208f] font-normal">94.2%</span>
                  </div>
                </div>

                <div className="border border-border bg-[#faf8f5] p-5 rounded-xl text-center space-y-2">
                  <span className="eyebrow text-[#35208f] text-[10px]">Vedant Patil</span>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    CBSE | Class X | 2024-25
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">DPS, Pune</p>
                  <div className="pt-2">
                    <span className="font-display text-3xl text-[#35208f] font-normal">93.4%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials Column */}
            <div className="border border-border/80 bg-[#faf8f5] p-8 rounded-2xl space-y-6 shadow-xs">
              <span className="eyebrow text-royal">WHAT PARENTS SAY</span>
              <blockquote className="font-display text-xl sm:text-2xl text-ink leading-relaxed italic">
                "Varsha Ma'am's way of teaching builds concepts so well that our child now loves
                Science and scores with confidence."
              </blockquote>
              <div className="border-t border-border pt-4">
                <p className="text-xs font-medium uppercase tracking-wider text-ink">
                  - Parent of Anay Kulkarni
                </p>
                <p className="text-xs text-muted-foreground">Kharadi, Pune</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GOOGLE REVIEWS SECTION */}
      <GoogleReviewsSection />

      {/* 05 - COURSES OVERVIEW */}
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
              <div
                key={c.id}
                className="border border-border/80 bg-white p-6 sm:p-8 rounded-2xl space-y-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="eyebrow text-[#35208f] text-[10px]">
                      {c.board} • {c.className}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Small Batches
                    </span>
                  </div>
                  <h3 className="font-display text-2xl text-ink mt-3">{c.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {c.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Physics • Chemistry • Biology
                  </span>
                  <Link
                    to="/courses/$slug"
                    params={{ slug: c.slug }}
                    className="text-xs font-medium uppercase tracking-wider text-[#35208f] hover:underline inline-flex items-center gap-1"
                  >
                    EXPLORE COURSE →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST YOUTUBE VIDEOS SECTION */}
      <LatestVideos />

      {/* 06 - BRAND PILLARS */}
      <section className="bg-white py-12 border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-lg font-semibold text-ink">Concept Clarity</span>
              <p className="text-xs text-muted-foreground">Strong foundation for life</p>
            </div>
            <div className="space-y-1">
              <span className="text-lg font-semibold text-ink">Exam Ready</span>
              <p className="text-xs text-muted-foreground">Focused preparation strategy</p>
            </div>
            <div className="space-y-1">
              <span className="text-lg font-semibold text-ink">Confidence Building</span>
              <p className="text-xs text-muted-foreground">Better understanding, better results</p>
            </div>
            <div className="space-y-1">
              <span className="text-lg font-semibold text-ink">Bright Future</span>
              <p className="text-xs text-muted-foreground">Preparing for tomorrow's challenges</p>
            </div>
          </div>
        </div>
      </section>

      {/* 07 - FINAL CTA BANNER */}
      <section className="bg-ink text-ivory py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="eyebrow text-lavender/90 tracking-[0.20em]">
            DIRECT ADMISSIONS &amp; COUNSELLING
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ivory">
            Let's understand what your child needs.
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-ivory/75 leading-relaxed">
            Have questions about the right class, batch or preparation plan? Speak directly with
            Varsha Ma'am.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={openEnquiry}
              className="h-12 px-8 bg-[#35208f] hover:bg-[#2b177d] text-ivory text-xs font-medium uppercase tracking-wider rounded-md shadow-md cursor-pointer"
            >
              I'M INTERESTED →
            </Button>
            <a
              href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-8 border border-ivory/30 bg-transparent text-ivory hover:bg-white/10 text-xs font-medium uppercase tracking-wider rounded-md flex items-center justify-center gap-2 transition-all"
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
