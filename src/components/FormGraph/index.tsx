import moment from "moment";
import React, { FC, useEffect, useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer } from "recharts";
import { MatchEntity } from "../../types";

interface Props {
  lastMatches?: MatchEntity[];
  graphHeight: string;
  graphGap?: number;
  isDetailed?: boolean;
}

interface BarItem {
  name: string;
  value: number;
}

const FormGraph: FC<Props> = ({
  lastMatches,
  graphHeight,
  graphGap,
  isDetailed,
}) => {
  const [matches, setMatches] = useState<MatchEntity[] | null>(null);
  const [graphData, setGraphData] = useState<BarItem[]>([]);
  const [activeBar, setActiveBar] = useState<number>();

  // Merge singles & doubles matches into one array
  useEffect(() => {
    if (lastMatches) {
      // Get last 10 matches sorted by date (newest to oldest)
      const lastTen = lastMatches
        .sort((a, b) =>
          moment(b.date).valueOf() > moment(a.date).valueOf() ? 1 : -1
        )
        .slice(0, 10)
        .reverse();

      setMatches(lastTen);
    }
  }, [lastMatches]);

  // Create data points for bar graph
  useEffect(() => {
    if (matches) {
      const data: BarItem[] = matches.map(
        ({ homeOdds, awayOdds, away, result }) => {
          let value = 0;

          if (result) {
            const { homeSets, awaySets } = result;
            const winner = homeSets > awaySets ? "home" : "away";
            // Some lower league games might not have odds
            if (!homeOdds || !awayOdds) {
              value = winner === "home" ? 1.5 : -1.5;
            } else {
              value = winner === "home" ? homeOdds : -1 * awayOdds;
              value = value === 0 ? 0.1 : value;
            }
          }

          return { name: away, value };
        }
      );

      setGraphData(data);
    }
  }, [matches]);

  return (
    <div className="relative flex flex-col justify-center items-center w-full">
      <div className="absolute -top-1 flex flex-row justify-start w-full text-xs text-white h-10">
        {isDetailed && activeBar && matches ? (
          <div className="flex flex-col text-white">
            <p>
              {matches[activeBar]?.home} vs. {matches[activeBar]?.away}
            </p>
            <p>
              {matches[activeBar]?.result?.homeSets}–
              {matches[activeBar]?.result?.awaySets}
            </p>
          </div>
        ) : null}
      </div>
      <div className={`w-full ${graphHeight}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={graphData}
            margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
            barCategoryGap={graphGap ?? 1.5}
            onMouseMove={(state) => {
              const { activeTooltipIndex } = state || {};

              if (activeTooltipIndex) {
                setActiveBar(activeTooltipIndex);
              } else {
                setActiveBar(undefined);
              }
            }}
            onMouseLeave={() => setActiveBar(undefined)}
          >
            <Bar dataKey="value">
              {graphData.map(({ value }, index) => (
                <Cell
                  key={index}
                  fill={
                    activeBar === index
                      ? // Handle active
                        value > 0
                        ? "#28d768"
                        : "#dc2626"
                      : // Handle inactive
                      value > 0
                      ? "#4ade80"
                      : "#ef4444"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export { FormGraph };
