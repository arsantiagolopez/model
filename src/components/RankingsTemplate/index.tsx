import React, { FC } from "react";
import { RankingTable } from "./RankingTable";

interface Props {}

const RankingsTemplate: FC<Props> = () => {
  return (
    <div className="flex flex-col w-[25vw] h-full">
      <h1 className="text-3xl md:text-4xl text-white font-Signika font-bold tracking-tight -mt-1 md:-mt-2 mb-6">
        Rankings, ELOs...
      </h1>

      <div className="flex flex-col md:flex-row w-auto gap-4">
        {/* ATP Rankings */}
        <div className="rounded-md bg-tertiary p-2 md:p-4 text-white text-xs w-full mb-4 md:mb-10 md:py-2 md:px-4">
          <h1 className="font-Signika text-xl text-white tracking-tighter truncate">
            ATP
          </h1>

          <RankingTable tour="atp" />
        </div>

        {/* WTA Rankings */}
        <div className="rounded-md bg-tertiary p-2 md:p-4 text-white text-xs w-full mb-4 md:mb-10 md:py-2 md:px-4">
          <h1 className="font-Signika text-xl text-white tracking-tighter truncate">
            WTA
          </h1>

          <RankingTable tour="wta" />
        </div>
      </div>
    </div>
  );
};

export { RankingsTemplate };
