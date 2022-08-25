import moment from "moment";
import { useRouter } from "next/router";
import React, { FC, MouseEventHandler, useEffect, useState } from "react";
import { GoChevronDown } from "react-icons/go";
import useSWR from "swr";
import { MatchEntity, TournamentDetails } from "../../types";
import { getCountryEmoji } from "../../utils/getCountryEmoji";
import { getFormattedOdds } from "../../utils/getFormattedOdds";
import { getLastAndFirstInitial } from "../../utils/getLastAndFirstInitial";
import { SearchBar } from "../SearchBar";
import { SurfaceBadge } from "../SurfaceBadge";
import { SkeletonSchedule } from "./SkeletonSchedule";

interface Props {
  handleSetActiveMatchId: (id: string) => void;
  activePlayerId: string | undefined;
  activeMatchId: string | null;
  isModelRunning: boolean;
  toggleOdds: () => void;
  oddsFormat: string;
}

interface PointsAndCountry {
  points: number;
  countryCode: string;
}

interface DetailsHash {
  [tournamentId: string]: PointsAndCountry;
}

const Schedule: FC<Props> = ({
  handleSetActiveMatchId,
  activePlayerId,
  activeMatchId,
  isModelRunning,
  toggleOdds,
  oddsFormat,
}) => {
  const [allMatches, setAllMatches] = useState<MatchEntity[] | null>(null);
  const [matches, setMatches] = useState<MatchEntity[] | null>(null);
  const [detailsHash, setDetailsHash] = useState<DetailsHash | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");

  let { data: schedule } = useSWR<MatchEntity[]>("/api/schedule");
  let { data: tournamentDetails } = useSWR<TournamentDetails[]>(
    "/api/tournaments/details"
  );

  const router = useRouter();

  const goToLink = (
    link: string,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (event) {
      event.stopPropagation();
    }
    router?.push(link);
  };

  // Toggle expand
  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Toggle odds
  const handleToggleOdds: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    toggleOdds();
  };

  // Sort tournaments by ranking points
  useEffect(() => {
    if (schedule?.length && detailsHash) {
      const sorted = schedule.sort((a, b) =>
        Number(detailsHash[b.tournamentLink]?.points ?? 0) <
        Number(detailsHash[a.tournamentLink]?.points ?? 0)
          ? -1
          : 1
      );
      setMatches(sorted);
      setAllMatches(sorted);
    } else if (schedule?.length) {
      setMatches(schedule);
      setAllMatches(schedule);
    }
  }, [schedule, detailsHash]);

  // Create tournament & points hashmap
  useEffect(() => {
    if (tournamentDetails?.length) {
      const hashmap = tournamentDetails.reduce(
        (obj, { tournamentId, points, countryCode }) => ({
          ...obj,
          [tournamentId]: { points, countryCode },
        }),
        {}
      );
      setDetailsHash(hashmap);
    }
  }, [tournamentDetails]);

  // Look up match where newly active playerId
  useEffect(() => {
    if (activePlayerId) {
      const matchId = matches?.find(
        ({ homeLink, awayLink }) =>
          homeLink === activePlayerId || awayLink === activePlayerId
      )?.matchId;
      if (matchId) handleSetActiveMatchId(matchId);
    }
  }, [activePlayerId]);

  // Filter matches by names: tournament, home or away player
  useEffect(() => {
    if (query === "") {
      setMatches(matches);
    } else {
      let searchQuery = query.toLowerCase();
      const filteredMatches =
        allMatches?.filter(
          ({ home, away, tournament }) =>
            tournament?.toLowerCase().includes(searchQuery) ||
            home?.toLowerCase().includes(searchQuery) ||
            away?.toLowerCase().includes(searchQuery)
        ) ?? [];
      setMatches(filteredMatches);
    }
  }, [query]);

  const searchBarProps = {
    query,
    setQuery,
    placeholder: "Search by name...",
  };

  return (
    <div
      className={`md:block rounded-md bg-tertiary p-2 md:p-4 text-white text-xs w-full mb-4 md:mb-10 ${
        isExpanded ? "md:py-2 md:px-4" : "md:p-2 md:px-4"
      } ${activeMatchId && "hidden"}`}
    >
      <div
        onClick={toggleExpand}
        className="flex flex-row justify-between items-center font-Signika text-xl text-white tracking-tighter cursor-pointer transition-all select-none"
      >
        <h1 className="truncate pr-2">Schedule</h1>
        <GoChevronDown className={`text-xl ${isExpanded && "rotate-180"}`} />
      </div>

      {/* Search bar */}
      <SearchBar {...searchBarProps} />

      {!matches ? (
        // Matches are loading
        <SkeletonSchedule />
      ) : !matches.length ? (
        // No matches fetched
        <div className="flex flex-row my-3">
          {!isModelRunning ? (
            "No matches found."
          ) : (
            <div className="flex flex-row">
              Scraping {process.env.NEXT_PUBLIC_SCRAPING_SCHEDULE_SITE_NAME}
              <div className="dot-flashing ml-3 scale-50 self-end" />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col mt-2">
          {
            // Display list of matches
            isExpanded &&
              matches.map(
                (
                  {
                    // @ts-ignore
                    id,
                    matchId,
                    tournament,
                    tournamentLink,
                    date,
                    home,
                    away,
                    homeLink,
                    awayLink,
                    homeH2h,
                    awayH2h,
                    homeOdds,
                    awayOdds,
                  },
                  index
                ) => {
                  const isNewTournament =
                    index === 0 ||
                    (matches &&
                      matches[index - 1]?.tournamentLink !== tournamentLink);

                  const isValidDate = moment(date).isValid();
                  const time = isValidDate
                    ? moment(date).format("HH:mm")
                    : "--:--";

                  const { surface, type } =
                    (tournamentDetails?.length &&
                      tournamentDetails?.find(
                        (details) => details.tournamentId === tournamentLink
                      )) ||
                    {};

                  const typeEmojis = type === "singles" ? "🎾" : "🎾🎾";
                  const countryEmoji = detailsHash
                    ? getCountryEmoji(detailsHash[tournamentLink]?.countryCode)
                    : null;

                  return (
                    <div key={id || index} className="flex flex-col">
                      {/* New tournament header (1 row) */}
                      {isNewTournament && (
                        <div
                          onClick={() =>
                            goToLink(`/tournament${tournamentLink}`)
                          }
                          className="flex flex-row w-full bg-primary text-center font-semibold py-1 my-1 rounded-sm hover:bg-black cursor-pointer"
                        >
                          <div className="flex flex-row items-center justify-center w-[10%] min-w-[3rem] text-[0.5rem]">
                            <div className="flex items-center w-2.5 h-2.5 mr-1">
                              <SurfaceBadge surface={surface} />
                            </div>
                            {typeEmojis}
                          </div>
                          <p className="w-[60%] min-w-[6rem] md:min-w-[6rem] text-left truncate">
                            {tournament}{" "}
                            <span className="ml-2">{countryEmoji}</span>
                          </p>
                          <p className="w-[10%] min-w-[3rem]">H2H</p>
                          <p className="w-[10%] min-w-[3rem]">Home</p>
                          <p className="w-[10%] min-w-[3rem]">Away</p>
                        </div>
                      )}

                      {/* Matches row */}
                      <div
                        onClick={() => handleSetActiveMatchId(matchId)}
                        className="flex flex-row w-full text-center py-1 hover:bg-secondary cursor-pointer"
                      >
                        <p className="w-[10%] min-w-[3rem] flex justify-center items-center px-2">
                          {time}
                        </p>
                        <div className="flex flex-col items-start w-[60%] min-w-[6rem] md:min-w-[6rem] truncate">
                          <button
                            className="truncate max-w-[100%]"
                            onClick={(event) =>
                              homeLink && goToLink(homeLink, event)
                            }
                          >
                            {home && getLastAndFirstInitial(home)}
                          </button>
                          <button
                            className="truncate max-w-[100%]"
                            onClick={(event) =>
                              awayLink && goToLink(awayLink, event)
                            }
                          >
                            {away && getLastAndFirstInitial(away)}
                          </button>
                        </div>
                        <div className="w-[10%] min-w-[3rem]">
                          <p>{homeH2h}</p>
                          <p>{awayH2h}</p>
                        </div>
                        <p
                          onClick={handleToggleOdds}
                          className="w-[10%] min-w-[3rem] self-center"
                        >
                          {getFormattedOdds(homeOdds, oddsFormat)}
                        </p>
                        <p
                          onClick={handleToggleOdds}
                          className="w-[10%] min-w-[3rem] self-center"
                        >
                          {getFormattedOdds(awayOdds, oddsFormat)}
                        </p>
                      </div>
                    </div>
                  );
                }
              )
          }
        </div>
      )}
    </div>
  );
};

export { Schedule };
