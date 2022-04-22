import React, { FC, MouseEventHandler, useContext } from "react";
import { PreferencesContext } from "../../context/PreferencesContext";
import { MatchEntity } from "../../types";
import { getDayAndTimeFromDate } from "../../utils/getDayAndTimeFromDate";
import { getFormattedOdds } from "../../utils/getFormattedOdds";

interface Props {
  matches?: MatchEntity[];
}

const NextMatches: FC<Props> = ({ matches }) => {
  const { toggleOdds } = useContext(PreferencesContext);

  // Toggle odds
  const handleToggleOdds: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    toggleOdds();
  };

  return (
    <div className="flex flex-col my-4 w-full">
      <h1 className="font-Signika tracking-tight text-xl mb-2">Next Matches</h1>
      <div className="rounded-md bg-tertiary p-2 md:p-4 text-fourth text-xs w-full">
        <div className="flex flex-row w-full bg-primary text-center font-semibold py-1 my-1 rounded-sm hover:bg-black text-white">
          <p className="w-[10%] min-w-[3rem]">Start</p>
          <p className="w-[10%] min-w-[3rem]">Round</p>
          <p className="w-[50%] min-w-[6rem] md:min-w-[9rem] text-left px-2">
            Headline
          </p>
          <p className="w-[10%] min-w-[3rem]">H2H</p>
          <p className="w-[10%] min-w-[3rem]">Home</p>
          <p className="w-[10%] min-w-[3rem]">Away</p>
        </div>
        {matches?.map(
          ({
            matchId,
            round,
            date,
            home,
            away,
            homeH2h,
            awayH2h,
            homeOdds,
            awayOdds,
          }) => {
            // Get day and time from date
            const { day, time } = getDayAndTimeFromDate(date);

            return (
              <div
                key={matchId}
                className="flex flex-row w-full text-center py-1 hover:bg-secondary cursor-pointer"
              >
                <div className="flex flex-col justify-center items-center w-[10%] min-w-[3rem] px-2">
                  <p className="text-[0.65rem] tracking-tighter">{day}</p>
                  {time}
                </div>
                <p className="w-[10%] min-w-[3rem] flex justify-center items-center px-2">
                  {round}
                </p>
                <div className="flex flex-col items-start w-[50%] min-w-[6rem] md:min-w-[9rem] px-2">
                  <p className="text-left">{home}</p>
                  <p className="text-left">{away}</p>
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
            );
          }
        )}
      </div>
    </div>
  );
};

export { NextMatches };
