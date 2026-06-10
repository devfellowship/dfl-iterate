import { cn } from '@devfellowship/components';
import type { UserProfile } from './types';

/**
 * Integração: T1 — header da `HomePage` (`HomePageHeaderDataSlots`, variant `compact`).
 * Fellow: `useGetUserProfile` no container; passe `profile` via props.
 */
export interface UserProfileCardProps {
  profile: UserProfile;
  variant?: 'default' | 'compact';
  className?: string;
}

export function UserProfileCard({
  profile,
  variant = 'default',
  className,
}: UserProfileCardProps) {
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-2 min-w-0',
          className,
        )}
        data-testid="user-profile-card-compact"
      >
        <img
          src={profile.avatarUrl}
          alt=""
          className="h-8 w-8 shrink-0 rounded-full border border-border object-cover"
        />
        <span className="truncate text-sm font-semibold text-foreground max-w-[120px] sm:max-w-[160px]">
          {profile.name}
        </span>
      </div>
    );
  }

  return (
    <article
      className={cn(
        'flex items-center gap-3 rounded-lg border border-border bg-card p-4',
        className,
      )}
      data-testid="user-profile-card"
    >
      <img
        src={profile.avatarUrl}
        alt=""
        className="h-12 w-12 shrink-0 rounded-full border border-border object-cover"
      />
      <div className="min-w-0">
        <p className="font-semibold text-foreground truncate">{profile.name}</p>
        <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
        <p className="text-xs text-muted-foreground">{profile.age} anos</p>
      </div>
    </article>
  );
}
