import React, { FC } from "react";
import { PastYearResult } from "../../types";
import { TournamentResults } from "./TournamentResults";

interface Props {
  pastYearsResults?: PastYearResult[];
  activeYear: number;
}

const PastYearResults: FC<Props> = ({ pastYearsResults, activeYear }) => {
  const results = pastYearsResults?.find(
    ({ year }) => Number(year) === activeYear
  )?.matches;

  const tournamentResultsProps = { results };

  return <TournamentResults {...tournamentResultsProps} />;
};

export { PastYearResults };
