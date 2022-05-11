import React, { Dispatch, FC, SetStateAction } from "react";
import { PlayerAndCountry } from "../../../types";
import { getCountryEmoji } from "../../../utils/getCountryEmoji";
import { getLastAndFirstInitial } from "../../../utils/getLastAndFirstInitial";
import { Avatar } from "../../Avatar";

interface Props {
  player?: PlayerAndCountry;
  setActivePlayerId: Dispatch<SetStateAction<string | undefined>>;
}

const PlayerCountryCard: FC<Props> = ({ player, setActivePlayerId }) => {
  const { countryCode } = player || {};
  const { playerId, profile, lastMatches, upcomingMatch } =
    player?.player || {};
  let { image, name } = profile || {};

  let formattedName = name && getLastAndFirstInitial(name);

  const wins = lastMatches?.reduce(
    (acc, { home, result }) => (home === result?.winner ? ++acc : acc),
    0
  );
  const losses = lastMatches && wins && lastMatches.length - wins;
  const record = wins && losses ? `(${wins}-${losses})` : null;

  const avatarProps = { image, width: "2.5rem" };

  return (
    <div
      onClick={() => playerId && setActivePlayerId(playerId)}
      className="flex flex-row justify-start items-center px-2 py-1 hover:bg-secondary rounded-sm text-xs text-white cursor-pointer"
    >
      <div className="w-[15%] flex justify-center">
        <Avatar {...avatarProps} />
      </div>

      <div className="flex flex-col justify-center items-start w-[85%] px-2">
        {/* Tournament */}
        <div className="flex flex-row items-center w-full">
          <p className="text-xl">{getCountryEmoji(countryCode)}</p>
          <p className="text-xs text-fourth capitalize pl-1">
            {upcomingMatch?.tournament}
          </p>
        </div>

        {/* Details */}
        <div className="flex flex-row w-full">
          <p className="pr-1">{formattedName}</p>
          <p>{record}</p>
        </div>
      </div>
    </div>
  );
};

export { PlayerCountryCard };
