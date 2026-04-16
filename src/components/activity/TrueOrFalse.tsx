// src/components/activity/TrueOrFalse.tsx
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { Activity } from "@/types";
import { ActivityType } from "@/enums";
import { ActivityGameCard } from "@/components/game/ActivityGameCard";
import { useTrueOrFalse } from "@/hooks/useTrueOrFalse";

export interface TrueOrFalseProps {
    activity: Activity;
    onSubmit: (answer: boolean) => void;
}

export function TrueOrFalse({ activity, onSubmit }: TrueOrFalseProps) {
    const { selected, submitted, isCorrect, explanation, correctAnswer, handleSelect, handleContinue } =
        useTrueOrFalse(activity);

    const actions = (
        <AnimatePresence>
            {submitted && (
                <motion.button
                    key="continue"
                    onClick={() => handleContinue(onSubmit)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary text-primary-foreground py-4 font-display font-bold text-base hover:bg-primary/90 active:scale-[0.98] transition-all duration-150"
                >
                    Continuar <ChevronRight size={18} />
                </motion.button>
            )}
        </AnimatePresence>
    );

    return (
        <ActivityGameCard
            type={ActivityType.TRUE_OR_FALSE}
            title={activity.title}
            question={activity.instructions}
            actions={actions}
        >
            <p className="text-lg text-foreground font-semibold mb-4">
                {activity.instructions}
            </p>
            <div className="grid grid-cols-2 gap-4"></div>

            {/* Botões de resposta */}
            <div className="grid grid-cols-2 gap-4">
                {[
                    { value: true, label: "Verdadeiro", icon: "✅" },
                    { value: false, label: "Falso", icon: "❌" },
                ].map(({ value, label, icon }) => {
                    const isSelected = selected === value;
                    const isThisCorrect = value === correctAnswer;

                    let borderColor = "border-border";
                    let bgColor = "bg-card hover:bg-accent";
                    let textColor = "text-foreground";

                    if (submitted && isSelected) {
                        borderColor = isCorrect ? "border-success" : "border-destructive";
                        bgColor = isCorrect ? "bg-success/10" : "bg-destructive/10";
                        textColor = isCorrect ? "text-success" : "text-destructive";
                    } else if (submitted && isThisCorrect) {
                        borderColor = "border-success";
                        bgColor = "bg-success/10";
                        textColor = "text-success";
                    }

                    return (
                        <motion.button
                            key={String(value)}
                            onClick={() => handleSelect(value)}
                            disabled={submitted}
                            whileHover={!submitted ? { scale: 1.03 } : {}}
                            whileTap={!submitted ? { scale: 0.97 } : {}}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-6 cursor-pointer select-none transition-colors duration-200 font-medium disabled:cursor-not-allowed ${borderColor} ${bgColor} ${textColor}`}
                        >
                            <span className="text-3xl">{icon}</span>
                            <span className="font-display font-bold text-base">{label}</span>

                            <AnimatePresence>
                                {isSelected && (
                                    <motion.span
                                        key="ring"
                                        className="absolute inset-0 rounded-xl border-2"
                                        style={{ borderColor: isCorrect ? "hsl(142 71% 45%)" : "hsl(0 84% 60%)" }}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                    />
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </div>

            {/* Feedback */}
            <AnimatePresence>
                {submitted && (
                    <motion.div
                        key="feedback"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className={`rounded-xl border p-5 flex flex-col gap-2 mt-4 ${isCorrect ? "border-success/40 bg-success/10" : "border-destructive/40 bg-destructive/10"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {isCorrect
                                ? <CheckCircle2 className="text-success shrink-0" size={20} />
                                : <XCircle className="text-destructive shrink-0" size={20} />}
                            <span className={`font-display font-bold ${isCorrect ? "text-success" : "text-destructive"}`}>
                                {isCorrect ? "Correto!" : "Incorreto!"}
                            </span>
                        </div>
                        {explanation && (
                            <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                                {explanation}
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </ActivityGameCard>
    );
}