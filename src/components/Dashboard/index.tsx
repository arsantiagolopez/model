import moment from "moment";
import React, { FC } from "react";

interface Props {}

const Dashboard: FC<Props> = () => {
  const tomorrow = moment(new Date()).add(1, "day").format("M/D/yyyy");
  return (
    <div className="flex flex-col w-full h-full text-white">
      <h1 className="text-3xl md:text-4xl text-white font-Signika font-bold tracking-tight">
        Tomorrow's ATP, WTA, and ITF Matches
      </h1>
      <p className="text-fourth text-xs font-light py-2">{tomorrow}</p>
    </div>
  );
};

export { Dashboard };
