import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { PageHero, seoMeta } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { faqs } from "@/content/site";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: seoMeta(
      "Science Coaching FAQs | Joshi’s Academy Kharadi",
      "Answers about CBSE & ICSE classes, small batches, Physics, Chemistry & Biology teaching, weekly tests, and location at Joshi’s Academy in Kharadi, Pune.",
    ),
    links: [{ rel: "canonical", href: "https://joshisacademy.com/faq" }],
    scripts: [
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
  component: FAQPage,
});

const openEnquiry = () => window.dispatchEvent(new Event("open-enquiry"));

function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="Academic FAQ"
        title="Questions, answered clearly."
        intro="Useful, transparent answers for parents and students considering specialist Science coaching at Joshi’s Academy in Kharadi, Pune."
      />

      <section className="section-shell py-24 md:py-36">
        <div className="mx-auto max-w-4xl divide-y divide-border border-y border-border">
          {faqs.map((faq, i) => (
            <details key={faq.q} open={i === 0} className="group py-8">
              <summary className="flex cursor-pointer list-none items-center justify-between font-display text-2xl sm:text-3xl text-ink">
                <span>{faq.q}</span>
                <ChevronDown className="size-5 shrink-0 transition-transform duration-300 group-open:rotate-180 text-violet ml-4" />
              </summary>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground max-w-3xl">
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-16 text-center max-w-xl mx-auto">
          <p className="text-sm text-muted-foreground mb-6">
            Have a specific question about batch timings, syllabus pacing, or admissions?
          </p>
          <Button variant="default" size="lg" onClick={openEnquiry}>
            Speak with Our Academic Team →
          </Button>
        </div>
      </section>
    </>
  );
}
