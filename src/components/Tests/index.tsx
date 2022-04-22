import React, { FC } from "react";

interface Props {}

const Tests: FC<Props> = () => {
  return (
    <div className="flex flex-col w-full h-full text-white">
      <h1 className="text-3xl md:text-4xl text-white font-Signika font-bold tracking-tight">
        Units Tests
      </h1>
      <p className="text-fourth text-xs font-light py-2">{}</p>
    </div>
  );
};

export { Tests };
