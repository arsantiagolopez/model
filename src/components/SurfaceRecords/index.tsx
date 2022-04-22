import React, { FC, MouseEventHandler, useState } from "react";
import { GrFormAdd, GrFormSubtract } from "react-icons/gr";
import { PlayerRecord } from "../../types";
import { SurfaceBadge } from "../SurfaceBadge";

interface Props {
  record?: PlayerRecord;
  currentSurface?: string;
  allSurfaces?: boolean;
}

const SurfaceRecords: FC<Props> = ({ record, currentSurface, allSurfaces }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(!!allSurfaces);

  const { years, all } = record || {};

  const toggleExpand: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const allSummaryRatio =
    all && Number(all.summary.win / all.summary.loss).toFixed(2);
  const allHardRatio = all && Number(all.hard.win / all.hard.loss).toFixed(2);
  const allClayRatio = all && Number(all.clay.win / all.clay.loss).toFixed(2);
  const allGrassRatio =
    all && Number(all.grass.win / all.grass.loss).toFixed(2);
  const allIndoorsRatio =
    all && Number(all.indoors.win / all.indoors.loss).toFixed(2);

  return (
    <div className="flex-col w-full">
      {/* Header */}
      <div
        className={`flex flex-row justify-around items-center w-full text-xs font-semibold text-white  rounded-sm ${
          allSurfaces && "bg-primary pr-1"
        }`}
      >
        <p className="flex-1 text-center">Year</p>
        <p className="flex-1 text-center">{allSurfaces ? "Summary" : "Sum."}</p>

        {/* Hard header */}
        <div
          className={`flex-1 flex flex-row justify-center items-center py-2 ${
            currentSurface === "hard" && "bg-secondary"
          }`}
        >
          {allSurfaces && <p className="hidden md:block md:pr-2">Hard</p>}
          <div className="h-2.5 w-2.5">
            <SurfaceBadge surface="hard" />
          </div>
        </div>

        {/* Clay header */}
        <div
          className={`flex-1 flex flex-row justify-center items-center py-2 ${
            currentSurface === "clay" && "bg-secondary"
          }`}
        >
          {allSurfaces && <p className="hidden md:block md:pr-2">Clay</p>}
          <div className="h-2.5 w-2.5">
            <SurfaceBadge surface="clay" />
          </div>
        </div>

        {/* Grass header */}
        <div
          className={`flex-1 flex flex-row justify-center items-center py-2 ${
            currentSurface === "grass" && "bg-secondary"
          }`}
        >
          {allSurfaces && <p className="hidden md:block md:pr-2">Grass</p>}
          <div className="h-2.5 w-2.5">
            <SurfaceBadge surface="grass" />
          </div>
        </div>

        {/* Show indoors only if allSurfaces flag on */}
        {allSurfaces && (
          <div
            className={`flex-1 flex flex-row justify-center items-center py-2 ${
              currentSurface === "grass" && "bg-secondary"
            }`}
          >
            <p className="hidden md:block md:pr-2">Indoors</p>
            <div className="h-2.5 w-2.5">
              <SurfaceBadge surface="indoors" />
            </div>
          </div>
        )}
      </div>

      {/* Rows */}
      <div className={`w-full ${allSurfaces && "pt-2"}`}>
        {/* Records per year */}
        {(isExpanded ? years : years?.slice(0, 3))?.map(
          ({ year, summary, hard, clay, grass, indoors }, index) => (
            <div
              key={index}
              className={`grid w-full text-fourth text-[0.6rem] text-center tracking-tight ${
                allSurfaces ? "grid-cols-6" : "grid-cols-5"
              }`}
            >
              {/* Year */}
              <p className="text-center font-bold text-white py-1">
                {allSurfaces ? year : String(year).slice(-2)}
              </p>

              {/* Summary */}
              <div className="flex flex-row justify-center hover:text-white py-1">
                <p>{summary?.win}</p>
                <p> / </p>
                <p>{summary?.loss}</p>
              </div>

              {/* Hard */}
              <div
                className={`flex flex-row justify-center hover:text-white py-1 ${
                  currentSurface === "hard" && "text-white bg-secondary"
                }`}
              >
                {Number.isFinite(hard?.win) && Number.isFinite(hard?.loss) ? (
                  <>
                    <p>{hard?.win}</p>
                    <p> / </p>
                    <p>{hard?.loss}</p>
                  </>
                ) : (
                  <p>–</p>
                )}
              </div>

              {/* Clay */}
              <div
                className={`flex flex-row justify-center hover:text-white py-1 ${
                  currentSurface === "clay" && "text-white bg-secondary"
                }`}
              >
                {Number.isFinite(clay?.win) && Number.isFinite(clay?.loss) ? (
                  <>
                    <p>{clay?.win}</p>
                    <p> / </p>
                    <p>{clay?.loss}</p>
                  </>
                ) : (
                  <p>-</p>
                )}
              </div>

              {/* Grass */}
              <div
                className={`flex flex-row justify-center hover:text-white py-1 ${
                  currentSurface === "grass" && "text-white bg-secondary"
                }`}
              >
                {Number.isFinite(grass?.win) && Number.isFinite(grass?.loss) ? (
                  <>
                    <p>{grass?.win}</p>
                    <p> / </p>
                    <p>{grass?.loss}</p>
                  </>
                ) : (
                  <p>–</p>
                )}
              </div>

              {/* Indoors */}
              {allSurfaces && (
                <div
                  className={`flex flex-row justify-center hover:text-white py-1 ${
                    currentSurface === "indoors" && "text-white bg-secondary"
                  }`}
                >
                  {Number.isFinite(indoors?.win) &&
                  Number.isFinite(indoors?.loss) ? (
                    <>
                      <p>{indoors?.win}</p>
                      <p> / </p>
                      <p>{indoors?.loss}</p>
                    </>
                  ) : (
                    <p>–</p>
                  )}
                </div>
              )}
            </div>
          )
        )}

        {/* Show more/less button */}
        {!allSurfaces && (
          <div
            onClick={toggleExpand}
            className="flex flex-row justify-center items-center w-full text-[0.6rem] text-fourth hover:text-white hover:animate-pulse rounded-sm py-0.5 cursor-pointer tracking-tighter"
          >
            {!isExpanded ? (
              <GrFormAdd className="mr-1 text-[0.5rem] text-white" />
            ) : (
              <GrFormSubtract className="mr-1 text-[0.5rem] text-white" />
            )}
            {!isExpanded ? "Show more" : "Show less"}{" "}
          </div>
        )}

        {/* All surfaces summary */}
        <div
          className={`grid w-full text-fourth text-[0.6rem] text-center tracking-tight ${
            allSurfaces ? "grid-cols-6 mt-3" : "grid-cols-5"
          }`}
        >
          {/* Year */}
          <p className="text-center font-bold text-white py-1 tracking-tighter">
            All %
          </p>

          {/* Summary */}
          <div className="flex flex-row justify-center hover:text-white py-1">
            <p>{allSummaryRatio}</p>
          </div>

          {/* Hard */}
          <div
            className={`flex flex-row justify-center hover:text-white py-1 ${
              currentSurface === "hard" && "text-white bg-secondary rounded-sm"
            }`}
          >
            <p>{allHardRatio}</p>
          </div>

          {/* Clay */}
          <div
            className={`flex flex-row justify-center hover:text-white py-1 ${
              currentSurface === "clay" && "text-white bg-secondary rounded-sm"
            }`}
          >
            <p>{allClayRatio}</p>
          </div>

          {/* Grass */}
          <div
            className={`flex flex-row justify-center hover:text-white py-1 ${
              currentSurface === "grass" && "text-white bg-secondary rounded-sm"
            }`}
          >
            <p>{allGrassRatio}</p>
          </div>

          {/* Indoors */}
          {allSurfaces && (
            <div
              className={`flex flex-row justify-center hover:text-white py-1 ${
                currentSurface === "indoors" &&
                "text-white bg-secondary rounded-sm"
              }`}
            >
              <p>{allIndoorsRatio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { SurfaceRecords };
