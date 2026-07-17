import { cn } from '@devfellowship/components';
import { Monitor, Moon, Sun, Volume2, VolumeX, Languages } from 'lucide-react';
import type { ThemePreference, UserPreferences } from './types';

/**
 * Integração: T2 — drawer ⚙️ no header da `HomePage` (`HomePageHeaderDataSlots`).
 * Fellow: substitui mock por `useGetUserPreferences()` no container.
 */

const THEME_LABELS: Record<ThemePreference, string> = {
  light: 'Claro',
  dark: 'Escuro',
  system: 'Sistema',
};

const LANGUAGE_LABELS: Record<UserPreferences['language'], string> = {
  'pt-BR': 'Português (BR)',
  'en-US': 'English (US)',
};

function ThemeIcon({ theme }: { theme: ThemePreference }) {
  if (theme === 'dark') return <Moon className="h-4 w-4 text-muted-foreground" />;
  if (theme === 'light') return <Sun className="h-4 w-4 text-muted-foreground" />;
  return <Monitor className="h-4 w-4 text-muted-foreground" />;
}

export interface AppearanceSettingsPanelProps {
  preferences: UserPreferences;
  className?: string;
}

export function AppearanceSettingsPanel({
  preferences,
  className,
}: AppearanceSettingsPanelProps) {
  const rows = [
    {
      icon: <ThemeIcon theme={preferences.theme} />,
      label: 'Tema',
      value: THEME_LABELS[preferences.theme],
    },
    {
      icon: preferences.soundEffectsEnabled ? (
        <Volume2 className="h-4 w-4 text-muted-foreground" />
      ) : (
        <VolumeX className="h-4 w-4 text-muted-foreground" />
      ),
      label: 'Sons',
      value: preferences.soundEffectsEnabled ? 'Ativados' : 'Desativados',
    },
    {
      icon: <Languages className="h-4 w-4 text-muted-foreground" />,
      label: 'Idioma',
      value: LANGUAGE_LABELS[preferences.language],
    },
  ];

  return (
    <div className={cn('space-y-1', className)} data-testid="appearance-settings-panel">
      <h2 className="text-lg font-semibold text-foreground mb-4">Preferências</h2>
      <ul className="divide-y divide-border rounded-lg border border-border">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              {row.icon}
              <span className="text-sm text-muted-foreground">{row.label}</span>
            </div>
            <span className="text-sm font-medium text-foreground shrink-0">
              {row.value}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground pt-3">
        Edição de preferências disponível em breve.
      </p>
    </div>
  );
}
