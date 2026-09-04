import { createFileRoute } from "@tanstack/react-router";
import { PageHero, seoMeta } from "@/components/page-hero";
export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: seoMeta(
      "Privacy Policy | Joshi’s Academy",
      "How Joshi’s Academy handles information submitted through this website.",
    ),
  }),
  component: Page,
});
function Page() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        intro="A clear summary of how enquiry information is handled."
      />
      <div className="section-shell max-w-4xl py-20 leading-8 text-slate">
        <p>
          Information submitted through the counselling enquiry form is used only to respond about
          relevant academic programmes. The form collects the student’s class and board, parent
          name, mobile number and preferred contact method.
        </p>
        <p className="mt-6">
          We do not sell enquiry information. Access is restricted to authorised academic or
          administrative team members. To request correction or deletion, contact the academy
          through its verified contact channel once published.
        </p>
      </div>
    </>
  );
}
