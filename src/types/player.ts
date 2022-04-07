export interface TournamentMatch {
  tournament: string;
  type: string;
  round: string;
  startTime: string;
  match: string;
  homeOdds: number;
  awayOdds: number;
  matchLink: string;
}

export interface PastTournamentResult {
  tournament: string;
  year: number;
  result: string;
}

export interface WinLossRecord {
  win: number;
  loss: number;
}

export interface PlayerRecord {
  type: string;
  year: number;
  totalSummary: string;
  totalRecord: WinLossRecord;
  claySummary: string;
  clayRecord: WinLossRecord;
  hardSummary: string;
  hardRecord: WinLossRecord;
  indoorsSummary: string;
  indoorsRecord: WinLossRecord;
  grassSummary: string;
  grassRecord: WinLossRecord;
}

export interface PlayedMatch {
  country: string;
  type: string;
  tournament: string;
  startTime: Date;
  surface: string;
  opponentId: string;
  opponent: string;
  round: string;
  result: string;
  resultSummary: string;
  playerOdds: number;
  opponentOdds: number;
  matchLink: string;
}

export interface Injury {
  startDate: Date;
  endDate: Date;
  tournament: string;
  reason: string;
}

export interface PlayerEntity {
  _id: string;
  platformId: string;
  name: string;
  image: string;
  country: string;
  age: number;
  singlesRank: number;
  doublesRank: number;
  hand: string;
  currentTournamentResults: TournamentMatch[];
  pastTournamentResults: PastTournamentResult[];
  yearlyPlayerRecord: PlayerRecord[];
  lastMatches: PlayedMatch[];
  injuries: Injury[];
}
