import { createContext, Dispatch, SetStateAction } from "react";

interface ContextState {
  oddsFormat: string;
  setOddsFormat: Dispatch<SetStateAction<string>>;
  toggleOdds: () => void;
}

const PreferencesContext = createContext<ContextState>({
  oddsFormat: "decimal",
  setOddsFormat: () => {},
  toggleOdds: () => {},
});

export { PreferencesContext };
