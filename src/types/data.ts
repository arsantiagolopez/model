export interface PlayerInfo {
  player_id: string;
  name_first: string;
  name_last: string;
  hand: string;
  dob: string;
  ioc: string;
  height: string;
  wikidata_id: string;
}

export interface RankingInfo {
  ranking_date: string;
  rank: string;
  player: string;
  points: string;
  tours: string;
}

export interface MatchInfo {
  tourney_id: string;
  tourney_name: string;
  surface: string;
  draw_size: string;
  tourney_level: string;
  tourney_date: string;
  match_num: string;
  winner_id: string;
  winner_seed: string;
  winner_entry: string;
  winner_name: string;
  winner_hand: string;
  winner_ht: string;
  winner_ioc: string;
  winner_age: string;
  loser_id: string;
  loser_seed: string;
  loser_entry: string;
  loser_name: string;
  loser_hand: string;
  loser_ht: string;
  loser_ioc: string;
  loser_age: string;
  score: string;
  best_of: string;
  round: string;
  minutes: string;
  w_ace: string;
  w_df: string;
  w_svpt: string;
  w_1stIn: string;
  w_1stWon: string;
  w_2ndWon: string;
  w_SvGms: string;
  w_bpSaved: string;
  w_bpFaced: string;
  l_ace: string;
  l_df: string;
  l_svpt: string;
  l_1stIn: string;
  l_1stWon: string;
  l_2ndWon: string;
  l_SvGms: string;
  l_bpSaved: string;
  l_bpFaced: string;
  winner_rank: string;
  winner_rank_points: string;
  loser_rank: string;
  loser_rank_points: string;
}
