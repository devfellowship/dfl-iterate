import { useT } from '@/i18n/LangContext';

interface ResultBannerProps {
  submitted: boolean;
  isCorrect: boolean | null;
}

export function ResultBanner({ submitted, isCorrect }: ResultBannerProps) {
  const { t } = useT();
  if (!submitted || isCorrect === null) {
    return null;
  }

  return (
    <div className={`p-4 rounded-lg border ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
      <p className={`text-sm font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
        {isCorrect ? t('atoms.resultBanner.correct') : t('atoms.resultBanner.incorrect')}
      </p>
    </div>
  );
}
