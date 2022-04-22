import React, { FC, useEffect, useState } from "react";
import { GoChevronDown } from "react-icons/go";
import { MatchEntity, PlayerProfile } from "../../../types";
import { getLastAndFirstInitial } from "../../../utils/getLastAndFirstInitial";
import { SurfaceBadge } from "../../SurfaceBadge";

interface Props {
  match?: MatchEntity;
  homeProfile?: PlayerProfile;
  awayProfile?: PlayerProfile;
}

const Head2Head: FC<Props> = ({ match, homeProfile, awayProfile }) => {
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  let { homeH2h, awayH2h, headToHeadMatches } = match || {};

  const { image: homeImage, name: homeName } = homeProfile || {};
  const { image: awayImage, name: awayName } = awayProfile || {};

  const toggleActive = () => setIsPanelOpen(!isPanelOpen);

  useEffect(() => {
    if (match) {
    }
  }, [match]);

  return (
    <div
      onClick={toggleActive}
      className={`bg-secondary rounded-sm w-full p-3 md:px-[6%] md:py-6 pb-4 select-none hover:bg-primary cursor-pointer ${
        !isPanelOpen && "hover:animate-pulse"
      }`}
    >
      <div className="relative flex flex-row justify-center items-center font-Signika text-white text-sm tracking-tighter">
        <h1 className="truncate text-center pb-2">H2H</h1>
        <GoChevronDown
          className={`ml-2 -mr-3 -mt-2 text-xl ${isPanelOpen && "rotate-180"}`}
        />
      </div>

      {/* Summary H2H */}
      <div className="flex flex-row justify-between items-center px-4">
        {/* Home */}
        <div className="flex flex-row justify-center items-center">
          <img
            src={homeImage}
            className={`object-cover h-9 w-9 min-h-[2.25rem] min-w-[2.25rem] rounded-full ${
              !homeImage && "bg-primary animate-pulse"
            }`}
          />
          <div className="flex flex-col justify-start text-white">
            <p className="text-base font-bold ml-2">{homeH2h}</p>
            <p className="ml-2">
              {homeName && getLastAndFirstInitial(homeName)}
            </p>
          </div>
        </div>

        {/* Away */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col justify-start text-white">
            <p className="text-right text-base font-bold mr-2">{awayH2h}</p>
            <p className="mr-2">
              {awayName && getLastAndFirstInitial(awayName)}
            </p>
          </div>
          <img
            src={awayImage}
            className={`object-cover h-9 w-9 min-h-[2.25rem] min-w-[2.25rem] rounded-full ${
              !awayImage && "bg-primary animate-pulse"
            }`}
          />
        </div>
      </div>

      {/* Matches */}
      {isPanelOpen && (
        <div className="flex flex-col justify-center items-center pb-2 pt-6">
          {headToHeadMatches &&
            (headToHeadMatches.length ? (
              headToHeadMatches.map(
                ({ tournament, home, away, year, surface, result }, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-start py-2 text-xs text-fourth w-full px-3"
                  >
                    <div className="flex flex-row items-center w-full pb-2">
                      <div className="h-2 w-2 mr-1.5">
                        <SurfaceBadge surface={surface ?? "hard"} />
                      </div>
                      <p>{tournament}</p>
                    </div>
                    <div className="flex flex-row justify-between w-full">
                      {/* Date */}
                      <div className="flex flex-col justify-center text-[0.6rem] text-center">
                        <p>{year}</p>
                        <p>FT</p>
                      </div>

                      {/* Players */}
                      <div className="flex flex-col justify-start w-1/3">
                        <p className="text-white">{home}</p>
                        <p>{away}</p>
                      </div>

                      {/* Results: Games */}
                      <div className="flex flex-row w-1/4">
                        {/* First set */}
                        <div className="flex flex-col pr-3">
                          <p className="text-white">
                            {result?.homeGamesFirstSet}
                          </p>
                          <p>{result?.awayGamesFirstSet}</p>
                        </div>

                        {/* Second set */}
                        <div className="flex flex-col pr-3">
                          <p className="text-white">
                            {result?.homeGamesSecondSet}
                          </p>
                          <p>{result?.awayGamesSecondSet}</p>
                        </div>

                        {/* Possible third set */}
                        {result?.homeGamesThirdSet ||
                        result?.awayGamesThirdSet ? (
                          <div className="flex flex-col pr-3">
                            <p className="text-white">
                              {result?.homeGamesThirdSet}
                            </p>
                            <p>{result?.awayGamesThirdSet}</p>
                          </div>
                        ) : null}

                        {/* Possible fourth set */}
                        {result?.homeGamesFourthSet ||
                        result?.awayGamesFourthSet ? (
                          <div className="flex flex-col pr-3">
                            <p className="text-white">
                              {result?.homeGamesFourthSet}
                            </p>
                            <p>{result?.awayGamesFourthSet}</p>
                          </div>
                        ) : null}

                        {/* Possible fifth set */}
                        {result?.homeGamesFifthSet ||
                        result?.awayGamesFifthSet ? (
                          <div className="flex flex-col pr-3">
                            <p className="text-white">
                              {result?.homeGamesFifthSet}
                            </p>
                            <p>{result?.awayGamesFifthSet}</p>
                          </div>
                        ) : null}
                      </div>

                      {/* Results: Sets */}
                      <div className="flex flex-col">
                        <p className="text-white">{result?.homeSets}</p>
                        <p>{result?.awaySets}</p>
                      </div>
                    </div>
                  </div>
                )
              )
            ) : (
              <p>This is their first time facing each other.</p>
            ))}
        </div>
      )}
    </div>
  );
};

export { Head2Head };
