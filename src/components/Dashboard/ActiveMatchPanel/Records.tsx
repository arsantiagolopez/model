import React, { FC, useState } from "react";
import { GoChevronDown } from "react-icons/go";
import useSWR from "swr";
import { MatchEntity, PlayerRecord } from "../../../types";
import { SurfaceRecords } from "../../SurfaceRecords";

interface Props {
  match?: MatchEntity;
  homeLink?: string;
  awayLink?: string;
}

const Records: FC<Props> = ({ match, homeLink, awayLink }) => {
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);

  const { data: homeRecord } = useSWR<PlayerRecord>(
    homeLink &&
      `/api/players/records/${homeLink
        ?.replace("/player/", "")
        .replace("/", "")}`
  );

  const { data: awayRecord } = useSWR<PlayerRecord>(
    awayLink &&
      `/api/players/records/${awayLink
        ?.replace("/player/", "")
        .replace("/", "")}`
  );

  const toggleActive = () => setIsPanelOpen(!isPanelOpen);

  const currentSurface = match?.surface;

  const homeSurfaceRecordsProps = {
    record: homeRecord,
    allSurfaces: false,
    currentSurface,
  };
  const awaySurfaceRecordsProps = {
    record: awayRecord,
    allSurfaces: false,
    currentSurface,
  };

  return (
    <div
      onClick={toggleActive}
      className={`py-4 w-full cursor-pointer ${
        !isPanelOpen && "hover:animate-pulse"
      }`}
    >
      <div className="relative flex flex-row justify-center items-center rounded-sm select-none font-Signika text-white text-sm tracking-tighter bg-secondary w-full p-3 md:px-[6%] md:py-1.5 hover:bg-primary">
        <h1 className="truncate text-center">Records</h1>
        <GoChevronDown
          className={`ml-2 -mr-3 text-xl ${isPanelOpen && "rotate-180"}`}
        />
      </div>

      {/* Matches */}
      {isPanelOpen && (
        <div className="flex flex-row justify-center items-start py-3 w-full">
          {/* Home records */}
          <div className="w-full px-[2%]">
            <SurfaceRecords {...homeSurfaceRecordsProps} />
          </div>

          {/* Away records */}
          <div className="w-full px-[2%]">
            <SurfaceRecords {...awaySurfaceRecordsProps} />
          </div>
        </div>
      )}
    </div>
  );
};

export { Records };
