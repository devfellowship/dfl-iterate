import { cn } from '@devfellowship/components';
import { Trophy } from 'lucide-react';
import type { LeaderboardEntry } from './types';

/**
 * Integração: T8 — seção "Ranking" na `HomePage` (abaixo do grid de lições).
 * Fellow: `useGetLeaderboard(limit)` no container; passe `entries` via props.
 */

export interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  className?: string;
}

export function LeaderboardTable({ entries, className }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <p className={cn('text-sm text-muted-foreground text-center py-6', className)}>
        Ranking indisponível.
      </p>
    );
  }

  return (
    <div className={cn('overflow-hidden rounded-xl border border-border', className)}>
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
        <Trophy className="h-4 w-4 text-xp" />
        <h2 className="font-semibold text-foreground">Ranking</h2>
      </div>
      <table className="w-full text-sm" data-testid="leaderboard-table">
        <thead className="sr-only">
          <tr>
            <th>Posição</th>
            <th>Jogador</th>
            <th>XP</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {entries.map((entry) => (
            <tr
              key={entry.userId}
              className={cn(
                entry.isCurrentUser && 'bg-primary/10',
              )}
            >
              <td className="w-12 px-4 py-3 font-bold text-muted-foreground tabular-nums">
                #{entry.rank}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={entry.avatarUrl}
                    alt=""
                    className="h-8 w-8 rounded-full border border-border object-cover shrink-0"
                  />
                  <span
                    className={cn(
                      'truncate font-medium',
                      entry.isCurrentUser ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    {entry.displayName}
                    {entry.isCurrentUser && (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        (você)
                      </span>
                    )}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-right font-semibold text-xp tabular-nums">
                {entry.totalXp.toLocaleString('pt-BR')} XP
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
