import React, { Dispatch, FC, SetStateAction } from "react";
import { CountrySection } from "../CountrySection";
import { FormSection } from "../FormSection";
import { StreakSection } from "../StreakSection";

interface Props {
  setActivePlayerId: Dispatch<SetStateAction<string | undefined>>;
}

const StatsPanels: FC<Props> = ({ setActivePlayerId }) => {
  const sectionProps = { setActivePlayerId };
  return (
    <div className="flex flex-col mb-10 md:mb-0">
      <div className="w-full md:w-[20vw] mb-4">
        <CountrySection {...sectionProps} />
      </div>
      <div className="w-full md:w-[20vw] mb-4">
        <FormSection {...sectionProps} />
      </div>
      <div className="w-full md:w-[20vw]">
        <StreakSection {...sectionProps} />
      </div>
      {/* <div className="w-full md:w-[20vw] mb-4">
        <EloSection {...sectionProps} />
      </div> */}
    </div>
  );
};

export { StatsPanels };
