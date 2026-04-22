import { useBestImplementation } from "@/hooks/useBestImplementation";
import { Activity } from "@/types";
import { ActivityType } from "@/enums";

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
    } = useBestImplementation(activity, onSubmit);

    if (activity.type !== ActivityType.BEST_IMPLEMENTATION) return null;

    return(
        <div>
            {activity.bestOption?.map(option => 
            (
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
                            option.id === activity.correctImplementationId ?
                            'text-green-500' : 'text-red-500'
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
            >
            </textarea>

            <button onClick={handleSubmit}>Confirmar</button>

        </div>
    )
};
