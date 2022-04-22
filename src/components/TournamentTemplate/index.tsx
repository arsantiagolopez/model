import moment from "moment";
import React, { FC, useState } from "react";
import useSWR from "swr";
import { TournamentEntity } from "../../types";
import { getCountryEmoji } from "../../utils/getCountryEmoji";
import { NextMatches } from "../NextMatches";
import { SurfaceBadge } from "../SurfaceBadge";
import { PastYearResults } from "./PastYearResults";
import { TournamentDetails } from "./TournamentDetails";
import { TournamentResults } from "./TournamentResults";

interface Props {
  title: string | null;
  tournamentId?: string;
}

const TournamentTemplate: FC<Props> = ({ title, tournamentId }) => {
  const year = moment(new Date()).year();

  const [activeYear, setActiveYear] = useState<number>(year);

  const { data: tournament } = useSWR<TournamentEntity>(
    tournamentId ? `/api/tournaments${tournamentId}` : null
  );

  let {
    name,
    surface,
    type,
    prize,
    pastYearsResults,
    nextMatches,
    results,
    details,
    countryCode,
  } = tournament || {};

  // Sort past years by descending
  pastYearsResults = pastYearsResults?.sort((a, b) =>
    b.year < a.year ? -1 : 1
  );

  const info = `${surface} – ${type} – ${prize}`;

  const isCurrentYear = tournamentId?.includes(String(year));

  const surfaceBadgeProps = { surface };

  const nextMatchesProps = { matches: nextMatches };
  const tournamentResultsProps = { results };
  const pastYearResultsProps = { pastYearsResults, activeYear };
  const tournamentDetailsProps = { details };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col w-full text-white pb-6">
        <h1 className="text-3xl md:text-4xl text-white font-Signika font-bold tracking-tight">
          {name ? name : title}{" "}
          <span className="ml-2 md:ml-3">{getCountryEmoji(countryCode)}</span>
        </h1>
        {tournament ? (
          <div className="flex flex-row items-center text-fourth text-sm font-light py-2 capitalize">
            {info}{" "}
            <div className="flex justify-center w-4 h-4 mx-2 md:mx-3">
              <SurfaceBadge {...surfaceBadgeProps} />
            </div>
          </div>
        ) : (
          <div className="h-5 w-52 animate-pulse bg-fourth rounded-sm my-2"></div>
        )}
      </div>

      <div className="order-2 md:order-1 md:min-w-[28rem] md:w-[30vw]">
        {/* Past years tab */}
        <div className="flex flex-row items-baseline rounded-md bg-tertiary p-2 md:p-3 text-white w-full">
          <h1 className="font-Signika text-lg tracking-tight mr-2">
            {isCurrentYear ? "Years" : "Past Results"}
          </h1>
          <div className="flex flex-row">
            <button
              onClick={() => setActiveYear(year)}
              className={`ml-1 text-xs uppercase tracking-wider font-light hover:text-white hover:font-bold ${
                activeYear === year ? "font-semibold text-white" : "text-fourth"
              }`}
            >
              {year} –
            </button>
            {pastYearsResults?.map(({ year }, index) => (
              <button
                key={index}
                onClick={() => setActiveYear(Number(year))}
                className={`ml-1 text-xs uppercase tracking-wider font-light hover:text-white hover:font-bold ${
                  activeYear === Number(year)
                    ? "font-semibold text-white"
                    : "text-fourth"
                }`}
              >
                {year} {pastYearsResults?.length !== index + 1 ? "–" : null}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-col w-full">
          {activeYear === year ? (
            <>
              <NextMatches {...nextMatchesProps} />
              <TournamentResults {...tournamentResultsProps} />
            </>
          ) : (
            <PastYearResults {...pastYearResultsProps} />
          )}

          <TournamentDetails {...tournamentDetailsProps} />
        </div>
      </div>
    </div>
  );
};

export { TournamentTemplate };
