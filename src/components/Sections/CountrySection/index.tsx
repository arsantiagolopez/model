import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { GoChevronDown } from "react-icons/go";
import useSWR from "swr";
import { PlayerAndCountry } from "../../../types";
import { SectionSkeleton } from "../SectionSkeleton";
import { PlayerCountryCard } from "./PlayerCountryCard";

interface Props {
  setActivePlayerId: Dispatch<SetStateAction<string | undefined>>;
}

const CountrySection: FC<Props> = ({ setActivePlayerId }) => {
  const [players, setPlayers] = useState<PlayerAndCountry[] | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { data: playersAndCountry } =
    useSWR<PlayerAndCountry[]>("/api/stats/country");

  // Toggle expand
  const toggleExpand = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    if (playersAndCountry) {
      setPlayers(playersAndCountry);
    }
  }, [playersAndCountry, isExpanded]);

  const playerCountryCardProps = { setActivePlayerId };

  return (
    <div className="bg-tertiary rounded-md w-auto px-3 pt-3 select-none">
      <div
        onClick={toggleExpand}
        className="flex flex-row justify-between items-center -mt-1 font-Signika text-xl text-white tracking-tighter cursor-pointer transition-all"
      >
        <h1 className="truncate pr-2">Playing In Home Country</h1>
        <GoChevronDown className={`text-xl ${isExpanded && "rotate-180"}`} />
      </div>

      <div
        className={`overflow-scroll pt-2 ${
          !isExpanded ? "max-h-[17rem] pb-3" : "max-h-[40rem]"
        }`}
      >
        {!players ? (
          <SectionSkeleton isFive />
        ) : (
          players.map((player) => (
            <PlayerCountryCard
              key={player?.player?.playerId}
              player={player}
              {...playerCountryCardProps}
            />
          ))
        )}
      </div>
    </div>
  );
};

export { CountrySection };
