import React, { Dispatch, FC, SetStateAction } from "react";
import { PlayerEntity } from "../../../types";
import { Avatar } from "../../Avatar";
import { FormGraph } from "../../FormGraph";

interface Props {
  player?: PlayerEntity;
  setActivePlayerId: Dispatch<SetStateAction<string | undefined>>;
}

const PlayerStreakCard: FC<Props> = ({ player, setActivePlayerId }) => {
  const { playerId, profile, lastMatches, streak } = player || {};
  let { image, name } = profile || {};

  // Format name in "Federed R." format
  let [last, ...names] = name!.split(" ");
  const initial = names[names.length - 1].charAt(0) + ".";
  name = `${last} ${initial}`;

  const wins = lastMatches?.reduce(
    (acc, { home, result }) => (home === result?.winner ? ++acc : acc),
    0
  );
  const losses = lastMatches && wins && lastMatches.length - wins;
  const record = wins && losses ? `(${wins}-${losses})` : null;

  const avatarProps = { image, width: "2.5rem" };
  const formGraphProps = {
    lastMatches,
    graphHeight: "h-10",
    graphGap: 0.1,
  };

  return (
    <div
      onClick={() => playerId && setActivePlayerId(playerId)}
      className="flex flex-row justify-start items-center px-2 py-0.5 hover:bg-secondary rounded-sm text-xs text-white cursor-pointer"
    >
      <div className="w-[15%] flex justify-center">
        <Avatar {...avatarProps} />
      </div>

      <div className="flex flex-col justify-center items-start w-[85%] px-2">
        {/* Details */}
        <div className="flex flex-row w-full">
          <p className="mr-1">{name}</p>
          <p>
            {record} {streak} 🔥
          </p>
        </div>

        {/* Form graph */}
        <div className="h-full w-[100%]">
          <FormGraph {...formGraphProps} />
        </div>
      </div>
    </div>
  );
};

export { PlayerStreakCard };
