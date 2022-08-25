import React, { FC } from "react";

interface Props {
  isFive?: boolean;
}

const SectionSkeleton: FC<Props> = ({ isFive }) => (
  <div className="flex flex-col">
    {Array(isFive ? 5 : 12)
      .fill(0)
      .map((_, index) => (
        <div
          key={index}
          className="flex flex-row justify-start items-center px-1 py-1 hover:bg-secondary rounded-sm text-xs text-white cursor-pointer w-full"
        >
          {/* One card loading */}
          <div className="flex flex-row w-full animate-pulse">
            {/* Avatar */}
            <div className="w-11 h-11 min-w-[2.75rem] min-h-[2.75rem] rounded-full bg-primary" />

            <div className="flex flex-col justify-center items-start w-[85%] px-2">
              <div className="h-4 bg-primary rounded-md w-full" />
              <div className="h-4 bg-primary rounded-md w-2/3 mt-2" />
            </div>
          </div>

          {!isFive && (
            <div className="flex flex-row w-full">
              <div className="flex flex-col justify-center items-end w-[85%] px-2">
                <div className="h-4 bg-primary rounded-md w-full" />
                <div className="h-4 bg-primary rounded-md w-2/3 mt-2" />
              </div>

              {/* Avatar */}
              <div className="w-11 h-11 min-w-[2.75rem] min-h-[2.75rem] rounded-full bg-primary animate-pulse" />
            </div>
          )}
        </div>
      ))}
  </div>
);

export { SectionSkeleton };
