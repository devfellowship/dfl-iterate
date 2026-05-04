// src/hooks/useTrueOrFalse.ts
import { useState } from "react";
import { Activity } from "@/types";

export function useTrueOrFalse(activity: Activity) {
    const [selected, setSelected] = useState<boolean | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const correctAnswer = activity.trueFalseConfig?.correctAnswer ?? true;
    const explanation = activity.trueFalseConfig?.explanation;
    const isCorrect = selected === correctAnswer;

    function handleSelect(value: boolean) {
        if (submitted) return;
        setSelected(value);
        setSubmitted(true);
    }

    function handleContinue(onSubmit: (answer: boolean) => void) {
        if (selected !== null) onSubmit(selected);
    }

    return { selected, submitted, isCorrect, explanation, correctAnswer, handleSelect, handleContinue };
}