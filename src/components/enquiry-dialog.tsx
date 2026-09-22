import { useState, useRef, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Phone,
  MessageSquare,
  Sparkles,
  X,
  GraduationCap,
  School,
  User,
  Mail,
  Smartphone,
  CheckCircle2,
  Loader2,
} from "lucide-react";
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
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  const isValidStep = [
    !!form.studentClass,
    !!form.board,
    form.parentName.trim().length >= 2,
    /^[0-9+ ()-]{10,15}$/.test(form.mobile.trim()),
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) || form.email.trim().length === 0,
    !!form.preferred,
  ][step];

  const handleChoiceSelect = (key: keyof FormData, value: string, nextStep: number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    autoAdvanceTimer.current = setTimeout(() => {
      if (nextStep < steps.length) {
        setStep(nextStep);
      }
    }, 220);
  };

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
      try {
        localStorage.setItem("joshis_enquiry_popup_shown_v1", "true");
      } catch (e) {}
      setState("success");
    } catch (err) {
      console.error("Enquiry submission notice:", err);
      try {
        localStorage.setItem("joshis_enquiry_popup_shown_v1", "true");
      } catch (e) {}
      setState("success");
    }
  }

  function handleClose(next: boolean) {
    onOpenChange(next);
    if (!next) {
      try {
        localStorage.setItem("joshis_enquiry_popup_shown_v1", "true");
      } catch (e) {}
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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 transition-all duration-300" />

        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[94vw] max-w-[490px] max-h-[92dvh] sm:max-h-[88vh] flex flex-col rounded-3xl border border-border/90 bg-ivory text-ink shadow-2xl transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200 overflow-hidden outline-none">
          {/* Header */}
          <div className="shrink-0 p-4 sm:p-5 pb-3.5 sm:pb-4 border-b border-border/60 bg-ivory/95 backdrop-blur-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative size-10 sm:size-11 shrink-0 rounded-full bg-white p-0.5 shadow-xs border border-border/80">
                  <img
                    src="/brand/logo.png"
                    alt={`${site.name} Seal`}
                    width={44}
                    height={44}
                    className="size-full object-contain rounded-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet/10 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-violet border border-violet/15">
                      <Sparkles className="size-2.5 sm:size-3 text-violet shrink-0" />
                      Free Academic Counselling
                    </span>
                  </div>
                  <Dialog.Title className="text-sm sm:text-base text-ink font-semibold leading-tight tracking-tight truncate">
                    Start your child's journey to success
                  </Dialog.Title>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground font-normal truncate mt-0.5">
                    {site.name} • {site.location}
                  </p>
                </div>
              </div>

              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-lavender hover:text-ink transition-colors cursor-pointer shrink-0 -mr-1 -mt-1"
                  aria-label="Close enquiry modal"
                >
                  <X className="size-4 sm:size-5" />
                </button>
              </Dialog.Close>
            </div>

            {state !== "success" && (
              /* Step Progress Bar & Count */
              <div className="mt-3.5 sm:mt-4">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  <span className="text-violet font-bold">
                    Step {step + 1}{" "}
                    <span className="text-muted-foreground/60 font-normal">of {steps.length}</span>
                  </span>
                  <span className="font-medium text-ink/80">{steps[step]?.title}</span>
                </div>
                <div
                  className="flex items-center gap-1.5"
                  aria-label={`Step ${step + 1} of ${steps.length}`}
                >
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        i < step
                          ? "bg-violet"
                          : i === step
                            ? "bg-violet shadow-xs ring-2 ring-violet/20"
                            : "bg-border/70"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Body Content */}
          {state === "success" ? (
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-center animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center justify-center">
              <div className="mx-auto mb-4 flex size-14 sm:size-16 items-center justify-center rounded-full bg-violet text-ivory shadow-md ring-8 ring-violet/10">
                <Check className="size-7 sm:size-8 stroke-[2.5]" />
              </div>
              <h2 className="text-xl sm:text-2xl text-ink font-semibold leading-tight tracking-tight">
                Enquiry Received!
              </h2>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-sm mx-auto font-normal">
                Thank you,{" "}
                <span className="text-ink font-semibold">{form.parentName || "Parent"}</span>. Our
                academic coordinator in Kharadi will connect with you via{" "}
                <span className="text-violet font-semibold">{form.preferred || "call"}</span>{" "}
                shortly to schedule your free counselling session.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full pt-4 border-t border-border/60">
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border/80 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink hover:bg-lavender/50 transition-all shadow-2xs hover:shadow-xs"
                >
                  <Phone className="size-3.5 text-violet" /> Call: {site.phone}
                </a>
                <Button
                  className="w-full sm:w-auto rounded-xl font-semibold uppercase tracking-wider text-xs px-6 py-3 bg-violet hover:bg-royal text-ivory transition-all shadow-sm"
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
              <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6">
                {(() => {
                  const currentStepInfo = steps[step] ?? steps[0]!;
                  return (
                    <div className="animate-in fade-in duration-200">
                      <h3 className="text-lg sm:text-xl text-ink font-bold leading-tight tracking-tight">
                        {currentStepInfo.label}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground font-normal">
                        {currentStepInfo.helper}
                      </p>
                    </div>
                  );
                })()}

                {/* Form Inputs & Options */}
                <div className="mt-4 sm:mt-5 animate-in fade-in duration-200">
                  {step === 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                      {[
                        { cls: "IX", label: "Class 9", sub: "Foundation Science" },
                        { cls: "X", label: "Class 10", sub: "Board Examination" },
                      ].map((item) => {
                        const isSelected = form.studentClass === item.cls;
                        return (
                          <button
                            key={item.cls}
                            type="button"
                            onClick={() => handleChoiceSelect("studentClass", item.cls, 1)}
                            className={`relative flex flex-col items-center justify-center rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer select-none group ${
                              isSelected
                                ? "border-violet bg-violet text-ivory shadow-md ring-2 ring-violet/20"
                                : "border-border/80 bg-white text-ink hover:border-violet/40 hover:bg-lavender/30 shadow-2xs hover:shadow-xs"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-2.5 right-2.5 text-lavender">
                                <CheckCircle2 className="size-4 fill-lavender text-violet" />
                              </div>
                            )}
                            <div
                              className={`size-11 sm:size-12 rounded-full flex items-center justify-center mb-2.5 transition-all ${
                                isSelected
                                  ? "bg-white/15 text-ivory"
                                  : "bg-lavender/80 text-violet group-hover:bg-violet group-hover:text-ivory"
                              }`}
                            >
                              <GraduationCap className="size-5 sm:size-6" />
                            </div>
                            <span className="text-base sm:text-lg font-bold leading-none">
                              Class {item.cls}
                            </span>
                            <span
                              className={`text-[10px] sm:text-[11px] font-medium mt-1.5 text-center line-clamp-1 ${
                                isSelected ? "text-ivory/90" : "text-muted-foreground"
                              }`}
                            >
                              {item.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                      {[
                        { brd: "CBSE", sub: "NCERT & Exemplar Focus" },
                        { brd: "ICSE", sub: "In-depth Science Prep" },
                      ].map((item) => {
                        const isSelected = form.board === item.brd;
                        return (
                          <button
                            key={item.brd}
                            type="button"
                            onClick={() => handleChoiceSelect("board", item.brd, 2)}
                            className={`relative flex flex-col items-center justify-center rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer select-none group ${
                              isSelected
                                ? "border-violet bg-violet text-ivory shadow-md ring-2 ring-violet/20"
                                : "border-border/80 bg-white text-ink hover:border-violet/40 hover:bg-lavender/30 shadow-2xs hover:shadow-xs"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-2.5 right-2.5 text-lavender">
                                <CheckCircle2 className="size-4 fill-lavender text-violet" />
                              </div>
                            )}
                            <div
                              className={`size-11 sm:size-12 rounded-full flex items-center justify-center mb-2.5 transition-all ${
                                isSelected
                                  ? "bg-white/15 text-ivory"
                                  : "bg-lavender/80 text-violet group-hover:bg-violet group-hover:text-ivory"
                              }`}
                            >
                              <School className="size-5 sm:size-6" />
                            </div>
                            <span className="text-base sm:text-lg font-bold leading-none">
                              {item.brd}
                            </span>
                            <span
                              className={`text-[10px] sm:text-[11px] font-medium mt-1.5 text-center line-clamp-1 ${
                                isSelected ? "text-ivory/90" : "text-muted-foreground"
                              }`}
                            >
                              {item.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-2">
                      <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-ink/80">
                        Parent / Guardian Name
                      </label>
                      <div className="relative flex items-center">
                        <User className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                        <input
                          autoFocus
                          type="text"
                          className="w-full rounded-xl border border-border/90 bg-white pl-10 pr-3.5 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-ink shadow-2xs outline-none focus:border-violet focus:ring-2 focus:ring-violet/15 transition-all placeholder:text-muted-foreground/50 placeholder:font-normal"
                          value={form.parentName}
                          onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                          placeholder="e.g. Rajesh Sharma"
                          autoComplete="name"
                          required
                        />
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground font-normal">
                        Please provide full name of the parent or legal guardian.
                      </p>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-2">
                      <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-ink/80">
                        10-Digit Mobile Number
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 flex items-center gap-1 text-xs font-semibold text-ink/75 border-r border-border/80 pr-2.5 pointer-events-none select-none">
                          🇮🇳 +91
                        </span>
                        <input
                          autoFocus
                          type="tel"
                          className="w-full rounded-xl border border-border/90 bg-white pl-20 pr-3.5 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-ink shadow-2xs outline-none focus:border-violet focus:ring-2 focus:ring-violet/15 transition-all placeholder:text-muted-foreground/50 placeholder:font-normal"
                          value={form.mobile}
                          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                          placeholder="98230 12345"
                          inputMode="tel"
                          autoComplete="tel"
                          required
                        />
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground font-normal">
                        We will send counselling timing and syllabus details to this mobile number.
                      </p>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-ink/80">
                          Email Address
                        </label>
                        <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-lavender/80 px-2 py-0.5 rounded-full">
                          Optional
                        </span>
                      </div>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                        <input
                          autoFocus
                          type="email"
                          className="w-full rounded-xl border border-border/90 bg-white pl-10 pr-3.5 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-ink shadow-2xs outline-none focus:border-violet focus:ring-2 focus:ring-violet/15 transition-all placeholder:text-muted-foreground/50 placeholder:font-normal"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="parent@example.com"
                          autoComplete="email"
                        />
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground font-normal">
                        Receive official course brochures and fee structures via email.
                      </p>
                    </div>
                  )}

                  {step === 5 && (
                    <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                      {[
                        {
                          pref: "Call",
                          label: "Phone Call",
                          desc: "Direct mentor phone call",
                          icon: Phone,
                        },
                        {
                          pref: "WhatsApp",
                          label: "WhatsApp",
                          desc: "Chat & brochure on WhatsApp",
                          icon: MessageSquare,
                        },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = form.preferred === item.pref;
                        return (
                          <button
                            key={item.pref}
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                preferred: item.pref as "Call" | "WhatsApp",
                              }))
                            }
                            className={`relative flex flex-col items-center justify-center rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer select-none group ${
                              isSelected
                                ? "border-violet bg-violet text-ivory shadow-md ring-2 ring-violet/20"
                                : "border-border/80 bg-white text-ink hover:border-violet/40 hover:bg-lavender/30 shadow-2xs hover:shadow-xs"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-2.5 right-2.5 text-lavender">
                                <CheckCircle2 className="size-4 fill-lavender text-violet" />
                              </div>
                            )}
                            <div
                              className={`size-11 sm:size-12 rounded-full flex items-center justify-center mb-2.5 transition-all ${
                                isSelected
                                  ? "bg-white/15 text-ivory"
                                  : "bg-lavender/80 text-violet group-hover:bg-violet group-hover:text-ivory"
                              }`}
                            >
                              <Icon className="size-5 sm:size-6" />
                            </div>
                            <span className="text-base sm:text-lg font-bold leading-none">
                              {item.label}
                            </span>
                            <span
                              className={`text-[10px] sm:text-[11px] font-medium mt-1.5 text-center line-clamp-1 ${
                                isSelected ? "text-ivory/90" : "text-muted-foreground"
                              }`}
                            >
                              {item.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Honeypot */}
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
              <div className="shrink-0 px-4 py-3 sm:px-5 sm:py-3.5 border-t border-border/60 bg-ivory/95 backdrop-blur-xs flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={step === 0}
                  onClick={() => setStep(step - 1)}
                  className={`text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-ink hover:bg-lavender/60 h-10 px-3 rounded-xl transition-all ${
                    step === 0 ? "invisible" : ""
                  }`}
                >
                  <ArrowLeft className="mr-1.5 size-3.5" /> Back
                </Button>

                <Button
                  type="submit"
                  disabled={!isValidStep || state === "loading"}
                  className={`min-w-[135px] sm:min-w-[155px] h-10.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
                    isValidStep
                      ? "bg-violet hover:bg-royal text-ivory shadow-violet/20 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
                      : "bg-border/60 text-muted-foreground/70 cursor-not-allowed border border-border/40"
                  }`}
                >
                  {state === "loading" ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-ivory" />
                      Submitting…
                    </>
                  ) : step === steps.length - 1 ? (
                    <>
                      Submit Request
                      <Check className="size-4 stroke-[2.5]" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="size-4 stroke-[2.5]" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
