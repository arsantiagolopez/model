// Format odds based on global state

import { useContext } from "react";
import { PreferencesContext } from "../context/PreferencesContext";

const getFormattedOdds = (odds?: number): string | undefined => {
  const { oddsFormat } = useContext(PreferencesContext);

  // Convert odds to american format
  const convertToAmerican = (odds: number): number => {
    if (odds >= 2) {
      odds = (odds - 1) * 100;
    } else if (odds > 1 && odds < 2) {
      odds = -100 / (odds - 1);
    }
    return parseInt(String(odds));
  };

  // Round number to nearest 5
  const round = (number: number): number => {
    return Math.round(number / 5) * 5;
  };

  // Odds stored as decimal in database
  if (oddsFormat === "decimal") {
    return odds?.toFixed(2);
  }

  // Convert odds to american
  if (odds) {
    const americanOdds = convertToAmerican(odds);
    if (americanOdds > 0) return `+${String(round(americanOdds))}`;
    else return String(round(americanOdds));
  }
};

export { getFormattedOdds };
