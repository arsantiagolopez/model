import React, { FC, useState } from "react";
import { PreferencesContext } from "./PreferencesContext";

interface Props {
  children: JSX.Element;
}

const PreferencesProvider: FC<Props> = ({ children }) => {
  const [oddsFormat, setOddsFormat] = useState<string>("decimal");

  // Toggle between decimal and american odds
  const toggleOdds = () =>
    setOddsFormat(oddsFormat === "decimal" ? "american" : "decimal");

  return (
    <PreferencesContext.Provider
      value={{
        oddsFormat,
        setOddsFormat,
        toggleOdds,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export { PreferencesProvider };
