import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { GoChevronDown } from "react-icons/go";
import useSWR from "swr";
import { PlayerEntity } from "../../../types";
import { PlayerStreakCard } from "./PlayerStreakCard";

interface Props {
  setActivePlayerId: Dispatch<SetStateAction<string | undefined>>;
}

const StreakSection: FC<Props> = ({ setActivePlayerId }) => {
  const [players, setPlayers] = useState<PlayerEntity[] | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { data: streaks } = useSWR<PlayerEntity[]>("/api/stats/streak");

  // Toggle expand
  const toggleExpand = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    if (streaks) {
      // Show only 5 players
      if (!isExpanded) setPlayers(streaks.slice(0, 5));
      // Show 10 players
      else setPlayers(streaks);
    }
  }, [streaks, isExpanded]);

  const playerStreakCardProps = { setActivePlayerId };

  return (
    <div className="bg-tertiary rounded-md w-auto p-3 select-none">
      <div
        onClick={toggleExpand}
        className="flex flex-row justify-between items-center -mt-1 mb-3 font-Signika text-xl text-white tracking-tighter cursor-pointer transition-all"
      >
        <h1 className="truncate">Streaks 🔥</h1>
        <GoChevronDown className={`text-xl ${isExpanded && "rotate-180"}`} />
      </div>

      {players?.map((player) => (
        <PlayerStreakCard
          key={player?.playerId}
          player={player}
          {...playerStreakCardProps}
        />
      ))}
    </div>
  );
};

export { StreakSection };
