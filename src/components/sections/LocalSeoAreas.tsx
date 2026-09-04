import { MapPin, Navigation, Compass, CheckCircle2, Clock, School } from "lucide-react";
import { Button } from "@/components/ui/button";

const openEnquiry = () => window.dispatchEvent(new Event("open-enquiry"));

export interface LocationArea {
  id: string;
  name: string;
  distance: string;
  travelTime: string;
  highlights: string[];
  keyLandmarks: string;
  popularSchoolsServed: string[];
}

export const locationAreasData: LocationArea[] = [
  {
    id: "kharadi-core",
    name: "Kharadi (EON IT Park & WTC)",
    distance: "0 km (Centre)",
    travelTime: "2-5 mins",
    keyLandmarks: "EON Free Zone, World Trade Center, Gera Commerzone, Forest County, Riverdale",
    highlights: [
      "Walkable & short drive from all major housing societies in Kharadi",
      "Specialised CBSE & ICSE Science Coaching for 9th & 10th grade",
      "Small batches ensuring personal doubt resolution",
    ],
    popularSchoolsServed: ["Podar International School", "Dhole Patil National School", "EuroSchool Kharadi"],
  },
  {
    id: "chandan-nagar",
    name: "Chandan Nagar",
    distance: "1.2 km",
    travelTime: "3-5 mins",
    keyLandmarks: "Chandan Nagar Bypass, Nagar Road, Vegetable Market",
    highlights: [
      "Direct access via main Kharadi road",
      "Preferred science tuition center for Chandan Nagar residents",
      "Flexible evening batch timings after school hours",
    ],
    popularSchoolsServed: ["Zensar & Chandan Nagar Schools", "Kharadi High School"],
  },
  {
    id: "wagholi",
    name: "Wagholi",
    distance: "4.5 km",
    travelTime: "8-10 mins",
    keyLandmarks: "Wagholi Highway, Lexicon Circle, Ivy Estate",
    highlights: [
      "Direct 10-minute commute along Pune-Ahmednagar Highway",
      "Dedicated CBSE & ICSE science curriculum alignment",
      "Complete Physics numericals & Chemistry lab observations practice",
    ],
    popularSchoolsServed: ["Lexicon International School", "JSPM Public School", "Sanskriti School"],
  },
  {
    id: "viman-nagar",
    name: "Viman Nagar (Vimannagar)",
    distance: "3.8 km",
    travelTime: "7-10 mins",
    keyLandmarks: "Phoenix Marketcity, Symbiosis Campus, Dutta Mandir Chowk",
    highlights: [
      "Quick access via Nagar Road and Somnath Nagar connection",
      "High distinction track record (90%+) for ICSE & CBSE board exams",
      "Handwritten concise revision notes & exemplar solving",
    ],
    popularSchoolsServed: ["Air Force School", "Symbiosis International School", "Vimannagar Public School"],
  },
  {
    id: "mundhwa-keshavnagar",
    name: "Mundhwa & Keshav Nagar",
    distance: "2.5 km",
    travelTime: "5-7 mins",
    keyLandmarks: "Mula-Mutha Kharadi-Mundhwa Bridge, Godrej Horizon, Florida Riverra",
    highlights: [
      "Seamless bridge connectivity directly connecting Mundhwa & Keshav Nagar to Kharadi",
      "Convenient option for parents seeking top-rated science coaching nearby",
      "1-on-1 personal doubt solving sessions",
    ],
    popularSchoolsServed: ["Orbis School", "Lonkar High School"],
  },
  {
    id: "hadapsar-magarpatta",
    name: "Hadapsar & Magarpatta City",
    distance: "5.5 km",
    travelTime: "12-15 mins",
    keyLandmarks: "Magarpatta South Gate, Amanora Park Town, Noble Hospital Chowk",
    highlights: [
      "Connected via Kharadi-Mundhwa bypass road",
      "Focused 9th & 10th standard Science preparation",
      "Rigorous board exam preliminary mock test series",
    ],
    popularSchoolsServed: ["Vibgyor High School", "Pawar Public School", "Amanora School"],
  },
  {
    id: "vadgaon-sheri",
    name: "Vadgaon Sheri & Kalyani Nagar",
    distance: "3.2 km",
    travelTime: "6-8 mins",
    keyLandmarks: "Sainikwadi, Bishops School Circle, East Avenue",
    highlights: [
      "Proximity to Somnath Nagar & Anand Park link roads",
      "Proven 90%+ board scoring methodology",
    ],
    popularSchoolsServed: ["The Bishop's Co-Ed School", "St. Arnold's Central School"],
  },
];

export function LocalSeoAreas() {
  return (
    <section className="bg-ink py-20 md:py-32 text-ivory border-t border-border/20 relative overflow-hidden" id="locations-served">
      {/* Background Subtle Accent Elements */}
      <div className="absolute -right-24 -top-24 size-96 rounded-full bg-violet/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 size-96 rounded-full bg-lavender/10 blur-3xl pointer-events-none" />

      <div className="section-shell relative z-10">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-lavender/25 bg-lavender/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-lavender">
            <MapPin className="size-3.5" />
            <span>Serving Kharadi & Surrounding Neighborhoods</span>
          </div>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl md:text-5xl text-ivory tracking-tight leading-tight">
            Top Science Coaching Classes in <span className="text-lavender">Kharadi & Nearby Areas</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ivory/75 leading-relaxed">
            Conveniently located in Kharadi, Pune, Joshi’s Academy provides specialist CBSE & ICSE Science tuition (Classes IX & X) for students across Kharadi and nearby residential communities.
          </p>
        </div>

        {/* Areas Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locationAreasData.map((area) => (
            <div
              key={area.id}
              className="group relative flex flex-col justify-between rounded-xl border border-ivory/15 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-violet/60 hover:bg-white/[0.08]"
            >
              <div>
                {/* Area Header */}
                <div className="flex items-start justify-between gap-3 border-b border-ivory/10 pb-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ivory group-hover:text-lavender transition-colors">
                      {area.name}
                    </h3>
                    <p className="mt-1 text-xs text-ivory/60 flex items-center gap-1.5">
                      <Compass className="size-3 text-violet" />
                      <span>{area.keyLandmarks}</span>
                    </p>
                  </div>
                  <div className="shrink-0 rounded-full border border-violet/40 bg-violet/20 px-2.5 py-1 text-[11px] font-bold text-lavender flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>{area.travelTime}</span>
                  </div>
                </div>

                {/* Highlights List */}
                <ul className="mt-4 space-y-2 text-xs sm:text-sm text-ivory/80">
                  {area.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="size-4 shrink-0 text-lavender mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Schools tag footer */}
              <div className="mt-6 border-t border-ivory/10 pt-4">
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ivory/50 font-bold mb-2">
                  <School className="size-3 text-lavender" />
                  <span>Key Schools Covered:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {area.popularSchoolsServed.map((school, sIdx) => (
                    <span
                      key={sIdx}
                      className="rounded bg-ivory/10 px-2 py-0.5 text-[11px] text-ivory/85"
                    >
                      {school}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action footer box */}
        <div className="mt-14 rounded-2xl border border-violet/30 bg-gradient-to-r from-violet/30 via-violet/15 to-transparent p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-display text-2xl font-bold text-ivory">
              Looking for Science Tuition Near You in Kharadi or Nearby?
            </h3>
            <p className="text-sm text-ivory/80 max-w-2xl">
              Admissions open for 2025–26 Academic Year for CBSE & ICSE Classes IX & X. Limited seats available per batch to maintain personalised attention.
            </p>
          </div>
          <Button
            onClick={openEnquiry}
            className="shrink-0 bg-violet hover:bg-violet/90 text-ivory font-bold px-8 py-6 uppercase tracking-wider text-xs shadow-lg shadow-violet/30 cursor-pointer"
          >
            Enquire For Your Area <Navigation className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
