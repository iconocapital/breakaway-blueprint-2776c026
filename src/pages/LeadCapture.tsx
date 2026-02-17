import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { questions } from "@/data/questions";
import { calculateTotalScore, calculateSectionResults, getTierInfo } from "@/lib/scoring";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().max(30).optional(),
  firm: z.string().max(200).optional(),
});

const LeadCapture = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", firm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const answersRaw = sessionStorage.getItem("bb_answers");
  const selectionsRaw = sessionStorage.getItem("bb_selections");
  const slidersRaw = sessionStorage.getItem("bb_sliders");

  if (!answersRaw) {
    navigate("/assessment");
    return null;
  }

  const answers: Record<string, number> = JSON.parse(answersRaw);
  const selections: Record<string, number> = selectionsRaw ? JSON.parse(selectionsRaw) : {};
  const sliders: Record<string, number> = slidersRaw ? JSON.parse(slidersRaw) : {};
  const totalPct = calculateTotalScore(answers);
  const tier = getTierInfo(totalPct);
  const sectionResults = calculateSectionResults(answers);

  const buildSummary = () => {
    const lines = questions.map((q) => {
      if (q.type === "slider") return `${q.text}: ${sliders[q.id] ?? "N/A"}/10`;
      const idx = selections[q.id];
      return `${q.text}: ${idx !== undefined ? q.options[idx].label : "N/A"}`;
    });
    lines.push("");
    lines.push(`SCORE: ${totalPct}/100 (${tier.tier})`);
    sectionResults.forEach((s) => lines.push(`${s.label}: ${s.percentage}%`));
    return lines.join("\n");
  };

  const handleSubmit = async () => {
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    setSubmitError("");

    // Store lead info for results page
    sessionStorage.setItem("bb_lead", JSON.stringify(form));

    // Send email notification via edge function
    try {
      const { error } = await supabase.functions.invoke("send-lead-notification", {
        body: {
          name: form.name,
          email: form.email,
          phone: form.phone || "—",
          firm: form.firm || "—",
          score: `${totalPct}/100`,
          tier: tier.tier,
          answers: buildSummary(),
        },
      });
      if (error) console.error("Email notification error:", error);
    } catch (e) {
      console.error("Failed to send notification:", e);
    }

    // Navigate to results regardless of email success
    navigate("/results");
    setSubmitting(false);
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
            <h1 className="text-2xl font-normal mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Where should we send your results?
            </h1>
            <p className="text-sm text-muted-foreground">
              We'll deliver your full report immediately and keep a copy for your records.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Email *</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Phone <span className="text-muted-foreground font-normal">(optional)</span></label>
              <Input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Firm <span className="text-muted-foreground font-normal">(optional)</span></label>
              <Input
                value={form.firm}
                onChange={(e) => setForm({ ...form, firm: e.target.value })}
                placeholder="Your firm or company name"
              />
            </div>

            {submitError && (
              <p className="text-sm text-destructive text-center">{submitError}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Sending..." : "View My Results"}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default LeadCapture;
