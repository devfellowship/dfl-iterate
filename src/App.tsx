import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ObservabilityProvider } from "@/components/observability";
import HomePage from "./pages/HomePage";
import LessonPage from "./pages/LessonPage";
import NotFound from "./pages/NotFound";
import StepThrough from "./components/StepThrough";
import { sampleActivity } from "./data/sampleActivity";

const queryClient = new QueryClient();

const App = () => {
  const handleSubmit = (answers: Record<number, string>) => {
    console.log("Respostas do aluno:", answers);
  };

  return (
    <ObservabilityProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/lesson/:lessonId" element={<LessonPage />} />
              <Route path="*" element={<NotFound />} />
              {/* Você pode adicionar a StepThrough como rota ou componente isolado */}
              <Route
                path="/stepthrough"
                element={
                  <StepThrough
                    activity={sampleActivity}
                    onSubmit={handleSubmit}
                  />
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ObservabilityProvider>
  );
};

export default App;