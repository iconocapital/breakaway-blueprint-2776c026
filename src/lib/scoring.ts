import { sections, questions, MAX_SCORE, type SectionData } from "@/data/questions";

export interface SectionResult {
  id: string;
  label: string;
  earned: number;
  maxScore: number;
  percentage: number;
  recommendation: string;
}

export interface TierInfo {
  tier: string;
  heading: string;
  description: string;
  cta: string;
  ctaUrl: string;
}

export function calculateSectionResults(answers: Record<string, number>): SectionResult[] {
  return sections.map((s) => {
    const earned = s.questionIds.reduce((a, id) => a + (answers[id] || 0), 0);
    const percentage = Math.round((earned / s.maxScore) * 100);
    const recommendation = percentage >= 70 ? s.recommendations.high : percentage >= 40 ? s.recommendations.mid : s.recommendations.low;
    return { id: s.id, label: s.label, earned, maxScore: s.maxScore, percentage, recommendation };
  });
}

export function calculateTotalScore(answers: Record<string, number>): number {
  const total = Object.values(answers).reduce((a, b) => a + b, 0);
  return Math.round((total / MAX_SCORE) * 100);
}

export function getTierInfo(pct: number): TierInfo {
  if (pct >= 80) return { tier: "High Readiness", heading: "You are a strong candidate for the Breakaway Blueprint™.", description: "Your structural, financial, psychological, and operational indicators align with advisors who successfully transition to independence. The data supports moving forward with a structured engagement.", cta: "Schedule Your Readiness Audit", ctaUrl: "https://iconocapital.com/contact" };
  if (pct >= 60) return { tier: "Moderate Readiness", heading: "Strong fundamentals — with specific gaps to close.", description: "Your profile shows meaningful alignment with independence, but targeted areas need strengthening before a transition would be structurally sound.", cta: "Explore Preparation Pathways", ctaUrl: "https://iconocapital.com/contact" };
  if (pct >= 40) return { tier: "Early Stage", heading: "Independence is plausible — but not imminent.", description: "Several foundational areas require development. This isn't a disqualification — it's a diagnosis. With focused preparation, many advisors in this range reach full readiness within 12–18 months.", cta: "Request a Diagnostic Call", ctaUrl: "https://iconocapital.com/contact" };
  return { tier: "Not Yet Ready", heading: "Independence is not the right move right now.", description: "Your current profile suggests significant structural and personal risk. This assessment is designed to protect you. The action items below will get you moving in the right direction.", cta: "Get the Preparation Playbook", ctaUrl: "https://iconocapital.com/contact" };
}

export function getScoreColor(pct: number): string {
  if (pct >= 70) return "hsl(var(--score-green))";
  if (pct >= 45) return "hsl(var(--score-yellow))";
  if (pct >= 25) return "hsl(var(--score-orange))";
  return "hsl(var(--score-red))";
}

export function getScoreColorClass(pct: number): string {
  if (pct >= 70) return "text-[hsl(var(--score-green))]";
  if (pct >= 45) return "text-[hsl(var(--score-yellow))]";
  if (pct >= 25) return "text-[hsl(var(--score-orange))]";
  return "text-[hsl(var(--score-red))]";
}

export function getScoreBgClass(pct: number): string {
  if (pct >= 70) return "bg-[hsl(var(--score-green))]";
  if (pct >= 45) return "bg-[hsl(var(--score-yellow))]";
  if (pct >= 25) return "bg-[hsl(var(--score-orange))]";
  return "bg-[hsl(var(--score-red))]";
}

export function getWeakestSections(sectionResults: SectionResult[], count = 3): SectionResult[] {
  return [...sectionResults].sort((a, b) => a.percentage - b.percentage).slice(0, count);
}

export function getPrimaryGap(sectionResults: SectionResult[]): SectionResult {
  return [...sectionResults].sort((a, b) => a.percentage - b.percentage)[0];
}
