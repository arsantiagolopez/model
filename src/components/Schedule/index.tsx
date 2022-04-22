import moment from "moment";
import { useRouter } from "next/router";
import React, {
  FC,
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import { GoChevronDown } from "react-icons/go";
import useSWR from "swr";
import { PreferencesContext } from "../../context/PreferencesContext";
import { TestsContext } from "../../context/TestsContext";
import { MatchEntity, TournamentDetails } from "../../types";
import { getCountryEmoji } from "../../utils/getCountryEmoji";
import { getFormattedOdds } from "../../utils/getFormattedOdds";
import { getLastAndFirstInitial } from "../../utils/getLastAndFirstInitial";
import { SurfaceBadge } from "../SurfaceBadge";
import { SkeletonSchedule } from "./SkeletonSchedule";

interface Props {
  handleSetActiveMatchId: (id: string) => void;
  activePlayerId: string | undefined;
}

interface PointsAndCountry {
  points: number;
  countryCode: string;
}

interface DetailsHash {
  [tournamentId: string]: PointsAndCountry;
}

const Schedule: FC<Props> = ({ handleSetActiveMatchId, activePlayerId }) => {
  const [matches, setMatches] = useState<MatchEntity[] | null>(null);
  const [detailsHash, setDetailsHash] = useState<DetailsHash | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  let { data: schedule } = useSWR<MatchEntity[]>("/api/schedule");
  let { data: tournamentDetails } = useSWR<TournamentDetails[]>(
    "/api/tournaments/details"
  );

  const { isModelRunning } = useContext(TestsContext);
  const { toggleOdds } = useContext(PreferencesContext);

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
    } else if (schedule?.length) {
      setMatches(schedule);
    }
  }, [schedule, detailsHash]);

  // Create tournament & points hashmap
  useEffect(() => {
    if (tournamentDetails) {
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

  return (
    <div
      className={`rounded-md bg-tertiary p-2 md:p-4 text-white text-xs w-full mb-4 md:mb-10 ${
        isExpanded ? "md:py-2 md:px-4" : "md:p-2 md:px-4 px-3"
      }`}
    >
      {!matches ? (
        // Matches are loading
        <SkeletonSchedule />
      ) : !matches.length ? (
        // No matches fetched
        <div className="flex flex-row">
          {!isModelRunning ? (
            "No matches scraped yet. Click on green play button to run model for the day"
          ) : (
            <div className="flex flex-row">
              Scraping {process.env.NEXT_PUBLIC_SCRAPING_SCHEDULE_SITE_NAME}
              <div className="dot-flashing ml-3 scale-50 self-end" />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col">
          <div
            onClick={toggleExpand}
            className="flex flex-row justify-between items-center font-Signika text-xl text-white tracking-tighter cursor-pointer transition-all select-none"
          >
            <h1 className={`truncate pr-2 ${isExpanded && "mb-1 md:mb-2"}`}>
              Schedule
            </h1>
            <GoChevronDown
              className={`text-xl ${isExpanded && "mb-1 md:mb-2 rotate-180"}`}
            />
          </div>
          {
            // Display list of matches
            isExpanded &&
              matches.map(
                (
                  {
                    _id,
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
                    ? moment(date).format("kk:mm")
                    : "--:--";

                  const { surface, type } =
                    tournamentDetails?.find(
                      (detatils) => detatils?.tournamentId === tournamentLink
                    ) || {};

                  const typeEmojis = type === "singles" ? "🎾" : "🎾🎾";
                  const countryEmoji = detailsHash
                    ? getCountryEmoji(detailsHash[tournamentLink]?.countryCode)
                    : null;

                  return (
                    <div key={_id} className="flex flex-col">
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
                          <p className="w-[60%] min-w-[7rem] md:min-w-[9rem] text-left">
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
                        <div className="flex flex-col items-start w-[60%] min-w-[7rem] md:min-w-[9rem]">
                          <button
                            onClick={(event) =>
                              homeLink && goToLink(homeLink, event)
                            }
                          >
                            {home && getLastAndFirstInitial(home)}
                          </button>
                          <button
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
                          {getFormattedOdds(homeOdds)}
                        </p>
                        <p
                          onClick={handleToggleOdds}
                          className="w-[10%] min-w-[3rem] self-center"
                        >
                          {getFormattedOdds(awayOdds)}
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
