import React, { Dispatch, FC, SetStateAction } from "react";

interface Props {
  setActivePlayerId: Dispatch<SetStateAction<string | undefined>>;
}

const EloSection: FC<Props> = () => {
  return (
    <div className="bg-tertiary rounded-md w-auto p-3 select-none">
      <div
        // onClick={toggleExpand}
        className="flex flex-row justify-between items-center -mt-1 mb-3 font-Signika text-xl text-white tracking-tighter cursor-pointer transition-all"
      >
        <h1 className="truncate">ELO Rankings</h1>
      </div>
    </div>
  );
};

export { EloSection };
