import { GitLogEntry } from '@/types';

export const initialGitLog: GitLogEntry[] = [
  {
    id: 'log-0',
    activityId: 'setup',
    message: 'feat: projeto BoxShop inicializado',
    timestamp: new Date(),
    filesChanged: ['src/App.tsx', 'src/components/ProductGrid.tsx', 'src/components/ProductCard.tsx'],
    type: 'activity_complete',
  },
];
