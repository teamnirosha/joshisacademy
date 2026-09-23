import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Navigation,
  Compass,
  CheckCircle2,
  Clock,
  School,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { gsap } from "gsap";

const openEnquiry = () => window.dispatchEvent(new Event("open-enquiry"));

export interface LocationArea {
  id: string;
  name: string;
  shortName: string;
  distance: string;
  travelTime: string;
  highlights: string[];
  keyLandmarks: string;
  popularSchoolsServed: string[];
}

export const locationAreasData: LocationArea[] = [
  {
    id: "kharadi-core",
    name: "Kharadi (EON & WTC)",
    shortName: "Kharadi",
    distance: "0 km (Centre)",
    travelTime: "2-5 mins",
    keyLandmarks: "EON Free Zone, WTC, Gera Commerzone, Forest County",
    highlights: [
      "Specialised CBSE & ICSE Science Coaching for 9th & 10th grade",
      "Small batches (max 12) with 1-on-1 personal doubt clearance",
    ],
    popularSchoolsServed: ["Podar International", "EuroSchool", "Dhole Patil"],
  },
  {
    id: "chandan-nagar",
    name: "Chandan Nagar",
    shortName: "Chandan Nagar",
    distance: "1.2 km",
    travelTime: "3-5 mins",
    keyLandmarks: "Chandan Nagar Bypass, Nagar Road, Vegetable Market",
    highlights: [
      "Direct link via main Kharadi road with flexible evening batches",
      "Structured board practice & concept clarity drills",
    ],
    popularSchoolsServed: ["Zensar Schools", "Kharadi High School"],
  },
  {
    id: "wagholi",
    name: "Wagholi",
    shortName: "Wagholi",
    distance: "4.5 km",
    travelTime: "8-10 mins",
    keyLandmarks: "Wagholi Highway, Lexicon Circle, Ivy Estate",
    highlights: [
      "Direct 10-minute commute along Pune-Ahmednagar Highway",
      "Complete Physics numericals & Chemistry observations practice",
    ],
    popularSchoolsServed: ["Lexicon International", "JSPM", "Sanskriti"],
  },
  {
    id: "viman-nagar",
    name: "Viman Nagar",
    shortName: "Viman Nagar",
    distance: "3.8 km",
    travelTime: "7-10 mins",
    keyLandmarks: "Phoenix Marketcity, Symbiosis Campus, Dutta Mandir",
    highlights: [
      "High distinction track record (90%+) for ICSE & CBSE boards",
      "Handwritten concise revision notes & exemplar solving",
    ],
    popularSchoolsServed: ["Air Force School", "Symbiosis", "Vimannagar Public"],
  },
  {
    id: "mundhwa-keshavnagar",
    name: "Mundhwa & Keshav Nagar",
    shortName: "Mundhwa",
    distance: "2.5 km",
    travelTime: "5-7 mins",
    keyLandmarks: "Kharadi-Mundhwa Bridge, Godrej Horizon, Florida Riverra",
    highlights: [
      "Seamless bridge connection directly into Kharadi centre",
      "1-on-1 personalized doubt solving & weekly tests",
    ],
    popularSchoolsServed: ["Orbis School", "Lonkar High School"],
  },
  {
    id: "hadapsar-magarpatta",
    name: "Hadapsar & Magarpatta",
    shortName: "Hadapsar",
    distance: "5.5 km",
    travelTime: "12-15 mins",
    keyLandmarks: "Magarpatta South Gate, Amanora Park Town",
    highlights: [
      "Connected via Kharadi-Mundhwa bypass road",
      "Rigorous board preliminary mock tests & answering techniques",
    ],
    popularSchoolsServed: ["Vibgyor High", "Pawar Public", "Amanora School"],
  },
];

export function LocalSeoAreas() {
  const [selectedAreaId, setSelectedAreaId] = useState<string>("all");
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const displayedAreas =
    selectedAreaId === "all"
      ? locationAreasData
      : locationAreasData.filter((a) => a.id === selectedAreaId);

  // GSAP Lazy Scroll Animation on viewport enter
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;

            // Animate Header
            if (headerRef.current) {
              gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
              );
            }

            // Animate Cards
            if (cardsContainerRef.current) {
              const cards = cardsContainerRef.current.children;
              gsap.fromTo(
                cards,
                { opacity: 0, y: 35, scale: 0.97 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.65,
                  stagger: 0.07,
                  ease: "power2.out",
                  delay: 0.1,
                  clearProps: "transform,opacity",
                }
              );
            }
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Animate cards on filter change
  useEffect(() => {
    if (!cardsContainerRef.current) return;
    const cards = cardsContainerRef.current.children;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 15, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.35,
        stagger: 0.04,
        ease: "power2.out",
        clearProps: "transform,opacity",
      }
    );
  }, [selectedAreaId]);

  return (
    <section
      ref={sectionRef}
      className="bg-[#faf9f6] py-16 sm:py-20 text-ink border-t border-border/70 relative overflow-hidden"
      id="locations-served"
    >
      {/* Subtle Background Glows */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-[#35208f]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block */}
        <div ref={headerRef} className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#35208f]/20 bg-[#35208f]/8 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#35208f]">
            <MapPin className="size-3.5 text-[#35208f]" />
            <span>Serving Kharadi &amp; Surrounding Neighborhoods</span>
          </div>

          <h2 className="mt-3.5 font-display text-2xl sm:text-3xl md:text-4xl text-ink tracking-tight leading-[1.15]">
            Top Science Coaching Classes in{" "}
            <span className="text-[#35208f] italic font-normal">Kharadi &amp; Nearby Areas</span>
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            Conveniently located in Kharadi, Pune. Specialist CBSE &amp; ICSE Science tuition (Classes IX &amp; X)
            with small batches, structured practice and proven 90%+ board results.
          </p>
        </div>

        {/* Interactive Filter Pills */}
        <div className="mt-6 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedAreaId("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedAreaId === "all"
                ? "bg-[#35208f] text-white shadow-xs"
                : "bg-white text-ink/75 border border-border/80 hover:border-[#35208f]/40 hover:bg-slate-50"
            }`}
          >
            All 6 Locations
          </button>
          {locationAreasData.map((area) => (
            <button
              key={area.id}
              onClick={() => setSelectedAreaId(area.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedAreaId === area.id
                  ? "bg-[#35208f] text-white shadow-xs"
                  : "bg-white text-ink/75 border border-border/80 hover:border-[#35208f]/40 hover:bg-slate-50"
              }`}
            >
              📍 {area.shortName}
            </button>
          ))}
        </div>

        {/* Location Cards Grid - Exactly 6 clean, compact, balanced boxes */}
        <div
          ref={cardsContainerRef}
          className="mt-6 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch"
        >
          {displayedAreas.map((area) => (
            <div
              key={area.id}
              className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-white p-5 shadow-2xs hover:shadow-lg hover:border-[#35208f]/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                {/* Area Header & Commute Time */}
                <div className="flex items-start justify-between gap-2 border-b border-border/50 pb-3">
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {area.distance}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-ink group-hover:text-[#35208f] transition-colors leading-tight">
                      {area.name}
                    </h3>
                  </div>

                  <span className="shrink-0 rounded-full border border-amber-300/80 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900 flex items-center gap-1">
                    <Clock className="size-3 text-amber-600" />
                    {area.travelTime}
                  </span>
                </div>

                {/* Landmarks Tag */}
                <p className="mt-2.5 text-[11px] text-muted-foreground flex items-center gap-1.5 line-clamp-1">
                  <Compass className="size-3 text-[#35208f] shrink-0" />
                  <span className="truncate">{area.keyLandmarks}</span>
                </p>

                {/* Highlights List (Compact 2 items) */}
                <ul className="mt-3 space-y-1.5 text-xs text-ink/85">
                  {area.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600 mt-0.5" />
                      <span className="leading-tight">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Schools Tag & Action Footer */}
              <div className="mt-4 border-t border-border/50 pt-3 space-y-2.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <School className="size-3 text-[#35208f] shrink-0" />
                  {area.popularSchoolsServed.map((school, sIdx) => (
                    <span
                      key={sIdx}
                      className="rounded bg-[#35208f]/6 border border-[#35208f]/10 px-2 py-0.5 text-[10.5px] font-medium text-[#35208f]"
                    >
                      {school}
                    </span>
                  ))}
                </div>

                <button
                  onClick={openEnquiry}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-50 hover:bg-[#35208f] text-ink hover:text-white border border-border/70 hover:border-[#35208f] text-[11.5px] font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-2xs group-hover:bg-[#35208f] group-hover:text-white"
                >
                  Enquire For {area.shortName} <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call To Action Footer Banner */}
        <div className="mt-10 rounded-xl border border-[#35208f]/30 bg-gradient-to-r from-[#1c1445] via-[#2a1b6d] to-[#120d2e] p-5 sm:p-7 shadow-lg text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1 text-amber-300 text-[11px] font-semibold uppercase tracking-wider bg-amber-400/15 px-2.5 py-0.5 rounded-full border border-amber-400/25">
              <Sparkles className="size-3" />
              <span>Limited Batch Seats Available</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-white">
              Looking for Science Tuition Near You?
            </h3>
            <p className="text-xs text-ivory/80 max-w-xl leading-relaxed">
              Admissions open for CBSE &amp; ICSE Classes IX &amp; X. Direct concept guidance and
              individual doubt sessions by Varsha Joshi in Kharadi.
            </p>
          </div>

          <button
            onClick={openEnquiry}
            className="shrink-0 inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-ink font-semibold px-6 py-2.5 text-xs uppercase tracking-wider rounded-lg shadow-md shadow-amber-400/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            Enquire For Your Area <Navigation className="size-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
