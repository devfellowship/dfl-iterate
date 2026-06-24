export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatarUrl: string;
  totalXp: number;
  rank: number;
  isCurrentUser: boolean;
}