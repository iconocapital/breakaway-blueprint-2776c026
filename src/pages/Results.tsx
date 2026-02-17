import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Download, ArrowRight, AlertTriangle } from "lucide-react";
import { calculateTotalScore, calculateSectionResults, getTierInfo, getScoreColor, getWeakestSections, getPrimaryGap } from "@/lib/scoring";
import { benchmarks } from "@/data/questions";
import { useRef, useCallback, useEffect } from "react";

const Results = () => {
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);
  const answersRaw = sessionStorage.getItem("bb_answers");

  const handleDownloadPDF = useCallback(async () => {
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: "#FAFAF8", useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= 297;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }
    pdf.save("Breakaway-Blueprint-Results.pdf");
  }, []);

  useEffect(() => {
    if (!answersRaw) navigate("/assessment");
  }, [answersRaw, navigate]);

  if (!answersRaw) return null;

  const answers: Record<string, number> = JSON.parse(answersRaw);
  const totalPct = calculateTotalScore(answers);
  const tier = getTierInfo(totalPct);
  const sectionResults = calculateSectionResults(answers);
  const weakest = getWeakestSections(sectionResults);
  const primaryGap = getPrimaryGap(sectionResults);

  const radarData = sectionResults.map((s) => ({
    dimension: s.label.length > 15 ? s.label.slice(0, 15) + "…" : s.label,
    score: s.percentage,
    benchmark: benchmarks[s.id] || 50,
  }));

  const comparisonData = sectionResults.map((s) => ({
    name: s.label.length > 12 ? s.label.slice(0, 12) + "…" : s.label,
    yours: s.percentage,
    average: benchmarks[s.id] || 50,
  }));

  const gaugeOffset = 440 - (440 * totalPct) / 100;

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-4 border-b sticky top-0 bg-background/85 backdrop-blur-xl z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-sm bg-accent rotate-45" />
            <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Breakaway Blueprint™
            </span>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border rounded-lg px-3 py-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            PDF
          </button>
        </div>
      </header>

      <main className="px-6 py-12 max-w-3xl mx-auto" ref={reportRef}>
        {/* Overall Score Gauge */}
        <motion.section custom={0} variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="70" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
              <circle
                cx="90" cy="90" r="70" fill="none"
                stroke={getScoreColor(totalPct)}
                strokeWidth="8"
                strokeDasharray="440"
                strokeDashoffset={gaugeOffset}
                strokeLinecap="round"
                transform="rotate(-90 90 90)"
                style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-semibold" style={{ color: getScoreColor(totalPct) }}>
                {totalPct}
              </span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-normal mb-2" style={{ fontFamily: "var(--font-display)" }}>
            {tier.tier}
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {tier.description}
          </p>
        </motion.section>

        {/* Radar Chart */}
        <motion.section custom={1} variants={fadeUp} initial="hidden" animate="visible" className="mb-16">
          <h2 className="text-lg font-normal mb-6 text-center" style={{ fontFamily: "var(--font-display)" }}>
            Performance Overview
          </h2>
          <div className="bg-card border rounded-xl p-4 shadow-sm">
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Your Score" dataKey="score" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Avg Advisor" dataKey="benchmark" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-accent rounded inline-block" /> Your Score</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-muted-foreground/40 rounded inline-block" /> Avg Advisor</span>
            </div>
          </div>
        </motion.section>

        {/* Dimension Breakdown */}
        <motion.section custom={2} variants={fadeUp} initial="hidden" animate="visible" className="mb-16">
          <h2 className="text-lg font-normal mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Dimension Breakdown
          </h2>
          <div className="space-y-4">
            {sectionResults.map((s) => (
              <div key={s.id} className="bg-card border rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">{s.label}</h3>
                  <span className="text-sm font-semibold" style={{ color: getScoreColor(s.percentage) }}>
                    {s.percentage}%
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: getScoreColor(s.percentage) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.percentage}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.recommendation}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Comparison Benchmarks */}
        <motion.section custom={3} variants={fadeUp} initial="hidden" animate="visible" className="mb-16">
          <h2 className="text-lg font-normal mb-6" style={{ fontFamily: "var(--font-display)" }}>
            How You Compare
          </h2>
          <div className="bg-card border rounded-xl p-4 shadow-sm">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={100} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="yours" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} barSize={12} name="Your Score" />
                <Bar dataKey="average" fill="hsl(var(--border))" radius={[0, 4, 4, 0]} barSize={12} name="Avg Advisor" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* Primary Gap */}
        <motion.section custom={4} variants={fadeUp} initial="hidden" animate="visible" className="mb-16">
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold mb-1">Primary Gap: {primaryGap.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your single biggest vulnerability at <strong>{primaryGap.percentage}%</strong>. {primaryGap.recommendation}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 90-Day Priority Roadmap */}
        <motion.section custom={5} variants={fadeUp} initial="hidden" animate="visible" className="mb-16">
          <h2 className="text-lg font-normal mb-6" style={{ fontFamily: "var(--font-display)" }}>
            90-Day Priority Roadmap
          </h2>
          <div className="space-y-3">
            {weakest.map((s, i) => (
              <div key={s.id} className="bg-card border rounded-xl p-5 shadow-sm flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-sm font-semibold">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-sm font-semibold mb-1">{s.label} — {s.percentage}%</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section custom={6} variants={fadeUp} initial="hidden" animate="visible" className="text-center pb-16">
          <div className="bg-card border rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-normal mb-2" style={{ fontFamily: "var(--font-display)" }}>
              {tier.heading}
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              {tier.description}
            </p>
            <a
              href={tier.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            >
              {tier.cta}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Results;
