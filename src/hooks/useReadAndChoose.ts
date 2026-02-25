import { useState } from "react";

interface UseReadAndChooseParams {
    onDecide: (optionId: string) => void;
}

export function useReadAndChoose({ onDecide }: UseReadAndChooseParams){
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);

    const handleConfirm = () => {
        if (selectedOption) {
            setIsConfirming(true);
            setTimeout(() => {
                onDecide(selectedOption);
                setIsConfirming(false);
            }, 500);
        }
    };

    return { selectedOption, setSelectedOption, isConfirming, handleConfirm};
}