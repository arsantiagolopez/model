import axios from "axios";
import fs from "fs";
import { usePapaParse } from "react-papaparse";
import { MatchInfo, PlayerInfo, RankingInfo } from "../types";

type PlayerHash = Record<string, PlayerInfo>;
type RankingHash = Record<string, RankingInfo>;
type MatchHash = Record<string, MatchInfo>;

type Hash = PlayerHash & RankingHash & MatchHash;

// Convert CSV data to hash of entities, then hash to JSON
const convertCsvToJson = async (data: string): Promise<Hash> => {
  const { readString } = usePapaParse();

  let entityHash: Hash = {};

  readString(data, {
    worker: true,
    delimiter: ",",
    skipEmptyLines: true,
    complete: ({ data }: { data: string[][] }) => {
      const headers = data[0];

      // Handle players ✅
      if (headers[0] === "player_id") {
        for (const player of data.slice(1)) {
          // Create object
          const info: PlayerInfo = player.reduce(
            (obj, prop, index) => ({ ...obj, [headers[index]]: prop }),
            {} as PlayerInfo
          );

          (entityHash as PlayerHash)[info.player_id] = info;
        }
      }

      // Handle rankings ✅
      else if (headers[0] === "ranking_date") {
        for (const ranking of data.slice(1)) {
          // Create object
          const info: RankingInfo = ranking.reduce(
            (obj, prop, index) => ({ ...obj, [headers[index]]: prop }),
            {} as RankingInfo
          );

          (entityHash as RankingHash)[info.player] = info;
        }
      }

      // Handle matches ✅
      else if (headers[0] === "tourney_id") {
        for (const match of data.slice(1)) {
          // Create object
          const info: MatchInfo = match.reduce(
            (obj, prop, index) => ({ ...obj, [headers[index]]: prop }),
            {} as MatchInfo
          );

          (entityHash as MatchHash)[info.match_num] = info;
        }
      }
    },
  });

  return entityHash;
};

// Scrape data from url & create file inside data folder
const scrapeAndUpdateData = async (url: string): Promise<boolean> => {
  const year = new Date().getFullYear();

  let slug = url.split("/").slice(-1)[0];
  slug = slug.includes(String(year))
    ? slug.replace(`_${year}.csv`, "")
    : slug.replace(".csv", "");

  // Fetch ATP Rankings, Results, and Stats
  const { data } = await axios.get(url);

  if (data) {
    const hash = await convertCsvToJson(data);

    // Stringify array of players
    const json = JSON.stringify(hash);

    // Create & store json file
    fs.writeFileSync(`./src/data/${slug}.json`, json);

    return true;
  } else {
    return false;
  }
};

// Fetch ATP & WTA Rankings, Results, and Stats
const updatePlayerDataWeekly = async (): Promise<boolean> => {
  let success = true;

  const year = new Date().getFullYear();

  // ATP, Challengers & Futures
  const ATP_PLAYERS =
    "https://raw.githubusercontent.com/JeffSackmann/tennis_atp/master/atp_players.csv";
  const ATP_RANKINGS =
    "https://raw.githubusercontent.com/JeffSackmann/tennis_atp/master/atp_rankings_current.csv";
  const ATP_MATCHES = `https://raw.githubusercontent.com/JeffSackmann/tennis_atp/master/atp_matches_${year}.csv`;
  const ATP_MATCHES_CHALL = `https://raw.githubusercontent.com/JeffSackmann/tennis_atp/master/atp_matches_qual_chall_${year}.csv`;
  const ATP_MATCHES_FUTURES = `https://raw.githubusercontent.com/JeffSackmann/tennis_atp/master/atp_matches_futures_${year}.csv`;

  // WTA & ITFs
  const WTA_PLAYERS =
    "https://raw.githubusercontent.com/JeffSackmann/tennis_wta/master/wta_players.csv";
  const WTA_RANKINGS =
    "https://raw.githubusercontent.com/JeffSackmann/tennis_wta/master/wta_rankings_current.csv";
  const WTA_MATCHES = `https://raw.githubusercontent.com/JeffSackmann/tennis_wta/master/wta_matches_${year}.csv`;
  const WTA_MATCHES_ITF = `https://raw.githubusercontent.com/JeffSackmann/tennis_wta/master/wta_matches_qual_itf_${year}.csv`;

  const stats: string[] = [
    ATP_PLAYERS,
    ATP_RANKINGS,
    ATP_MATCHES,
    ATP_MATCHES_CHALL,
    ATP_MATCHES_FUTURES,
    WTA_PLAYERS,
    WTA_RANKINGS,
    WTA_MATCHES,
    WTA_MATCHES_ITF,
  ];

  try {
    // Iterate through every stat and update data
    for await (const url of stats) {
      success = await scrapeAndUpdateData(url);
    }

    return success;
  } catch (error) {
    success = false;
    console.log(error);
    return success;
  }
};

export { updatePlayerDataWeekly };
