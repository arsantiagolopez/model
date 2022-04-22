import React, { FC } from "react";
import { RoundPrizeRank } from "../../types";

interface Props {
  details?: RoundPrizeRank[] | undefined;
}

const TournamentDetails: FC<Props> = ({ details }) => (
  <div className="flex flex-col my-4 w-full">
    <h1 className="font-Signika tracking-tight text-xl mb-2">Details</h1>
    <div className="rounded-md bg-tertiary p-2 md:p-4 text-fourth text-xs w-full mb-10">
      <div className="flex flex-row bg-primary text-center font-semibold py-1 my-1 rounded-sm hover:bg-black w-full text-white">
        <p className="flex-1">Round</p>
        <p className="flex-1">Prize money</p>
        <p className="flex-1">Ranking points</p>
      </div>
      {details?.map(({ round, prize, rankingPoints }, index) => (
        <div
          key={index}
          className="flex flex-row w-full text-center py-1 hover:bg-secondary"
        >
          <p className="flex-1 min-w-[3rem] px-2 capitalize">{round}</p>
          <p className="flex-1 min-w-[3rem] px-2">{prize}</p>
          <p className="flex-1 min-w-[3rem] px-2">{rankingPoints}</p>
        </div>
      ))}
    </div>
  </div>
);

export { TournamentDetails };
