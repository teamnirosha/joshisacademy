import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, MapPin, Compass, Phone, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, seoMeta } from "@/components/page-hero";
import { site } from "@/content/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: seoMeta(
      "Contact Joshi's Academy | Kharadi, Pune, Maharashtra",
      "Get in touch with Joshi's Academy in Kharadi, Pune for CBSE and ICSE Science coaching enquiries for Classes IX & X. Schedule a free counselling session.",
    ),
    links: [{ rel: "canonical", href: "https://joshisacademy.com/contact" }],
  }),
  component: ContactPage,
});

const openEnquiry = () => window.dispatchEvent(new Event("open-enquiry"));

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Kharadi • Pune"
        title="Come learn with us."
        intro="Speak with the academic team about the right Science programme for your child. We welcome parents and students for structured academic counselling."
      />

      <section className="section-shell py-24 md:py-36">
        <div className="grid gap-16 lg:grid-cols-2 items-start">
          {/* ── Left: Contact Information ──────────────────────────────── */}
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-3">
                <MapPin className="size-6 text-violet" />
                <span className="eyebrow text-violet">Academic Centre</span>
              </div>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl text-ink">Joshi's Academy</h2>
              <p className="mt-2 text-base text-muted-foreground">
                Kharadi, Pune, Maharashtra, India
              </p>
            </div>

            {/* Contact rows */}
            <div className="border-t border-border pt-8 space-y-5">
              {/* Phone */}
              <a href={`tel:${site.phone}`} className="flex items-center gap-4 group">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-lavender/30 group-hover:bg-violet group-hover:border-violet transition-colors">
                  <Phone className="size-4 text-violet group-hover:text-ivory transition-colors" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Call Us
                  </p>
                  <p className="mt-0.5 text-[15px] font-semibold tracking-wide text-ink group-hover:text-violet transition-colors">
                    {site.phone}
                  </p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-green-50 group-hover:bg-green-500 group-hover:border-green-500 transition-colors">
                  <MessageSquare className="size-4 text-green-600 group-hover:text-white transition-colors" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    WhatsApp
                  </p>
                  <p className="mt-0.5 text-[15px] font-semibold tracking-wide text-ink group-hover:text-green-600 transition-colors">
                    {site.whatsapp}
                  </p>
                </div>
              </a>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-lavender/30">
                  <Clock className="size-4 text-royal" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Counselling Hours
                  </p>
                  <p className="mt-0.5 text-sm text-ink leading-relaxed">
                    Monday – Saturday: 10:00 AM – 7:30 PM
                    <br />
                    <span className="text-muted-foreground text-xs">
                      Sunday: By prior appointment for parent counselling
                    </span>
                  </p>
                </div>
              </div>

              {/* Location accessibility */}
              <div className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-lavender/30">
                  <Compass className="size-4 text-royal" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Locational Accessibility
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
                    Conveniently situated in Kharadi, accessible from EON Free Zone, Magarpatta,
                    Wadgaon Sheri, and Viman Nagar.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap gap-4">
              <Button asChild>
                <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
                  Get Directions <Compass className="size-4 ml-1" />
                </a>
              </Button>
              <Button variant="outline" onClick={openEnquiry}>
                Request a Callback
              </Button>
            </div>
          </div>

          {/* ── Right: Map + Enquiry Card ──────────────────────────────── */}
          <div className="space-y-6">
            {/* Google Maps Embed */}
            <div className="overflow-hidden border border-border shadow-sm">
              <iframe
                title="Joshi's Academy on Google Maps"
                src={site.mapsEmbed}
                width="100%"
                height="280"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full"
                style={{ border: 0 }}
                allowFullScreen
              />
              <div className="flex items-center justify-between border-t border-border bg-ivory px-4 py-3">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-violet shrink-0" />
                  <span className="text-xs text-muted-foreground">
                    Kharadi, Pune, Maharashtra, India
                  </span>
                </div>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold uppercase tracking-wider text-violet hover:underline"
                >
                  Open in Maps ↗
                </a>
              </div>
            </div>

            {/* Admissions Enquiry Card */}
            <div className="border border-border bg-white p-8 shadow-sm">
              <span className="eyebrow text-royal">Admissions Inquiry</span>
              <h3 className="mt-3 font-display text-3xl text-ink">
                Schedule an Academic Assessment.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                A 20-minute conversation with our academic counsellor helps identify your child's
                learning baseline, addresses board curriculum nuances, and clarifies how small-batch
                science coaching accelerates understanding.
              </p>

              <div className="mt-8 border-t border-border pt-8 space-y-4">
                <div className="border border-border bg-lavender/30 p-4 text-xs text-ink space-y-1">
                  <p className="font-bold">✓ Free, no-obligation conversation</p>
                  <p className="text-muted-foreground">
                    Includes syllabus review and previous test gap analysis.
                  </p>
                </div>

                <Button variant="default" size="lg" className="w-full" onClick={openEnquiry}>
                  Book a Free Counselling Session <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
