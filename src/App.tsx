import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ObservabilityProvider } from '@/components/observability';
import HomePage from './pages/HomePage';
import Home from './pages/Home'; 
import LessonPage from './pages/LessonPage';
import NotFound from './pages/NotFound';
import StepThrough from './components/activity/StepThrough';
import { sampleActivity } from './data/sampleActivity';

// Instanciando o QueryClient
const queryClient = new QueryClient();

const App: React.FC = () => {
  const handleSubmit = (answers: Record<number, string>) => {
    console.log('Respostas enviadas:', answers);
  };

  return (
    <ObservabilityProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              {/* Rotas do segundo código */}
              <Route path="/" element={<HomePage />} />
              <Route path="/lesson/:lessonId" element={<LessonPage />} />
              <Route path="*" element={<NotFound />} />  
              <Route
                path="/stepthrough"
                element={<StepThrough activity={sampleActivity} onSubmit={handleSubmit} />}
              />
              {/* Rota do primeiro código */}
              <Route path="/home" element={<Home />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </ObservabilityProvider>
  );
};

export default App;