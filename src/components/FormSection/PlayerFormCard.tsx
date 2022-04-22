import React, { Dispatch, FC, SetStateAction } from "react";
import { PlayerEntity } from "../../types";
import { getLastAndFirstInitial } from "../../utils/getLastAndFirstInitial";
import { FormGraph } from "../FormGraph";

interface Props {
  player?: PlayerEntity;
  setActivePlayerId: Dispatch<SetStateAction<string | undefined>>;
}

const PlayerFormCard: FC<Props> = ({ player, setActivePlayerId }) => {
  const { playerId, profile, lastMatches } = player || {};
  let { image, name } = profile || {};

  let formattedName = name && getLastAndFirstInitial(name);

  const wins = lastMatches?.reduce(
    (acc, { home, result }) => (home === result?.winner ? ++acc : acc),
    0
  );
  const losses = lastMatches && wins && lastMatches.length - wins;
  const record = wins && losses ? `(${wins}-${losses})` : null;

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
      <div className="w-[15%]">
        <img
          src={image}
          className="object-cover w-10 min-w-[2.5rem] h-10 min-h-[2.5rem] rounded-full"
        />
      </div>

      <div className="flex flex-col justify-center items-start w-[85%] px-2">
        {/* Details */}
        <div className="flex flex-row w-full">
          <p className="mr-1">{formattedName}</p>
          <p>{record}</p>
        </div>

        {/* Form graph */}
        <div className="h-full w-[100%]">
          <FormGraph {...formGraphProps} />
        </div>
      </div>
    </div>
  );
};

export { PlayerFormCard };
