import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, BarChart3, FileDown, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";

const ADMIN_PASSWORD = "minitank";

const Payment = () => {
  const navigate = useNavigate();
  const [adminPass, setAdminPass] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminError, setAdminError] = useState(false);

  const hasAnswers = !!sessionStorage.getItem("bb_answers");

  if (!hasAnswers) {
    navigate("/assessment");
    return null;
  }

  const handlePayment = () => {
    navigate("/capture");
  };

  const handleAdminBypass = () => {
    if (adminPass === ADMIN_PASSWORD) {
      navigate("/capture");
    } else {
      setAdminError(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-4 border-b">
        <div className="max-w-4xl mx-auto flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-sm bg-accent rotate-45" />
          <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Breakaway Blueprint™
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-4">
              <Lock className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-2xl font-normal mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Unlock your full report
            </h1>
            <p className="text-sm text-muted-foreground">
              You've completed the assessment. Pay once to access your comprehensive results.
            </p>
          </div>

          <div className="bg-card border rounded-xl p-6 shadow-sm mb-6">
            <div className="text-center mb-6">
              <span className="text-4xl font-semibold">$349</span>
              <span className="text-muted-foreground text-sm ml-1">one-time</span>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { icon: BarChart3, text: "Readiness scores across all 9 dimensions with visual charts" },
                { icon: TrendingUp, text: "Comparison benchmarks against average advisor baselines" },
                { icon: FileDown, text: "Downloadable branded PDF report" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <item.icon className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handlePayment}
              className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Continue to Payment — $349
            </button>
          </div>

          {/* Admin bypass */}
          <div className="mt-8 text-center">
            {!showAdmin ? (
              <button
                onClick={() => setShowAdmin(true)}
                className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                Admin access
              </button>
            ) : (
              <div className="flex gap-2 max-w-xs mx-auto">
                <Input
                  type="password"
                  placeholder="Admin password"
                  value={adminPass}
                  onChange={(e) => { setAdminPass(e.target.value); setAdminError(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handleAdminBypass()}
                  className={`text-sm ${adminError ? "border-destructive" : ""}`}
                />
                <button
                  onClick={handleAdminBypass}
                  className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  Go
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Payment;
