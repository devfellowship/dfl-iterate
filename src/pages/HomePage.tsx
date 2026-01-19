import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lesson } from '@/types';
import { lessonsData } from '@/test-utils/lessons.dummy';
import { Clock, Layers, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const navigate = useNavigate();

  const handleStartLesson = (lessonId: string) => {
    navigate(`/lesson/${lessonId}`);
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gradient">iterate</span>
            <span className="text-sm text-muted-foreground">by DevFellowship</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Text */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Aprenda construindo
              <br />
              <span className="text-gradient">projetos reais</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Microatividades que transformam você em um desenvolvedor melhor.
              Cada decisão importa. Cada linha de código tem propósito.
            </p>
          </motion.div>

          {/* Lessons Grid */}
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-muted-foreground mb-6 text-center">
              Escolha uma trilha para começar
            </h2>
            
            <div className="grid gap-6">
              {lessonsData.map((lesson, index) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  index={index}
                  onStart={() => handleStartLesson(lesson.id)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Feito com</span>
            <span className="text-primary">♥</span>
            <span>pela comunidade DevFellowship</span>
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
  return (
    <motion.div
      className="card-interactive p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-4xl">🥊</span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-2">
            {lesson.title}
          </h3>
          <p className="text-muted-foreground mb-4">
            {lesson.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{lesson.estimatedMinutes} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>{lesson.totalActivities} activities</span>
            </div>
            <div className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">
              React + TypeScript
            </div>
          </div>
        </div>

        {/* CTA - Game Button */}
        <Button onClick={onStart} className="game-button shrink-0">
          Começar Projeto
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}
