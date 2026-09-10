import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Lock, Mail, User, X, CheckCircle2, AlertCircle, Sparkles, LogOut, ShieldCheck } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

export function AuthDialog({
  open,
  onOpenChange,
  defaultMode = "signup",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: "signup" | "login";
}) {
  const [mode, setMode] = useState<"signup" | "login">(defaultMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "parent">("student");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setMode(defaultMode);
    setErrorMessage("");
    setSuccessMessage("");
  }, [defaultMode, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    if (!isSupabaseConfigured) {
      setErrorMessage("Supabase is not connected yet. Please connect Supabase in Lovable Cloud to enable account sign up & log in.");
      setLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        const { error, data } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: fullName.trim(),
              user_role: role,
            },
          },
        });

        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage(
            data.session
              ? "Account created and logged in successfully!"
              : "Account created! Please check your email to confirm your registration."
          );
          setTimeout(() => {
            if (data.session) onOpenChange(false);
          }, 2000);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage("Logged in successfully! Welcome back.");
          setTimeout(() => {
            onOpenChange(false);
          }, 1200);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-violet/20 bg-white p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
          
          {/* Header Bar */}
          <div className="flex items-start justify-between pb-4 border-b border-violet/10">
            <div className="flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-violet/10 text-violet shadow-2xs">
                <Sparkles className="size-5" />
              </div>
              <div>
                <Dialog.Title className="font-display text-lg sm:text-xl font-medium text-ink">
                  {mode === "signup" ? "Create Account" : "Welcome Back"}
                </Dialog.Title>
                <p className="text-xs text-muted-foreground font-normal">
                  {mode === "signup" ? "Register to access courses & study material" : "Sign in to your student or parent account"}
                </p>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-full p-1.5 text-muted-foreground hover:bg-lavender/60 hover:text-ink transition-colors cursor-pointer shrink-0 -mr-1"
                aria-label="Close dialog"
              >
                <X className="size-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mt-5 grid grid-cols-2 rounded-xl bg-lavender/50 p-1 text-xs font-medium border border-violet/10">
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                handleReset();
              }}
              className={`rounded-lg py-2 text-center transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-violet text-ivory font-semibold shadow-xs"
                  : "text-ink/75 hover:text-violet"
              }`}
            >
              Sign Up (First Time)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                handleReset();
              }}
              className={`rounded-lg py-2 text-center transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-violet text-ivory font-semibold shadow-xs"
                  : "text-ink/75 hover:text-violet"
              }`}
            >
              Log In (Account Available)
            </button>
          </div>

          {/* Error & Success Messages */}
          {errorMessage && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200 font-normal">
              <AlertCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200 font-normal">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {mode === "signup" && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-ink/80">Full Name</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Varsha Joshi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm font-normal text-ink outline-none focus:border-violet focus:ring-2 focus:ring-violet/15 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-ink/80">Account Type</label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-normal">
                    <button
                      type="button"
                      onClick={() => setRole("student")}
                      className={`rounded-xl border py-2 px-3 text-center transition-all cursor-pointer ${
                        role === "student"
                          ? "border-violet bg-violet/10 text-violet font-semibold"
                          : "border-border bg-white text-ink/75 hover:bg-lavender/30"
                      }`}
                    >
                      🎓 Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("parent")}
                      className={`rounded-xl border py-2 px-3 text-center transition-all cursor-pointer ${
                        role === "parent"
                          ? "border-violet bg-violet/10 text-violet font-semibold"
                          : "border-border bg-white text-ink/75 hover:bg-lavender/30"
                      }`}
                    >
                      👪 Parent
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-ink/80">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm font-normal text-ink outline-none focus:border-violet focus:ring-2 focus:ring-violet/15 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-ink/80">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm font-normal text-ink outline-none focus:border-violet focus:ring-2 focus:ring-violet/15 transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-violet hover:bg-violet/90 text-ivory h-11 text-xs font-medium uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                "Processing..."
              ) : mode === "signup" ? (
                <>
                  Create Account <ArrowRight className="size-4" />
                </>
              ) : (
                <>
                  Log In Now <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle Hint */}
          <div className="mt-5 pt-4 border-t border-violet/10 text-center text-xs text-muted-foreground font-normal">
            {mode === "signup" ? (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    handleReset();
                  }}
                  className="font-medium text-violet hover:underline cursor-pointer"
                >
                  Log In here →
                </button>
              </p>
            ) : (
              <p>
                Don't have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    handleReset();
                  }}
                  className="font-medium text-violet hover:underline cursor-pointer"
                >
                  Sign Up first →
                </button>
              </p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
