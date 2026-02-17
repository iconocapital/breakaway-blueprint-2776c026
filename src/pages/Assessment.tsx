import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { questions, TOTAL_QUESTIONS, type Question } from "@/data/questions";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, CornerDownLeft } from "lucide-react";

const Assessment = () => {
  const navigate = useNavigate();
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const q = questions[qi];
  const progress = ((qi + 1) / TOTAL_QUESTIONS) * 100;

  const goNext = useCallback(() => {
    if (qi < TOTAL_QUESTIONS - 1) {
      setDirection(1);
      setQi((i) => i + 1);
    } else {
      // Store answers in sessionStorage and navigate to payment
      sessionStorage.setItem("bb_answers", JSON.stringify(answers));
      sessionStorage.setItem("bb_selections", JSON.stringify(selections));
      sessionStorage.setItem("bb_sliders", JSON.stringify(sliderValues));
      navigate("/payment");
    }
  }, [qi, answers, selections, sliderValues, navigate]);

  const goPrev = useCallback(() => {
    if (qi > 0) {
      setDirection(-1);
      setQi((i) => i - 1);
    } else {
      navigate("/");
    }
  }, [qi, navigate]);

  const pick = useCallback(
    (optionIndex: number) => {
      const question = questions[qi];
      if (question.type !== "single") return;
      setSelections((p) => ({ ...p, [question.id]: optionIndex }));
      setAnswers((p) => ({ ...p, [question.id]: question.options[optionIndex].score }));
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => goNext(), 400);
    },
    [qi, goNext]
  );

  const handleSlider = (value: number[]) => {
    const v = value[0];
    const question = q as Extract<Question, { type: "slider" }>;
    setSliderValues((p) => ({ ...p, [q.id]: v }));
    setAnswers((p) => ({ ...p, [q.id]: Math.round(v * question.multiplier) }));
  };

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const question = questions[qi];
      if (question.type === "single") {
        const n = parseInt(e.key);
        if (n >= 1 && n <= question.options.length) {
          pick(n - 1);
          return;
        }
      }
      if (e.key === "Enter" && answers[question.id] !== undefined) {
        if (timerRef.current) clearTimeout(timerRef.current);
        goNext();
      }
      if (e.key === "Backspace" || e.key === "ArrowLeft") {
        if (timerRef.current) clearTimeout(timerRef.current);
        goPrev();
      }
    },
    [qi, answers, pick, goNext, goPrev]
  );

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/85 backdrop-blur-xl px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-sm bg-accent rotate-45" />
            <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Breakaway Blueprint™
            </span>
          </div>
          <span className="text-sm text-muted-foreground tabular-nums font-medium">
            {qi + 1} / {TOTAL_QUESTIONS}
          </span>
        </div>
        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mt-3">
          <div className="h-0.5 w-full bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={qi}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Section label */}
              <p className="text-xs font-semibold tracking-widest text-accent uppercase mb-4">
                {q.section}
              </p>

              {/* Question */}
              <h2 className="font-[var(--font-display)] text-xl md:text-2xl font-normal leading-snug mb-2" style={{ fontFamily: "var(--font-display)" }}>
                {q.text}
              </h2>
              {q.subtitle && (
                <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                  {q.subtitle}
                </p>
              )}
              {!q.subtitle && <div className="mb-8" />}

              {/* Options */}
              {q.type === "single" && (
                <div className="space-y-3">
                  {q.options.map((opt, i) => {
                    const isSelected = selections[q.id] === i;
                    return (
                      <motion.button
                        key={i}
                        onClick={() => pick(i)}
                        className={`w-full text-left rounded-lg border p-4 transition-all duration-200 flex items-start gap-3 group ${
                          isSelected
                            ? "border-accent bg-accent/5 shadow-sm"
                            : "border-border bg-card hover:border-accent/40 hover:shadow-sm"
                        }`}
                        whileTap={{ scale: 0.985 }}
                      >
                        <span className={`flex-shrink-0 mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded text-xs font-semibold border transition-colors ${
                          isSelected
                            ? "bg-accent text-accent-foreground border-accent"
                            : "bg-secondary text-muted-foreground border-border group-hover:border-accent/40"
                        }`}>
                          {i + 1}
                        </span>
                        <span className={`text-sm leading-relaxed ${isSelected ? "text-foreground font-medium" : "text-foreground"}`}>
                          {opt.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {q.type === "slider" && (
                <div className="space-y-6">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{q.min}</span>
                    <span className="text-2xl font-semibold text-foreground">
                      {sliderValues[q.id] ?? 5}
                    </span>
                    <span>{q.max}</span>
                  </div>
                  <Slider
                    min={q.min}
                    max={q.max}
                    step={1}
                    value={[sliderValues[q.id] ?? 5]}
                    onValueChange={handleSlider}
                  />
                  <button
                    onClick={goNext}
                    className="mt-4 w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
                  >
                    Continue
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation hints */}
          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={goPrev}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 bg-secondary border rounded text-[11px] font-semibold text-muted-foreground">1</kbd>
                –
                <kbd className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 bg-secondary border rounded text-[11px] font-semibold text-muted-foreground">{q.type === "single" ? q.options.length : q.max}</kbd>
                select
              </span>
              <span className="flex items-center gap-1">
                <CornerDownLeft className="w-3 h-3" />
                next
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Assessment;
