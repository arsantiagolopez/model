import { NextPage } from "next";
import { MatchEntity } from "./match";
import { PlayerEntity } from "./player";
import { TournamentEntity } from "./tournament";

export type AdminPage<Props> = NextPage<Props> & { isAdmin?: boolean };

export interface StyleProps {
  [key: string]: any;
}

export interface ScrapeScheduleResponse {
  /* Tournaments hosting tomorrow */
  tournaments: TournamentEntity[];
  /* Matches scheduled for tomorrow */
  matches: MatchEntity[];
  /* Players playing tomorrow */
  players: PlayerEntity[];
}

export interface ScrapeMatchesResponse {
  /* Updated matches entities */
  matches: MatchEntity[];
  /* Updated player entities */
  players: PlayerEntity[];
}

export interface MatchAndPlayers {
  match: MatchEntity;
  players: PlayerEntity[];
}
