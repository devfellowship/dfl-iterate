import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lesson } from '@/types';
import { useLessons } from '@/hooks';
import { Clock, Layers, ArrowRight } from 'lucide-react';
import { Button } from '@devfellowship/components';
import {
  HomePageTopDataSlots,
  HomePageBottomDataSlots,
} from '@/components/data-layer/HomePageDataSlots';
import { HomePageHeaderDataSlots } from '@/components/data-layer/HomePageHeaderDataSlots';
import { LessonProgressBar } from '@/components/data-layer';
import { previewLessonProgress } from '@/components/data-layer/preview.mock';
import { PreviewSectionLabel } from '@/components/data-layer/PreviewSectionLabel';
import LanguageSelector from '@/components/LanguageSelector';
import { useT } from '@/i18n/LangContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { t, lp } = useT();
  const { data: lessons = [], isPending, isError, refetch } = useLessons();

  const handleStartLesson = (lessonId: string) => {
    navigate(lp(`/lesson/${lessonId}`));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="shrink-0 border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-4 md:py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-2xl font-bold text-gradient">iterate</span>
              <span className="text-sm text-muted-foreground">{t('home.brandBy')}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
              <LanguageSelector />
              <HomePageHeaderDataSlots />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 md:py-16">
          <HomePageTopDataSlots />

          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {t('home.hero.title1')}
              <br />
              <span className="text-gradient">{t('home.hero.title2')}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-muted-foreground mb-6 text-center">
              {t('home.chooseTrack')}
            </h2>

            {isPending ? (
              <div className="text-center text-muted-foreground py-12">
                {t('home.loading')}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center gap-4 py-12">
                <p className="text-muted-foreground text-center max-w-md">
                  {t('home.loadError')}
                </p>
                <Button onClick={() => refetch()}>{t('common.retry')}</Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {lessons.map((lesson, index) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    index={index}
                    onStart={() => handleStartLesson(lesson.id)}
                  />
                ))}
              </div>
            )}
          </motion.div>

          <HomePageBottomDataSlots />
        </div>
      </main>

      <footer className="shrink-0 border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>{t('home.footer.madeWith')}</span>
            <span className="text-primary">♥</span>
            <span>{t('home.footer.byCommunity')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface LessonCardProps {
  lesson: Lesson;
  index: number;
  onStart: () => void;
}

function LessonCard({ lesson, index, onStart }: LessonCardProps) {
  const { t } = useT();
  return (
    <motion.div
      className="card-interactive p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-4xl">🥊</span>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-2">{lesson.title}</h3>
          <p className="text-muted-foreground mb-4">{lesson.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{lesson.estimatedMinutes} {t('common.min')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>{lesson.totalActivities} {t('common.activities')}</span>
            </div>
          </div>

          <div className="mt-4 max-w-md" data-slot="T5">
            <PreviewSectionLabel taskId="T5" />
            <LessonProgressBar progress={previewLessonProgress} />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Button onClick={onStart}>
            {t('home.card.start')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
