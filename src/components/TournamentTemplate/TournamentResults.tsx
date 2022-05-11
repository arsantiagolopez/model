import React, { FC, MouseEventHandler } from "react";
import { MatchEntity } from "../../types";
import { getDayAndTimeFromDate } from "../../utils/getDayAndTimeFromDate";
import { getFormattedOdds } from "../../utils/getFormattedOdds";

interface Props {
  results: MatchEntity[] | undefined;
  toggleOdds: () => void;
  oddsFormat: string;
}

const TournamentResults: FC<Props> = ({ results, toggleOdds, oddsFormat }) => {
  // Toggle odds
  const handleToggleOdds: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    toggleOdds();
  };

  return (
    <div className="flex flex-col my-4 w-full">
      <h1 className="font-Signika tracking-tight text-xl mb-2">Results</h1>
      <div className="rounded-md bg-tertiary p-2 md:p-4 text-fourth text-xs w-full">
        <div className="flex flex-row w-full bg-primary text-white text-center font-semibold py-1 my-1 rounded-sm hover:bg-black ">
          <p className="w-[10%] min-w-[2.75rem] md:min-w-[3rem]">Start</p>
          <p className="w-[10%] min-w-[2.75rem] md:min-w-[3rem]">
            <span className="hidden md:block">Round</span>
            <span className="block md:hidden">Rd.</span>
          </p>
          <p className="w-[40%] md:w-[30%] min-w-[6.5rem] md:min-w-[8rem] text-left md:pl-2">
            Headline
          </p>
          <div className="flex flex-row w-[35%] md:w-[25%] min-w-[3.75rem] md:min-w-[6rem] ">
            <p className="pr-1 md:pr-2.5">S</p>
            <p className="pr-1 md:pr-2.5">1</p>
            <p className="pr-1 md:pr-2.5">2</p>
            <p className="pr-1 md:pr-2.5">3</p>
            <p className="pr-1 md:pr-2.5">4</p>
            <p className="pr-1 md:pr-2.5">5</p>
          </div>

          <p className="md:hidden w-[8%] min-w-[2rem]">H</p>
          <p className="hidden md:block w-[10%] min-w-[2rem]">Home</p>
          <p className="md:hidden w-[8%] min-w-[2rem]">A</p>
          <p className="hidden md:block w-[10%] min-w-[2rem]">Away</p>
        </div>
        {results?.map(
          ({
            matchId,
            round,
            home,
            away,
            date,
            homeOdds,
            awayOdds,
            result,
          }) => {
            const {
              homeSets,
              awaySets,
              homeGamesFirstSet,
              homeGamesSecondSet,
              homeGamesThirdSet,
              homeGamesFourthSet,
              homeGamesFifthSet,
              awayGamesFirstSet,
              awayGamesSecondSet,
              awayGamesThirdSet,
              awayGamesFourthSet,
              awayGamesFifthSet,
            } = result || {};

            // Get day and time from date
            const { day, time } = getDayAndTimeFromDate(date);

            return (
              <div
                key={matchId}
                // onClick={() => goToLink(`/match${matchLink}`)}
                className="flex flex-row w-full text-center py-1 hover:bg-secondary cursor-pointer"
              >
                <div className="flex flex-col justify-center items-center w-[10%] min-w-[2.75rem] md:min-w-[3rem] md:px-1">
                  <p className="text-[0.65rem] tracking-tighter">{day}</p>
                  {time}
                </div>

                <p className="w-[10%] min-w-[2.75rem] md:min-w-[3rem] flex justify-center items-center px-2">
                  {round}
                </p>

                <div className="flex flex-col items-start w-[40%] md:w-[30%] min-w-[6.5rem] md:min-w-[8rem] md:pl-2">
                  <p className="text-left text-white truncate">{home}</p>
                  <p className="text-left text-fourth truncate">{away}</p>
                </div>

                <div className="flex flex-row justify-start w-[35%] md:w-[25%] min-w-[3.75rem] md:min-w-[6rem] text-left">
                  {/* Sets */}
                  <div>
                    <p className="pr-1 md:pr-2.5 font-semibold text-white">
                      {homeSets}
                    </p>
                    <p className="pr-1 md:pr-2.5 font-semibold text-white">
                      {awaySets}
                    </p>
                  </div>

                  {/* First set games */}
                  <div>
                    {homeGamesFirstSet && homeGamesFirstSet > 9 ? (
                      <p className="pr-0.5">
                        {String(homeGamesFirstSet).slice(0, 1)}
                        <sup>{String(homeGamesFirstSet).slice(1)}</sup>
                      </p>
                    ) : (
                      <p className="pr-1 md:pr-2.5">{homeGamesFirstSet}</p>
                    )}
                    {awayGamesFirstSet && awayGamesFirstSet > 9 ? (
                      <p className="pr-0.5">
                        {String(awayGamesFirstSet).slice(0, 1)}
                        <sup>{String(awayGamesFirstSet).slice(1)}</sup>
                      </p>
                    ) : (
                      <p className="pr-1 md:pr-2.5">{awayGamesFirstSet}</p>
                    )}
                  </div>

                  {/* Second set games */}
                  <div>
                    {homeGamesSecondSet && homeGamesSecondSet > 9 ? (
                      <p className="pr-0.5">
                        {String(homeGamesSecondSet).slice(0, 1)}
                        <sup>{String(homeGamesSecondSet).slice(1)}</sup>
                      </p>
                    ) : (
                      <p className="pr-1 md:pr-2.5">{homeGamesSecondSet}</p>
                    )}
                    {awayGamesSecondSet && awayGamesSecondSet > 9 ? (
                      <p className="pr-0.5">
                        {String(awayGamesSecondSet).slice(0, 1)}
                        <sup>{String(awayGamesSecondSet).slice(1)}</sup>
                      </p>
                    ) : (
                      <p className="pr-1 md:pr-2.5">{awayGamesSecondSet}</p>
                    )}
                  </div>

                  {/* Third set games */}
                  {homeGamesThirdSet !== 0 && awayGamesThirdSet !== 0 ? (
                    <div>
                      {Number(homeGamesThirdSet) > 9 ? (
                        <p className="pr-0.5">
                          {String(homeGamesThirdSet).slice(0, 1)}
                          <sup>{String(homeGamesThirdSet).slice(1)}</sup>
                        </p>
                      ) : (
                        <p className="pr-1 md:pr-2.5">{homeGamesThirdSet}</p>
                      )}
                      {Number(awayGamesThirdSet) > 9 ? (
                        <p className="pr-0.5">
                          {String(awayGamesThirdSet).slice(0, 1)}
                          <sup>{String(awayGamesThirdSet).slice(1)}</sup>
                        </p>
                      ) : (
                        <p className="pr-1 md:pr-2.5">{awayGamesThirdSet}</p>
                      )}
                    </div>
                  ) : null}

                  {/* Fourth set games */}
                  {homeGamesFourthSet !== 0 && awayGamesFourthSet !== 0 ? (
                    <div>
                      {Number(homeGamesFourthSet) > 9 ? (
                        <p className="pr-0.5">
                          {String(homeGamesFourthSet).slice(0, 1)}
                          <sup>{String(homeGamesFourthSet).slice(1)}</sup>
                        </p>
                      ) : (
                        <p className="pr-1 md:pr-2.5">{homeGamesFourthSet}</p>
                      )}
                      {Number(awayGamesFourthSet) > 9 ? (
                        <p className="pr-0.5">
                          {String(awayGamesFourthSet).slice(0, 1)}
                          <sup>{String(awayGamesFourthSet).slice(1)}</sup>
                        </p>
                      ) : (
                        <p className="pr-1 md:pr-2.5">{awayGamesFourthSet}</p>
                      )}
                    </div>
                  ) : null}

                  {/* Fifth set games */}
                  {homeGamesFifthSet !== 0 && awayGamesFifthSet !== 0 ? (
                    <div>
                      {Number(homeGamesFifthSet) > 9 ? (
                        <p className="pr-0.5">
                          {String(homeGamesFifthSet).slice(0, 1)}
                          <sup>{String(homeGamesFifthSet).slice(1)}</sup>
                        </p>
                      ) : (
                        <p className="pr-1 md:pr-2.5">{homeGamesFifthSet}</p>
                      )}
                      {Number(awayGamesFifthSet) > 9 ? (
                        <p className="pr-0.5">
                          {String(awayGamesFifthSet).slice(0, 1)}
                          <sup>{String(awayGamesFifthSet).slice(1)}</sup>
                        </p>
                      ) : (
                        <p className="pr-1 md:pr-2.5">{awayGamesFifthSet}</p>
                      )}
                    </div>
                  ) : null}
                </div>

                <p
                  onClick={handleToggleOdds}
                  className="w-[8%] md:w-[10%] min-w-[2rem] self-center"
                >
                  {getFormattedOdds(homeOdds, oddsFormat)}
                </p>
                <p
                  onClick={handleToggleOdds}
                  className="w-[8%] md:w-[10%] min-w-[2rem] self-center"
                >
                  {getFormattedOdds(awayOdds, oddsFormat)}
                </p>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export { TournamentResults };
