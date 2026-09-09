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
      { property: "og:title", content: "Varsha Joshi - Experienced Science Educator & Mentor in Kharadi, Pune" },
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
      {/* 01 - ART-DIRECTED RESPONSIVE HERO SECTION */}
      <section className="relative bg-ink text-ivory overflow-hidden min-h-[620px] sm:min-h-[660px] lg:h-[690px] xl:h-[710px] lg:max-h-[720px] flex items-center">
        {/* Science Classroom / Educator Background Image */}
        <div className="absolute inset-0 size-full overflow-hidden">
          <img
            src={varshaImage}
            alt="Varsha Joshi - Principal Science Educator & Mentor at Joshi's Academy"
            width={1600}
            height={1000}
            fetchPriority="high"
            className="size-full object-cover object-[88%_10%] sm:object-[82%_10%] md:object-[80%_12%] lg:object-[86%_15%] xl:object-[88%_15%] brightness-[1.06] contrast-[1.02] image-reveal"
          />
          {/* Mobile Overlay: Art-directed 90deg gradient — 88% dark backdrop on left where text sits, fading to 18% on right where teacher's face is */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,16,0.88)_0%,rgba(10,10,16,0.65)_58%,rgba(10,10,16,0.18)_100%)] lg:hidden" />
          {/* Desktop Overlay: Subtle left-to-right gradient behind text area only */}
          <div className="absolute inset-0 hidden lg:block bg-[linear-gradient(98deg,rgba(15,15,22,0.78)_0%,rgba(15,15,22,0.58)_45%,rgba(15,15,22,0.18)_70%,transparent_100%)]" />
        </div>

        {/* Hero Content - Placed ~112px from top on mobile, max-width 350px on mobile */}
        <div className="relative z-10 w-full mx-auto max-w-6xl px-4 xs:px-5 sm:px-8 lg:px-12 xl:px-16 pt-[112px] sm:pt-[124px] lg:pt-[96px] pb-12 sm:pb-14">
          <div className="max-w-[350px] sm:max-w-[480px] lg:max-w-[620px]">
            {/* Eyebrow */}
            <div className="reveal-1 flex items-center gap-2 mb-3 sm:mb-4">
              <span className="text-[11px] sm:text-[13px] lg:text-[14px] font-bold uppercase tracking-[1.5px] text-amber-400">
                MEET VARSHA JOSHI
              </span>
              <div className="h-px w-7 sm:w-10 bg-amber-400/60 flex-shrink-0" />
            </div>

            {/* Premium Editorial Heading - Lighter, elegant font weight */}
            <h1 className="reveal-2 font-display text-[clamp(1.95rem,7vw,2.25rem)] sm:text-[38px] md:text-[44px] lg:text-[52px] xl:text-[58px] leading-[1.04] tracking-tight text-white mb-3.5 sm:mb-4 font-normal">
              <span className="block font-normal">An Experienced</span>
              <span className="block font-normal">Educator.</span>
              <span className="block text-ivory/90 font-normal italic mt-0.5 sm:mt-1">A Mentor Who Cares.</span>
            </h1>

            {/* Concise Description Paragraph */}
            <p className="reveal-3 text-[14.5px] xs:text-[15px] sm:text-[16px] md:text-[17.5px] lg:text-[18.5px] leading-[1.45] text-white/95 font-sans max-w-[350px] sm:max-w-[480px] lg:max-w-[560px] mb-5 sm:mb-7 font-normal drop-shadow-xs">
              Concept-focused Science coaching for CBSE, ICSE &amp; State Board Classes IX-X, with small batches, structured practice and individual attention.
            </p>

            {/* Action CTAs */}
            <div className="reveal-4 flex items-center flex-wrap gap-y-3.5">
              <button
                onClick={openEnquiry}
                className="inline-flex items-center justify-center min-h-[46px] px-5 sm:px-7 bg-ivory hover:bg-white text-ink text-[14px] sm:text-[15px] font-bold rounded-md shadow-md active:scale-[0.98] transition-all cursor-pointer"
              >
                Speak to Varsha Ma'am →
              </button>
              <Link
                to="/courses"
                className="inline-flex items-center gap-1 text-[14px] sm:text-[15px] font-semibold text-ivory/90 hover:text-white underline underline-offset-4 hover:decoration-amber-400 transition-colors ml-4 sm:ml-5"
              >
                Explore Courses →
              </Link>
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
                <span className="font-display text-xl sm:text-3xl text-ink font-bold">100+</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-tight">Students Mentored</span>
            </div>

            {/* Col 2 */}
            <div className="px-1 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Star className="size-4 sm:size-5 text-[#d97706]" />
                <span className="font-display text-xl sm:text-3xl text-ink font-bold">90%+</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-tight">Scored in Board Exams</span>
            </div>

            {/* Col 3 */}
            <div className="px-1 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5 mb-0.5">
                <ShieldCheck className="size-4 sm:size-5 text-[#d97706]" />
                <span className="font-display text-xl sm:text-3xl text-ink font-bold">CBSE + ICSE</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-tight">Classes IX &amp; X</span>
            </div>

            {/* Col 4 */}
            <div className="px-1 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Users className="size-4 sm:size-5 text-[#d97706]" />
                <span className="font-display text-xl sm:text-3xl text-ink font-bold">Small Batches</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-tight">Maximum Personal Attention</span>
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
                  className="text-xs font-bold uppercase tracking-wider text-[#35208f] hover:underline shrink-0"
                >
                  VIEW ALL RESULTS →
                </Link>
              </div>

              {/* Student Result Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="border border-border bg-[#faf8f5] p-5 rounded-xl text-center space-y-2">
                  <span className="eyebrow text-[#35208f] text-[10px]">Anay Kulkarni</span>
                  <p className="text-[11px] text-muted-foreground font-semibold">CBSE | Class X | 2024-25</p>
                  <p className="text-[10px] text-muted-foreground truncate">The Lexicon International</p>
                  <div className="pt-2">
                    <span className="font-display text-3xl text-[#35208f] font-bold">96%</span>
                  </div>
                </div>

                <div className="border border-border bg-[#faf8f5] p-5 rounded-xl text-center space-y-2">
                  <span className="eyebrow text-[#35208f] text-[10px]">Sia Deshmukh</span>
                  <p className="text-[11px] text-muted-foreground font-semibold">ICSE | Class X | 2024-25</p>
                  <p className="text-[10px] text-muted-foreground truncate">Bishop's School, Pune</p>
                  <div className="pt-2">
                    <span className="font-display text-3xl text-[#35208f] font-bold">94.2%</span>
                  </div>
                </div>

                <div className="border border-border bg-[#faf8f5] p-5 rounded-xl text-center space-y-2">
                  <span className="eyebrow text-[#35208f] text-[10px]">Vedant Patil</span>
                  <p className="text-[11px] text-muted-foreground font-semibold">CBSE | Class X | 2024-25</p>
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
                <p className="text-xs font-bold uppercase tracking-wider text-ink">- Parent of Anay Kulkarni</p>
                <p className="text-xs text-muted-foreground">Kharadi, Pune</p>
              </div>
            </div>

          </div>
        </div>
      </section>

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

      {/* 06 - BRAND PILLARS */}
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

      {/* 07 - FINAL CTA BANNER */}
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
