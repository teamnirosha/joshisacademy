import { createFileRoute } from "@tanstack/react-router";
import { PageHero, seoMeta } from "@/components/page-hero";
export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: seoMeta(
      "Website Terms | Joshi’s Academy",
      "Terms for using the Joshi’s Academy website and enquiry service.",
    ),
  }),
  component: Page,
});
function Page() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Website Terms"
        intro="Terms governing use of this website."
      />
      <div className="section-shell max-w-4xl py-20 leading-8 text-slate">
        <p>
          Website content is provided for general academic and admissions information. Course
          structure and availability may change; enrolment is confirmed only through direct
          communication with the academy.
        </p>
        <p className="mt-6">
          Users must submit accurate enquiry details and must not misuse the form. Academic content
          may not be reproduced commercially without permission.
        </p>
      </div>
    </>
  );
}
