import { useEffect, useState } from "react";

interface Response {
  american?: number;
  decimal?: number;
}

interface Props {
  american?: number;
  decimal?: number;
}

const useOdds = ({ american, decimal }: Props): Response => {
  const [americanOdds, setAmericanOdds] = useState<number>();
  const [decimalOdds, setDecimalOdds] = useState<number>();

  // Convert odds to decimal format
  const convertToDecimal = (odds: number): number => {
    if (odds > 0) {
      odds = odds / 100 + 1;
    } else {
      odds = 100 / (odds * -1) + 1;
    }

    return Number(odds.toFixed(2));
  };

  // Convert odds to american format
  const convertToAmerican = (odds: number) => {
    if (odds >= 2) {
      odds = (odds - 1) * 100;
    } else if (odds > 1 && odds < 2) {
      odds = -100 / (odds - 1);
    }

    return parseInt(String(odds));
  };

  // Convert depending on passed params
  useEffect(() => {
    // Convert to decimal
    if (american) setDecimalOdds(convertToDecimal(american));
    if (decimal) setAmericanOdds(convertToAmerican(decimal));
  }, [american, decimal]);

  return { american: americanOdds, decimal: decimalOdds };
};

export { useOdds };
