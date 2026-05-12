import { useBestImplementation } from "@/hooks/useBestImplementation";
import { Activity } from "@/types";
import { ActivityType } from "@/enums";
import { ActivityGameCard, GameButton } from "@/components/game";

interface BestImplementationProps {
    activity: Activity;
    onSubmit: (selectedId: string, justification: string) => void;
};

export function BestImplementation({ activity, onSubmit }: BestImplementationProps) {
    const {
        selectedId,
        setSelectedId,
        justification,
        setJustification,
        isSubmitted,
        handleSubmit,
    } = useBestImplementation(onSubmit);

    if (activity.type !== ActivityType.BEST_IMPLEMENTATION) return null;

    return (
        <ActivityGameCard
            type={activity.type}
            title={activity.title}
            question="Qual implementação você levaria para produção?"
            actions={
                <GameButton
                    onClick={handleSubmit}
                    disabled={!selectedId || isSubmitted}
                    variant="primary"
                >
                    Confirmar
                </GameButton>
            }
        >
            <div className="flex flex-col gap-4">
                {activity.bestOption?.map(option => (
                    <div key={option.id} className="flex-1">
                        <input
                            type="radio"
                            name="best-option"
                            checked={selectedId === option.id}
                            onChange={() => setSelectedId(option.id)}
                            disabled={isSubmitted}
                        />

                        <pre className="bg-muted p-3 rounded-lg text-sm overflow-auto">
                            <code>{option.code}</code>
                        </pre>

                        {isSubmitted && selectedId === option.id && (
                            <p
                                className={`mt-3 text-sm ${
                                    option.id === activity.correctImplementationId
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                }`}
                            >
                                {option.explanation}
                            </p>
                        )}
                    </div>
                ))}

                <textarea
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                />
            </div>
        </ActivityGameCard>
    );
};
