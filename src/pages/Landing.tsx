import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Target, Route, AlertTriangle } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  const features = [
    { icon: BarChart3, title: "Readiness score across 9 dimensions", desc: "Calibrated against institutional valuation benchmarks — Transition Risk, Cash Flow Quality, concentration risk, and more." },
    { icon: Target, title: "Per-section action items", desc: "Tied to the same KPIs that drive open-market practice valuations — recurring revenue mix, concentration risk, expense drag, and more." },
    { icon: AlertTriangle, title: "Primary gap identification", desc: "Your single biggest vulnerability mapped to the Transition Risk, Cash Flow Quality, or Business Continuity Risk frameworks." },
    { icon: Route, title: "90-day priority roadmap", desc: "The three highest-leverage actions for your specific situation, sequenced by valuation impact." },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b">
        <div className="max-w-4xl mx-auto flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-sm bg-accent rotate-45" />
          <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Breakaway Blueprint™
          </span>
        </div>
      </header>

      <main className="px-6">
        {/* Hero */}
        <section className="max-w-2xl mx-auto pt-16 pb-20 text-center">
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" animate="visible"
            className="inline-block bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full text-xs font-medium text-accent mb-8"
          >
            $349 Diagnostic Assessment
          </motion.div>

          <motion.h1
            custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-3xl md:text-5xl font-normal leading-tight mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Is independence the right move — or the right move{" "}
            <em className="not-italic" style={{ fontStyle: "italic" }}>right now</em>?
          </motion.h1>

          <motion.p
            custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-4"
          >
            The Breakaway Blueprint™ is a 42-question diagnostic built on the same valuation KPIs used in institutional-grade practice valuations — Transition Risk, Cash Flow Quality, and Market Demand.
          </motion.p>

          <motion.p
            custom={3} variants={fadeUp} initial="hidden" animate="visible"
            className="text-sm text-muted-foreground/70 mb-10"
          >
            42 questions · 10–15 minutes · Results you can act on immediately
          </motion.p>

          <motion.button
            custom={4} variants={fadeUp} initial="hidden" animate="visible"
            onClick={() => navigate("/assessment")}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-lg font-medium text-base hover:opacity-90 transition-opacity"
          >
            Start Assessment — $349
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </section>

        {/* Features */}
        <section className="max-w-2xl mx-auto pb-20">
          <motion.h2
            custom={5} variants={fadeUp} initial="hidden" animate="visible"
            className="text-center text-xl md:text-2xl font-normal mb-10"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What you'll receive
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                custom={6 + i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="bg-card border rounded-xl p-5 shadow-sm"
              >
                <f.icon className="w-5 h-5 text-accent mb-3" />
                <h3 className="text-sm font-semibold mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Consultants */}
        <section className="max-w-2xl mx-auto pb-20">
          <motion.h2
            custom={10} variants={fadeUp} initial="hidden" animate="visible"
            className="text-center text-xl md:text-2xl font-normal mb-10"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Built by advisors who've done it
          </motion.h2>

          <div className="space-y-4">
            <motion.div custom={11} variants={fadeUp} initial="hidden" animate="visible" className="bg-card border rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-0.5">Christopher Haigh</h3>
              <p className="text-xs text-accent font-medium mb-3">CFP® · RICP® · ChFC® · DACFP</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                RIA firm owner featured on Michael Kitces' Financial Advisor Success. Broke away from Northwestern Mutual in 2020 after 8 years as a Wealth Management Advisor — preceded by Top 10 intern and Top 10 first-year advisor recognition.
              </p>
            </motion.div>

            <motion.div custom={12} variants={fadeUp} initial="hidden" animate="visible" className="bg-card border rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-0.5">Jonathan Sheldon</h3>
              <p className="text-xs text-accent font-medium mb-3">CPC · ICF ACC · Darren Hardy BMC</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Owner of Belleau Wood Coaching — specializing in helping great salespeople become CEOs, busy people find balance, and teams operate in radical honesty. Former Northwestern Mutual Top 10 Intern and Guardian Brokerage Leader. EOS and 12 Week Year practitioner.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="max-w-2xl mx-auto pb-20 text-center">
          <motion.button
            custom={13} variants={fadeUp} initial="hidden" animate="visible"
            onClick={() => navigate("/assessment")}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-lg font-medium text-base hover:opacity-90 transition-opacity"
          >
            Begin Assessment
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.p custom={14} variants={fadeUp} initial="hidden" animate="visible" className="text-xs text-muted-foreground/60 mt-4">
            Your results are delivered immediately. No obligation to engage further.
          </motion.p>
        </section>
      </main>
    </div>
  );
};

export default Landing;
