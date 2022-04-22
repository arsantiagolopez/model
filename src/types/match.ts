export interface MatchEntity {
  _id?: string;
  matchId: string;
  tournament: string;
  tournamentId: string;
  tournamentLink: string;
  year?: number;
  type?: string;
  surface?: string;
  round?: string;
  date?: Date | string;
  homeLink?: string;
  awayLink?: string;
  home: string;
  away: string;
  homeH2h?: number;
  awayH2h?: number;
  homeOdds: number;
  awayOdds: number;
  matchLink: string;
  result?: MatchResult;
  headToHeadMatches?: MatchEntity[];
  odds?: MatchOdds;
}

export interface MatchResult {
  winner?: string;
  homeSets: number;
  awaySets: number;
  homeGamesFirstSet: number;
  homeGamesSecondSet: number;
  homeGamesThirdSet?: number;
  homeGamesFourthSet: number;
  homeGamesFifthSet?: number;
  awayGamesFirstSet: number;
  awayGamesSecondSet: number;
  awayGamesThirdSet?: number;
  awayGamesFourthSet: number;
  awayGamesFifthSet?: number;
}

export interface MatchOdds {
  moneyline: MoneylineOdds;
  totalGames: TotalsOdds[];
  totalSets: TotalsOdds[];
  spreadGames: SpreadOdds[];
  spreadSets: SpreadOdds[];
}

export interface MoneylineOdds {
  home: number;
  away: number;
}

export interface TotalsOdds {
  line: number;
  over: number;
  under: number;
}

export interface SpreadOdds {
  spread: number;
  home: number;
  away: number;
}
