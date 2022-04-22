import { PlayerStatsEntity } from ".";
import { MatchEntity } from "./match";

export interface PlayerEntity {
  _id?: string;
  playerId: string;
  profile: PlayerProfile;
  form?: number;
  streak?: number;
  record: PlayerRecord;
  lastMatches: MatchEntity[];
  upcomingMatch?: MatchEntity;
  pastTournamentResults: PastTournamentResult[];
  injuries: Injury[];
  playerStats: PlayerStatsEntity;
}

export interface PlayerProfile {
  name?: string;
  image?: string;
  country?: string;
  height?: string;
  age?: number;
  birthday?: Date | string;
  singlesRank?: number;
  // doublesRank?: number;
  sex?: string;
  hand?: string;
}

export interface PlayerRecord {
  years: YearRecord[];
  all: YearRecord;
}

export interface YearRecord {
  year?: number;
  yearLink?: string;
  summary: WinLossRecord;
  clay: WinLossRecord;
  hard: WinLossRecord;
  indoors: WinLossRecord;
  grass: WinLossRecord;
}

export interface WinLossRecord {
  win: number;
  loss: number;
}

export interface PastTournamentResult {
  tournamentId: string;
  year: number;
  result: string;
  matches: MatchEntity[];
}

export interface Injury {
  startDate: Date | string;
  endDate: Date | string;
  tournament: string;
  reason: string;
}
