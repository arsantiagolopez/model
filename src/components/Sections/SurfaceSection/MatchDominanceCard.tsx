import React, {
  Dispatch,
  FC,
  MouseEventHandler,
  SetStateAction,
  useContext,
} from "react";
import { PreferencesContext } from "../../../context/PreferencesContext";
import { MatchPlayerProfilesAndSurfaceRecords } from "../../../types";
import { getFormattedOdds } from "../../../utils/getFormattedOdds";
import { getLastAndFirstInitial } from "../../../utils/getLastAndFirstInitial";
import { Avatar } from "../../Avatar";
import { SurfaceBadge } from "../../SurfaceBadge";

interface Props {
  match: MatchPlayerProfilesAndSurfaceRecords;
  setActivePlayerId: Dispatch<SetStateAction<string | undefined>>;
}

const MatchDominanceCard: FC<Props> = ({ match, setActivePlayerId }) => {
  const {
    match: matchEntity,
    homeProfile,
    awayProfile,
    homeCurrentSurfaceRecord,
    awayCurrentSurfaceRecord,
  } = match;

  const { name: homeName, image: homeImage } = homeProfile || {};
  const { name: awayName, image: awayImage } = awayProfile || {};

  const { homeLink, homeOdds, awayOdds } = matchEntity || {};

  const { oddsFormat, toggleOdds } = useContext(PreferencesContext);

  // Toggle odds
  const handleToggleOdds: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    toggleOdds();
  };

  const homeRecord = `${homeCurrentSurfaceRecord.win}/${homeCurrentSurfaceRecord.loss}`;
  const awayRecord = `${awayCurrentSurfaceRecord.win}/${awayCurrentSurfaceRecord.loss}`;

  const homeAvatarProps = { image: homeImage, width: "2.5rem" };
  const awayAvatarProps = { image: awayImage, width: "2.5rem" };

  return (
    <div
      onClick={() => homeLink && setActivePlayerId(homeLink)}
      className="flex flex-row justify-between items-center px-2 py-1.5 hover:bg-secondary rounded-sm text-xs text-fourth cursor-pointer"
    >
      {/* Home info */}
      <div className="flex flex-row justify-start items-center w-full max-w-[50%]">
        <div className="w-[15%] flex justify-start">
          <Avatar {...homeAvatarProps} />
        </div>

        <div
          onClick={handleToggleOdds}
          className="flex flex-col text-left ml-7"
        >
          <p className="truncate">
            {homeName && getLastAndFirstInitial(homeName)}
          </p>
          <div className="flex flex-row items-center text-xs text-white font-semibold truncate">
            <div className="h-2.5 w-2.5 mr-1">
              <SurfaceBadge surface={match?.match.surface} />
            </div>
            {homeRecord}{" "}
            <span className="font-normal text-fourth text-[0.6rem]">
              ({getFormattedOdds(homeOdds, oddsFormat)})
            </span>
            <span className="text-base">
              {/* {Math.abs(homeDaysSinceLastMatch) > 50 ? " 💥" : " "} */}
            </span>
          </div>
        </div>
      </div>

      {/* Away info */}
      <div className="flex flex-row justify-end items-center w-full max-w-[50%]">
        <div
          onClick={handleToggleOdds}
          className="z-10 flex flex-col text-right mr-7"
        >
          <p className="truncate">
            {awayName && getLastAndFirstInitial(awayName)}
          </p>
          <div className="flex flex-row justify-end items-center text-xs text-white font-semibold truncate">
            <span className="text-base">
              {/* {Math.abs(awayDaysSinceLastMatch) > 50 && "💥 "} */}
            </span>
            <span className="font-normal text-fourth text-[0.6rem]">
              ({getFormattedOdds(awayOdds, oddsFormat)})
            </span>{" "}
            {awayRecord}
            <div className="h-2.5 w-2.5 ml-1">
              <SurfaceBadge surface={match?.match.surface} />
            </div>
          </div>
        </div>

        <div className="w-[15%] flex justify-end">
          <Avatar {...awayAvatarProps} />
        </div>
      </div>
    </div>
  );
};

export { MatchDominanceCard };
