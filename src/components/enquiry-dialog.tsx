import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Check, Phone, MessageSquare, Sparkles, X, GraduationCap, School } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

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
      title: "Student Grade",
      label: "Select Student Class",
      helper: "Choose current or upcoming academic grade",
    },
    {
      title: "Curriculum",
      label: "Select Education Board",
      helper: "We conduct separate batches for CBSE & ICSE",
    },
    {
      title: "Parent Name",
      label: "Parent’s Full Name",
      helper: "Who should our academic advisor speak with?",
    },
    {
      title: "Contact Number",
      label: "Mobile Number",
      helper: "For counselling appointment and syllabus details",
    },
    {
      title: "Email Address",
      label: "Email Address",
      helper: "To receive test schedules and curriculum highlights",
    },
    {
      title: "Contact Mode",
      label: "Preferred Contact Channel",
      helper: "How would you prefer our mentors to reach you?",
    },
  ];

  const isValidStep = [
    !!form.studentClass,
    !!form.board,
    form.parentName.trim().length >= 2,
    /^[0-9+ ()-]{10,15}$/.test(form.mobile.trim()),
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) || form.email.trim().length === 0,
    !!form.preferred,
  ][step];

  async function submit() {
    if (form.websiteHoneypot) {
      setState("success");
      return;
    }

    setState("loading");

    const payload = {
      student_class: form.studentClass,
      board: form.board,
      parent_name: form.parentName.trim(),
      mobile_number: form.mobile.trim(),
      email: form.email.trim() || undefined,
      preferred_contact: form.preferred,
      submitted_at: new Date().toISOString(),
      page_url: typeof window !== "undefined" ? window.location.href : "https://joshisacademy.com",
    };

    try {
      // 1. Post to n8n Automation Webhook
      fetch("https://automate.nirosha.org/webhook/joshisacademy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => console.warn("n8n webhook notice:", err));

      // 2. Persist to Supabase
      const { error } = await supabase.from("enquiries").insert({
        student_class: form.studentClass,
        board: form.board,
        parent_name: form.parentName.trim(),
        mobile_number: form.mobile.trim(),
        preferred_contact: form.preferred,
      });

      if (error) {
        console.warn("Supabase enquiry notice:", error.message);
      }
      setState("success");
    } catch (err) {
      console.error("Enquiry submission notice:", err);
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

        <Dialog.Content className="fixed inset-x-3.5 top-1/2 -translate-y-1/2 z-50 mx-auto w-auto sm:w-full max-w-[500px] max-h-[90dvh] sm:max-h-[85vh] flex flex-col rounded-2xl border border-border/80 bg-ivory text-ink shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 overflow-hidden">
          {/* Header with Official Logo, Title & Badges */}
          <div className="shrink-0 p-4 sm:p-5 sm:pb-4 border-b border-border/60 bg-ivory">
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="relative size-10 sm:size-11 shrink-0 rounded-full bg-white p-0.5 shadow-xs border border-border/70">
                  <img
                    src="/brand/logo.png"
                    alt={`${site.name} Seal`}
                    width={44}
                    height={44}
                    className="size-full object-contain rounded-full"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet">
                      <Sparkles className="size-2.5" />
                      Free Academic Counselling
                    </span>
                  </div>
                  <Dialog.Title className="mt-0.5 font-display text-base sm:text-xl text-ink font-bold leading-snug truncate">
                    Let’s find the right programme.
                  </Dialog.Title>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium truncate">
                    {site.name} • {site.location}
                  </p>
                </div>
              </div>

              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-lavender/60 hover:text-ink transition-colors cursor-pointer shrink-0 -mr-1"
                  aria-label="Close enquiry modal"
                >
                  <X className="size-5" />
                </button>
              </Dialog.Close>
            </div>

            {state !== "success" && (
              /* 6-Step Progress Bar in Violet */
              <div
                className="mt-3.5 flex items-center gap-1 sm:gap-1.5"
                aria-label={`Step ${step + 1} of ${steps.length}`}
              >
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 sm:h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      i < step ? "bg-violet" : i === step ? "bg-royal shadow-xs" : "bg-border/70"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {state === "success" ? (
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 text-center animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center justify-center">
              <div className="mx-auto mb-3.5 flex size-12 sm:size-14 items-center justify-center rounded-full bg-violet text-ivory shadow-sm">
                <Check className="size-6 sm:size-7" />
              </div>
              <h2 className="font-display text-xl sm:text-2xl text-ink font-bold leading-tight">
                Enquiry Received Successfully!
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-sm mx-auto">
                Thank you, <strong className="text-ink">{form.parentName || "Parent"}</strong>. Our academic coordinator in Kharadi will connect with you via <strong className="text-violet">{form.preferred || "call"}</strong> shortly to schedule your counselling session.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full pt-4 border-t border-border/60">
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ink hover:bg-lavender/40 transition-colors shadow-2xs"
                >
                  <Phone className="size-3.5 text-violet" /> Direct Call: {site.phone}
                </a>
                <Button
                  className="w-full sm:w-auto rounded-xl font-bold uppercase tracking-wider text-xs px-6 py-2.5"
                  onClick={() => handleClose(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form
              className="flex flex-1 flex-col justify-between overflow-hidden"
              onSubmit={(e) => {
                e.preventDefault();
                if (step < steps.length - 1 && isValidStep) {
                  setStep(step + 1);
                } else if (step === steps.length - 1 && isValidStep) {
                  submit();
                }
              }}
            >
              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-5">
                {(() => {
                  const currentStepInfo = steps[step] ?? steps[0]!;
                  return (
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="eyebrow text-violet text-[10px]">
                          Step 0{step + 1} of 06
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground">
                          {currentStepInfo.title}
                        </span>
                      </div>

                      <h3 className="mt-1 font-display text-xl sm:text-2xl text-ink font-bold leading-tight">
                        {currentStepInfo.label}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {currentStepInfo.helper}
                      </p>
                    </div>
                  );
                })()}

                {/* Dynamic Step Content */}
                <div className="mt-4 sm:mt-5">
                  {step === 0 && (
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                      {[
                        { cls: "IX", label: "Class 9", sub: "Foundation Science" },
                        { cls: "X", label: "Class 10", sub: "Board Examination" },
                      ].map((item) => (
                        <button
                          key={item.cls}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, studentClass: item.cls as "IX" | "X" });
                          }}
                          className={`flex flex-col items-center justify-center rounded-xl p-3.5 sm:p-5 border-2 transition-all cursor-pointer select-none active:scale-[0.98] ${
                            form.studentClass === item.cls
                              ? "border-violet bg-violet text-ivory shadow-md ring-2 ring-violet/20"
                              : "border-border bg-white text-ink hover:border-violet/40 hover:bg-lavender/30"
                          }`}
                        >
                          <GraduationCap className={`size-5 sm:size-6 mb-1 ${form.studentClass === item.cls ? "text-lavender" : "text-violet"}`} />
                          <span className="font-display text-xl sm:text-2xl font-bold">Class {item.cls}</span>
                          <span className={`text-[10px] sm:text-[11px] font-medium mt-0.5 text-center ${form.studentClass === item.cls ? "text-ivory/85" : "text-muted-foreground"}`}>
                            {item.sub}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                      {[
                        { brd: "CBSE", sub: "NCERT & Exemplar Focus" },
                        { brd: "ICSE", sub: "In-depth Science Prep" },
                      ].map((item) => (
                        <button
                          key={item.brd}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, board: item.brd as "CBSE" | "ICSE" });
                          }}
                          className={`flex flex-col items-center justify-center rounded-xl p-3.5 sm:p-5 border-2 transition-all cursor-pointer select-none active:scale-[0.98] ${
                            form.board === item.brd
                              ? "border-violet bg-violet text-ivory shadow-md ring-2 ring-violet/20"
                              : "border-border bg-white text-ink hover:border-violet/40 hover:bg-lavender/30"
                          }`}
                        >
                          <School className={`size-5 sm:size-6 mb-1 ${form.board === item.brd ? "text-lavender" : "text-violet"}`} />
                          <span className="font-display text-xl sm:text-2xl font-bold">{item.brd}</span>
                          <span className={`text-[10px] sm:text-[11px] font-medium mt-0.5 text-center ${form.board === item.brd ? "text-ivory/85" : "text-muted-foreground"}`}>
                            {item.sub}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-ink/75">
                        Parent / Guardian Name
                      </label>
                      <input
                        autoFocus
                        type="text"
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-3 sm:px-4 sm:py-3.5 text-sm sm:text-base font-medium text-ink shadow-2xs outline-none focus:border-violet focus:ring-2 focus:ring-violet/15 transition-all placeholder:text-muted-foreground/60"
                        value={form.parentName}
                        onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                        placeholder="e.g. Rajesh Sharma"
                        autoComplete="name"
                        required
                      />
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                        Please provide the name of the parent or guardian.
                      </p>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-ink/75">
                        10-Digit Mobile Number
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 sm:left-3.5 flex items-center gap-1 text-xs font-bold text-ink/70 border-r border-border pr-2 sm:pr-2.5 pointer-events-none select-none">
                          🇮🇳 +91
                        </span>
                        <input
                          autoFocus
                          type="tel"
                          className="w-full rounded-xl border border-border bg-white pl-18 sm:pl-20 pr-3.5 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-ink shadow-2xs outline-none focus:border-violet focus:ring-2 focus:ring-violet/15 transition-all placeholder:text-muted-foreground/60"
                          value={form.mobile}
                          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                          placeholder="98230 12345"
                          inputMode="tel"
                          autoComplete="tel"
                          required
                        />
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                        We will send counseling schedule and confirmation to this number.
                      </p>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-ink/75">
                          Email Address
                        </label>
                        <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground bg-lavender/60 px-2 py-0.5 rounded-full">
                          Optional
                        </span>
                      </div>
                      <input
                        autoFocus
                        type="email"
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-3 sm:px-4 sm:py-3.5 text-sm sm:text-base font-medium text-ink shadow-2xs outline-none focus:border-violet focus:ring-2 focus:ring-violet/15 transition-all placeholder:text-muted-foreground/60"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="parent@example.com"
                        autoComplete="email"
                      />
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                        Receive the detailed syllabus brochure and sample testing papers.
                      </p>
                    </div>
                  )}

                  {step === 5 && (
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                      {[
                        { pref: "Call", label: "Phone Call", desc: "Speak directly with mentor", icon: Phone },
                        { pref: "WhatsApp", label: "WhatsApp", desc: "Chat & syllabus via WhatsApp", icon: MessageSquare },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.pref}
                            type="button"
                            onClick={() =>
                              setForm({ ...form, preferred: item.pref as "Call" | "WhatsApp" })
                            }
                            className={`flex flex-col items-center justify-center rounded-xl p-3.5 sm:p-5 border-2 transition-all cursor-pointer select-none active:scale-[0.98] ${
                              form.preferred === item.pref
                                ? "border-violet bg-violet text-ivory shadow-md ring-2 ring-violet/20"
                                : "border-border bg-white text-ink hover:border-violet/40 hover:bg-lavender/30"
                            }`}
                          >
                            <Icon className={`size-5 sm:size-6 mb-1 ${form.preferred === item.pref ? "text-lavender" : "text-violet"}`} />
                            <span className="font-display text-lg sm:text-xl font-bold">{item.label}</span>
                            <span className={`text-[10px] sm:text-[11px] font-medium mt-0.5 text-center ${form.preferred === item.pref ? "text-ivory/85" : "text-muted-foreground"}`}>
                              {item.desc}
                            </span>
                          </button>
                        );
                      })}
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

              {/* Navigation Footer */}
              <div className="shrink-0 px-4 py-3 sm:px-5 sm:py-3.5 border-t border-border/60 bg-ivory/80 backdrop-blur-xs flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={step === 0}
                  onClick={() => setStep(step - 1)}
                  className={`text-xs sm:text-sm font-semibold h-9 sm:h-10 px-2 sm:px-3 ${step === 0 ? "invisible" : ""}`}
                >
                  <ArrowLeft className="mr-1 size-3.5 sm:size-4" /> Back
                </Button>

                <Button
                  type="submit"
                  disabled={!isValidStep || state === "loading"}
                  className="min-w-[130px] sm:min-w-[150px] h-9 sm:h-10 text-xs sm:text-sm shadow-sm font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  {state === "loading"
                    ? "Submitting…"
                    : step === steps.length - 1
                      ? "Submit Request"
                      : "Continue"}
                  {step < steps.length - 1 && <ArrowRight className="ml-1.5 size-3.5 sm:size-4" />}
                </Button>
              </div>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

