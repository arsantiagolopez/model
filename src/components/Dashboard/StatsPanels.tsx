import React, { Dispatch, FC, SetStateAction } from "react";
import { CountrySection } from "../Sections/CountrySection";
import { FormSection } from "../Sections/FormSection";
import { RustSection } from "../Sections/RustSection";
import { StreakSection } from "../Sections/StreakSection";
import { SurfaceSection } from "../Sections/SurfaceSection";

interface Props {
  setActivePlayerId: Dispatch<SetStateAction<string | undefined>>;
}

const StatsPanels: FC<Props> = ({ setActivePlayerId }) => {
  const sectionProps = { setActivePlayerId };
  return (
    <div className="flex flex-col flex-wrap max-h-[100%] lg:max-h-[200vh] mb-10 md:mb-0 md:w-[20vw] md:min-w-[15rem]">
      <div className="w-full mb-4 mr-4">
        <CountrySection {...sectionProps} />
      </div>
      <div className="w-full mb-4 mr-4">
        <FormSection {...sectionProps} />
      </div>
      <div className="w-full mb-4 mr-4">
        <StreakSection {...sectionProps} />
      </div>
      <div className="w-full mb-4 mr-4">
        <RustSection {...sectionProps} />
      </div>
      <div className="w-full mb-4 mr-4">
        <SurfaceSection {...sectionProps} />
      </div>
      {/* <div className="w-full md:w-[20vw] mb-4">
        <EloSection {...sectionProps} />
      </div> */}
    </div>
  );
};

export { StatsPanels };
