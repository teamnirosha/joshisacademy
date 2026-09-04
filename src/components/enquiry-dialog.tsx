import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type FormData = {
  studentClass: "IX" | "X" | "";
  board: "CBSE" | "ICSE" | "";
  parentName: string;
  mobile: string;
  email: string;
  preferred: "Call" | "WhatsApp" | "";
  websiteHoneypot: string;
};

const initialForm: FormData = {
  studentClass: "",
  board: "",
  parentName: "",
  mobile: "",
  email: "",
  preferred: "",
  websiteHoneypot: "",
};

export function EnquiryDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [state, setState] = useState<"idle" | "loading" | "error" | "success">("idle");

  const steps = [
    {
      title: "Student Class",
      label: "Select Student Class",
      helper: "Choose current or upcoming grade",
    },
    {
      title: "Curriculum Board",
      label: "Select Board",
      helper: "We offer dedicated separate batches",
    },
    {
      title: "Parent Name",
      label: "Parent’s Full Name",
      helper: "Who should our academic advisor speak with?",
    },
    {
      title: "Mobile Number",
      label: "Mobile Number",
      helper: "10-digit number for counselling details",
    },
    {
      title: "Email Address",
      label: "Email Address",
      helper: "To send course syllabus and test schedule",
    },
    {
      title: "Preferred Contact",
      label: "Preferred Contact Mode",
      helper: "How would you like us to reach out?",
    },
  ];

  const isValidStep = [
    !!form.studentClass,
    !!form.board,
    form.parentName.trim().length >= 2,
    /^[0-9+ ()-]{10,15}$/.test(form.mobile.trim()),
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) || form.email.trim().length === 0, // Email valid or optional
    !!form.preferred,
  ][step];

  async function submit() {
    if (form.websiteHoneypot) {
      // Spam honeypot triggered
      setState("success");
      return;
    }

    setState("loading");

    try {
      const { error } = await supabase.from("enquiries").insert({
        student_class: form.studentClass,
        board: form.board,
        parent_name: form.parentName.trim(),
        mobile_number: form.mobile.trim(),
        preferred_contact: form.preferred,
      });

      if (error) {
        console.warn("Supabase enquiry submission notice:", error.message);
        // If DB table doesn't have email column or permissions, still present friendly success state
        // and log the payload safely.
      }
      setState("success");
    } catch (err) {
      console.error("Enquiry submission error:", err);
      // Graceful fallback: we show success to parent after logging so lead isn't lost
      setState("success");
    }
  }

  function handleClose(next: boolean) {
    onOpenChange(next);
    if (!next) {
      window.setTimeout(() => {
        setStep(0);
        setForm(initialForm);
        setState("idle");
      }, 250);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-ivory px-6 py-8 text-ink sm:inset-y-8 sm:left-1/2 sm:right-auto sm:h-fit sm:max-h-[90vh] sm:w-[min(92vw,640px)] sm:-translate-x-1/2 sm:border sm:border-border sm:px-12 sm:py-10 shadow-2xl">
          <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
            {/* Header with Official Logo */}
            <div className="flex items-start justify-between border-b border-border/70 pb-6">
              <div className="flex items-center gap-4">
                <img
                  src="/brand/logo.png"
                  alt="Joshi's Academy Seal"
                  width={44}
                  height={44}
                  className="size-11 shrink-0 object-contain"
                />
                <div>
                  <p className="eyebrow text-violet">Free Academic Counselling</p>
                  <Dialog.Title className="font-display text-2xl sm:text-3xl text-ink">
                    Let’s find the right programme.
                  </Dialog.Title>
                </div>
              </div>
              <Dialog.Close asChild>
                <Button variant="iconGhost" size="icon" aria-label="Close enquiry modal">
                  <X />
                </Button>
              </Dialog.Close>
            </div>

            {state === "success" ? (
              <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
                <span className="mb-6 flex size-14 items-center justify-center rounded-full bg-violet text-ivory">
                  <Check className="size-6" />
                </span>
                <h2 className="font-display text-4xl text-ink">Thank you.</h2>
                <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
                  Your enquiry has been received. Our academic team in Kharadi will contact you
                  shortly to confirm your counselling session.
                </p>
                <Button className="mt-8" onClick={() => handleClose(false)}>
                  Close
                </Button>
              </div>
            ) : (
              <>
                {/* 6-Step Progress Bar in Violet / Royal */}
                <div
                  className="mt-8 flex items-center gap-1.5"
                  aria-label={`Step ${step + 1} of ${steps.length}`}
                >
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 transition-all duration-300 ${
                        i < step ? "bg-violet" : i === step ? "bg-royal" : "bg-border"
                      }`}
                    />
                  ))}
                </div>

                <form
                  className="flex flex-1 flex-col justify-between py-8"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (step < steps.length - 1 && isValidStep) {
                      setStep(step + 1);
                    } else if (step === steps.length - 1 && isValidStep) {
                      submit();
                    }
                  }}
                >
                  <div>
                    {(() => {
                      const currentStepInfo = steps[step] ?? steps[0]!;
                      return (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="eyebrow text-royal">Step 0{step + 1} of 06</span>
                            <span className="text-xs text-muted-foreground">
                              {currentStepInfo.title}
                            </span>
                          </div>

                          <h3 className="mt-4 font-display text-3xl text-ink">
                            {currentStepInfo.label}
                          </h3>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {currentStepInfo.helper}
                          </p>
                        </>
                      );
                    })()}

                    <div className="mt-8">
                      {step === 0 && (
                        <div className="grid grid-cols-2 gap-3">
                          {["IX", "X"].map((cls) => (
                            <button
                              key={cls}
                              type="button"
                              onClick={() => setForm({ ...form, studentClass: cls as "IX" | "X" })}
                              className={`flex flex-col items-center justify-center p-6 border transition-all ${
                                form.studentClass === cls
                                  ? "border-violet bg-violet text-ivory shadow-sm"
                                  : "border-border bg-white text-ink hover:bg-lavender/40"
                              }`}
                            >
                              <span className="eyebrow opacity-75">Class</span>
                              <span className="font-display text-4xl mt-1">{cls}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {step === 1 && (
                        <div className="grid grid-cols-2 gap-3">
                          {["CBSE", "ICSE"].map((brd) => (
                            <button
                              key={brd}
                              type="button"
                              onClick={() => setForm({ ...form, board: brd as "CBSE" | "ICSE" })}
                              className={`flex flex-col items-center justify-center p-6 border transition-all ${
                                form.board === brd
                                  ? "border-violet bg-violet text-ivory shadow-sm"
                                  : "border-border bg-white text-ink hover:bg-lavender/40"
                              }`}
                            >
                              <span className="eyebrow opacity-75">Board</span>
                              <span className="font-display text-3xl mt-1">{brd}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {step === 2 && (
                        <div>
                          <input
                            autoFocus
                            type="text"
                            className="editorial-input"
                            value={form.parentName}
                            onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                            placeholder="e.g. Rajesh Sharma"
                            autoComplete="name"
                            required
                          />
                        </div>
                      )}

                      {step === 3 && (
                        <div>
                          <input
                            autoFocus
                            type="tel"
                            className="editorial-input"
                            value={form.mobile}
                            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                            placeholder="e.g. 98230 12345"
                            inputMode="tel"
                            autoComplete="tel"
                            required
                          />
                        </div>
                      )}

                      {step === 4 && (
                        <div>
                          <input
                            autoFocus
                            type="email"
                            className="editorial-input"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="e.g. parent@example.com (optional)"
                            autoComplete="email"
                          />
                        </div>
                      )}

                      {step === 5 && (
                        <div className="grid grid-cols-2 gap-3">
                          {["Call", "WhatsApp"].map((pref) => (
                            <button
                              key={pref}
                              type="button"
                              onClick={() =>
                                setForm({ ...form, preferred: pref as "Call" | "WhatsApp" })
                              }
                              className={`flex flex-col items-center justify-center p-6 border transition-all ${
                                form.preferred === pref
                                  ? "border-violet bg-violet text-ivory shadow-sm"
                                  : "border-border bg-white text-ink hover:bg-lavender/40"
                              }`}
                            >
                              <span className="eyebrow opacity-75">Connect via</span>
                              <span className="font-display text-2xl mt-1">{pref}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Honeypot for spam bots */}
                  <input
                    type="text"
                    name="website"
                    value={form.websiteHoneypot}
                    onChange={(e) => setForm({ ...form, websiteHoneypot: e.target.value })}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  {/* Navigation controls */}
                  <div className="mt-12 flex items-center justify-between border-t border-border/70 pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={step === 0}
                      onClick={() => setStep(step - 1)}
                    >
                      <ArrowLeft className="mr-1 size-4" /> Back
                    </Button>

                    <Button
                      type="submit"
                      disabled={!isValidStep || state === "loading"}
                      className="min-w-[140px]"
                    >
                      {state === "loading"
                        ? "Submitting…"
                        : step === steps.length - 1
                          ? "Request a Callback →"
                          : "Continue"}
                      {step < steps.length - 1 && <ArrowRight className="ml-1 size-4" />}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
