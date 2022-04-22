import { MatchEntity } from "./match";

export interface PastYearResult {
  tournamentId: string;
  year: string;
  link: string;
  matches: MatchEntity[];
}

export interface RoundPrizeRank {
  round: string;
  prize: string;
  rankingPoints: number;
}

export interface TournamentEntity {
  _id?: string;
  tournamentId: string;
  name: string;
  country: string;
  countryCode?: string;
  surface: string;
  type: string;
  sex: string;
  prize: string;
  pastYearsResults: PastYearResult[];
  details?: RoundPrizeRank[];
  nextMatches: MatchEntity[];
  results: MatchEntity[];
}

export interface TournamentDetails {
  tournamentId: string;
  name: string;
  country: string;
  countryCode?: string;
  surface: string;
  type: string;
  sex: string;
  prize: string;
  points?: number;
}
