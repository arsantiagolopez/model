import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { GoChevronDown } from "react-icons/go";
import useSWR from "swr";
import { PlayerEntity } from "../../types";
import { PlayerFormCard } from "./PlayerFormCard";

interface Props {
  setActivePlayerId: Dispatch<SetStateAction<string | undefined>>;
}

const FormSection: FC<Props> = ({ setActivePlayerId }) => {
  const [players, setPlayers] = useState<PlayerEntity[] | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { data: top } = useSWR<PlayerEntity[]>("/api/stats/form");

  // Toggle expand
  const toggleExpand = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    if (top) {
      // Show only 5 players
      if (!isExpanded) setPlayers(top.slice(0, 5));
      // Show 10 players
      else setPlayers(top);
    }
  }, [top, isExpanded]);

  const playerFormCardProps = { setActivePlayerId };

  return (
    <div className="bg-tertiary rounded-md w-auto p-3 select-none">
      <div
        onClick={toggleExpand}
        className="flex flex-row justify-between items-center -mt-1 mb-3 font-Signika text-xl text-white tracking-tighter cursor-pointer transition-all"
      >
        <h1 className="truncate">Top Form</h1>
        <GoChevronDown className={`text-xl ${isExpanded && "rotate-180"}`} />
      </div>
      {players?.map((player) => (
        <PlayerFormCard
          key={player?.playerId}
          player={player}
          {...playerFormCardProps}
        />
      ))}
    </div>
  );
};

export { FormSection };
