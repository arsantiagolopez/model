import React, { FC } from "react";
import { TestSummary } from "../TestSummary";

interface Props {}

const Tests: FC<Props> = () => {
  return (
    <div className="flex flex-col w-full h-full text-white">
      <h1 className="text-3xl md:text-4xl text-white font-Signika font-bold tracking-tight pb-6">
        Units Tests
      </h1>
      <div className="w-full md:w-[30vw]">
        <TestSummary />
      </div>
    </div>
  );
};

export { Tests };
