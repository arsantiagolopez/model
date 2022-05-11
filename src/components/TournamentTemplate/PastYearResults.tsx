import React, { FC } from "react";
import { PastYearResult } from "../../types";
import { TournamentResults } from "./TournamentResults";

interface Props {
  pastYearsResults?: PastYearResult[];
  activeYear: number;
  toggleOdds: () => void;
  oddsFormat: string;
}

const PastYearResults: FC<Props> = ({
  pastYearsResults,
  activeYear,
  toggleOdds,
  oddsFormat,
}) => {
  const results = pastYearsResults?.find(
    ({ year }) => Number(year) === activeYear
  )?.matches;

  const tournamentResultsProps = { results, toggleOdds, oddsFormat };

  return <TournamentResults {...tournamentResultsProps} />;
};

export { PastYearResults };
