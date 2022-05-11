import React, {
  Dispatch,
  FC,
  MouseEventHandler,
  SetStateAction,
  useContext,
} from "react";
import { PreferencesContext } from "../../../context/PreferencesContext";
import { MatchPlayerProfilesAndDates } from "../../../types";
import { getFormattedOdds } from "../../../utils/getFormattedOdds";
import { getLastAndFirstInitial } from "../../../utils/getLastAndFirstInitial";
import { Avatar } from "../../Avatar";

interface Props {
  match: MatchPlayerProfilesAndDates;
  setActivePlayerId: Dispatch<SetStateAction<string | undefined>>;
}

const MatchRustCard: FC<Props> = ({ match, setActivePlayerId }) => {
  const {
    match: matchEntity,
    homeProfile,
    awayProfile,
    homeDaysSinceLastMatch,
    awayDaysSinceLastMatch,
  } = match;

  const { name: homeName, image: homeImage } = homeProfile;
  const { name: awayName, image: awayImage } = awayProfile;

  const { homeLink, homeOdds, awayOdds } = matchEntity;

  const { oddsFormat, toggleOdds } = useContext(PreferencesContext);

  // Toggle odds
  const handleToggleOdds: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    toggleOdds();
  };

  const homeAvatarProps = { image: homeImage, width: "2.5rem" };
  const awayAvatarProps = { image: awayImage, width: "2.5rem" };

  return (
    <div
      onClick={() => homeLink && setActivePlayerId(homeLink)}
      className="flex flex-row justify-between items-center px-2 py-1.5 hover:bg-secondary rounded-sm text-xs text-fourth cursor-pointer"
    >
      {/* Home info */}
      <div className="flex flex-row justify-start w-full max-w-[50%]">
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
          <p className="text-xs text-white font-semibold truncate">
            {Math.abs(homeDaysSinceLastMatch)}d{" "}
            <span className="font-normal text-fourth text-[0.6rem]">
              ({getFormattedOdds(homeOdds, oddsFormat)})
            </span>
            <span className="text-base">
              {Math.abs(homeDaysSinceLastMatch) > 50 ? " 💥" : " "}
            </span>
          </p>
        </div>
      </div>

      {/* Away info */}
      <div className="flex flex-row justify-end w-full max-w-[50%]">
        <div
          onClick={handleToggleOdds}
          className="z-10 flex flex-col text-right mr-7"
        >
          <p className="truncate">
            {awayName && getLastAndFirstInitial(awayName)}
          </p>
          <p className="text-xs text-white font-semibold truncate">
            <span className="text-base">
              {Math.abs(awayDaysSinceLastMatch) > 50 && "💥 "}
            </span>
            <span className="font-normal text-fourth text-[0.6rem]">
              ({getFormattedOdds(awayOdds, oddsFormat)})
            </span>{" "}
            {Math.abs(awayDaysSinceLastMatch)}d{" "}
          </p>
        </div>

        <div className="w-[15%] flex justify-end">
          <Avatar {...awayAvatarProps} />
        </div>
      </div>
    </div>
  );
};

export { MatchRustCard };
