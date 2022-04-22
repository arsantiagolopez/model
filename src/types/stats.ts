import { PlayerEntity } from ".";

export interface PlayerStatsEntity {
  playerId?: string;
  player: string;
  eloRanking: EloRanking;
  yEloRanking: YEloRanking;
}

export interface ScrapeStatsResponse {
  eloRankings: EloRanking[];
  yEloRankings: YEloRanking[];
}

/* ELO Rankings */
// ELO model based off http://tennisabstract.com/reports/atp_elo_ratings.html

export interface EloRanking {
  tour: string;
  player: string;
  rank: number;
  age: number;
  elo: number;
  hardRaw: number;
  clayRaw: number;
  grassRaw: number;
  hElo: number;
  cElo: number;
  gElo: number;
  lastUpdated: Date | string;
}

export interface YEloRanking {
  tour: string;
  player: string;
  rank: number;
  wins: number;
  losses: number;
  yElo: number;
  lastUpdated: Date | string;
}

export interface PlayerAndCountry {
  player: PlayerEntity;
  country: string;
  countryCode: string;
}
