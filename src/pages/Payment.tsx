import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, BarChart3, FileDown, TrendingUp } from "lucide-react";

const Payment = () => {
  const navigate = useNavigate();

  // Check if assessment was completed
  const hasAnswers = !!sessionStorage.getItem("bb_answers");

  if (!hasAnswers) {
    navigate("/assessment");
    return null;
  }

  // For now, skip payment and go directly to lead capture
  // Stripe integration will be added later
  const handlePayment = () => {
    navigate("/capture");
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

          <p className="text-center text-xs text-muted-foreground/60">
            Secure payment powered by Stripe. Your data is encrypted and never shared.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Payment;
