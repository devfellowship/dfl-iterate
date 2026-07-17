import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@devfellowship/components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Outlet, Routes, Route } from "react-router-dom";
import { ObservabilityProvider } from "@devfellowship/observability";
import { LangProvider } from "@/i18n/LangContext";
import LocalizedHead from "@/i18n/LocalizedHead";
import type { Locale } from "@/i18n";
import HomePage from "./pages/HomePage";
import LessonPage from "./pages/LessonPage";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

// One layout per locale: provides the i18n context + drives the document
// head, then renders the matched page via <Outlet />. PT lives at the bare
// root ("/"); EN lives under "/en"; ES lives under "/es". Every page route
// exists under all three.
const LocaleLayout = ({ lang }: { lang: Locale }) => (
  <LangProvider lang={lang}>
    <LocalizedHead />
    <Outlet />
  </LangProvider>
);

const App = () => (
  <ObservabilityProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* English — /en/... */}
            <Route path="/en" element={<LocaleLayout lang="en" />}>
              <Route index element={<HomePage />} />
              <Route path="lesson/:lessonId" element={<LessonPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            {/* Spanish — /es/... */}
            <Route path="/es" element={<LocaleLayout lang="es" />}>
              <Route index element={<HomePage />} />
              <Route path="lesson/:lessonId" element={<LessonPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            {/* Portuguese (default) — bare root */}
            <Route path="/" element={<LocaleLayout lang="pt" />}>
              <Route index element={<HomePage />} />
              <Route path="lesson/:lessonId" element={<LessonPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ObservabilityProvider>
);

export default App;
