interface ParsonsProblemResultBannerProps {
  submitted: boolean;
  isCorrect: boolean | null;
}

export function ParsonsProblemResultBanner({ submitted, isCorrect }: ParsonsProblemResultBannerProps) {
  if (!submitted || isCorrect === null) {
    return null;
  }

  return (
    <div className={`p-4 rounded-lg border ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
      <p className={`text-sm font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
        {isCorrect ? '✅ Correto! Parabéns.' : '❌ Incorreto. Tente novamente.'}
      </p>
    </div>
  );
}
