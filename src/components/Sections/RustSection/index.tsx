import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { GoChevronDown } from "react-icons/go";
import useSWR from "swr";
import { MatchPlayerProfilesAndDates } from "../../../types";
import { SectionSkeleton } from "../SectionSkeleton";
import { MatchRustCard } from "./MatchRustCard";

interface Props {
  setActivePlayerId: Dispatch<SetStateAction<string | undefined>>;
}

const RustSection: FC<Props> = ({ setActivePlayerId }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { data: matches } =
    useSWR<MatchPlayerProfilesAndDates[]>("/api/stats/rust");

  // Toggle expand
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const matchRustCardProps = { setActivePlayerId };

  return (
    <div className="bg-tertiary rounded-md w-auto p-3 select-none">
      <div
        onClick={toggleExpand}
        className="flex flex-row justify-between items-center -mt-1 font-Signika text-xl text-white tracking-tighter cursor-pointer transition-all"
      >
        <h1 className="truncate">Most Days Since Last Match</h1>
        <GoChevronDown className={`text-xl ${isExpanded && "rotate-180"}`} />
      </div>

      <div
        className={`overflow-scroll pt-2 ${
          !isExpanded ? "max-h-[17rem] pb-3" : "max-h-[40rem]"
        }`}
      >
        {!matches ? (
          <SectionSkeleton isFive />
        ) : (
          matches.map((match, index) => (
            <MatchRustCard key={index} match={match} {...matchRustCardProps} />
          ))
        )}
      </div>
    </div>
  );
};

export { RustSection };
