import { Dispatch, FC, SetStateAction, useState } from "react";
import { GoChevronDown } from "react-icons/go";
import useSWR from "swr";
import { MatchPlayerProfilesAndSurfaceRecords } from "../../../types";
import { SectionSkeleton } from "../SectionSkeleton";
import { MatchDominanceCard } from "./MatchDominanceCard";

interface Props {
  setActivePlayerId: Dispatch<SetStateAction<string | undefined>>;
}

const SurfaceSection: FC<Props> = ({ setActivePlayerId }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const { data: matches } =
    useSWR<MatchPlayerProfilesAndSurfaceRecords[]>("/api/stats/surface");

  // Toggle expand
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const matchDominanceCardProps = { setActivePlayerId };

  return (
    <div className="bg-tertiary rounded-md w-auto p-3 select-none">
      <div
        onClick={toggleExpand}
        className="flex flex-row justify-between items-center -mt-1 font-Signika text-xl text-white tracking-tighter cursor-pointer transition-all"
      >
        <h1 className="truncate">Surface Dominance 💪🏽</h1>
        <GoChevronDown className={`text-xl ${isExpanded && "rotate-180"}`} />
      </div>

      <div
        className={`overflow-scroll pt-2 ${
          !isExpanded ? "max-h-[17rem] pb-3" : "max-h-[40rem]"
        }`}
      >
        {!matches ? (
          <SectionSkeleton />
        ) : (
          matches.map((match, index) => (
            <MatchDominanceCard
              key={index}
              match={match}
              {...matchDominanceCardProps}
            />
          ))
        )}
      </div>
    </div>
  );
};

export { SurfaceSection };
