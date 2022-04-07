export interface MatchEntity {
  _id: string;
  type: string;
  tournament: string;
  startTime: Date;
  homeId: string;
  awayId: string;
  home: string;
  away: string;
  h2hHome: number;
  h2hAway: number;
  homeOdds: number;
  awayOdds: number;
  link: string;
}
