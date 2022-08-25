export interface ResultEntity {
  matchId: string;
  matchLink: string;
  tournament: string;
  tournamentLink: string;
  winner: string;
  loser: string;
  winnerLink: string;
  loserLink: string;
  winnerSets: number;
  loserSets: number;
  gradedBy?: string;
}
