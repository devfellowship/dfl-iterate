import { Navigate, Route, Routes } from 'react-router-dom';
import { routes } from '@/consts/routes';
import { AppShell } from '@/components/layout/AppShell';
import { RequireAuth } from '@/components/layout/RequireAuth';
import { EntriesPage } from '@/pages/EntriesPage';
import { EntryDetailPage } from '@/pages/EntryDetailPage';
import { LoginPage } from '@/pages/LoginPage';
import { SettingsPage } from '@/pages/SettingsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={routes.login} element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path={routes.home} element={<EntriesPage />} />
          <Route path={routes.entryDetail} element={<EntryDetailPage />} />
          <Route path={routes.settings} element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={routes.home} replace />} />
    </Routes>
  );
}
