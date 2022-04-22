import React, { FC } from "react";

interface Props {
  surface?: string;
  withText?: boolean;
}

const SurfaceBadge: FC<Props> = ({ surface, withText }) =>
  surface ? (
    <div
      className={`flex flex-row items-center w-full h-full rounded-sm self-center capitalize ${
        surface === "clay"
          ? "bg-orange-700"
          : surface === "hard"
          ? "bg-blue-500"
          : surface === "grass"
          ? "bg-green-400"
          : surface === "indoors"
          ? "bg-yellow-400"
          : null
      }`}
    >
      {withText ? (
        <span className="px-1.5 text-[0.6rem] tracking-tight">{surface}</span>
      ) : null}
    </div>
  ) : null;

export { SurfaceBadge };
