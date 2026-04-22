import { Activity } from "@/types";
import { useState } from "react";

export function useBestImplementation( 
    activity: Activity, 
    onSubmit: (selectedId: string, justification: string) => void
) {
    const [selectedId, setSelectedId] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [justification, setJustification] = useState("");

    const handleSubmit = () => {
      onSubmit(selectedId, justification);
      setIsSubmitted(true);
    };

    return {
        selectedId,
        setSelectedId,
        justification,
        setJustification,
        isSubmitted,
        handleSubmit,
    };
};