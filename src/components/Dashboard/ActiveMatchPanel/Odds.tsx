import React, { FC, useContext, useState } from "react";
import { GoChevronDown } from "react-icons/go";
import { PreferencesContext } from "../../../context/PreferencesContext";
import { MatchEntity } from "../../../types";
import { getFormattedOdds } from "../../../utils/getFormattedOdds";
import { getLastAndFirstInitial } from "../../../utils/getLastAndFirstInitial";
interface Props {
  match?: MatchEntity;
}

const Odds: FC<Props> = ({ match }) => {
  const [activeType, setActiveType] = useState<string | null>("moneyline");

  const { toggleOdds } = useContext(PreferencesContext);

  const { home, away, odds } = match || {};
  const { moneyline, spreadGames, totalGames, spreadSets } = odds || {};

  // Switch between active odds type, close panel on same match click
  const handleSetActiveType = (id: string) => {
    if (!activeType || activeType !== id) setActiveType(id);
    else setActiveType(null);
  };

  return (
    <div className="bg-secondary rounded-sm w-full">
      {/* Moneyline */}
      <div
        onClick={() => handleSetActiveType("moneyline")}
        className={`relative flex flex-row justify-center items-center p-1 cursor-pointer hover:bg-primary ${
          !activeType && "hover:animate-pulse"
        }`}
      >
        <p className="font-Signika text-white text-sm tracking-tighter">
          Moneyline
        </p>
        <GoChevronDown
          className={`absolute right-3 text-white ${
            activeType === "moneyline" && "rotate-180"
          }`}
        />
      </div>

      {activeType === "moneyline" &&
        (moneyline?.home || moneyline?.away ? (
          <div className="bg-tertiary flex flex-row justify-center items-center py-1.5 px-[5%] hover:bg-secondary">
            <div className="flex flex-row justify-between w-full border-r-[1px] border-secondary text-fourth pr-3">
              <p>{home && getLastAndFirstInitial(home)}</p>
              <p
                onClick={toggleOdds}
                className="text-xs text-white cursor-pointer"
              >
                {getFormattedOdds(moneyline?.home)}
              </p>
            </div>
            <div className="flex flex-row justify-between w-full text-fourth pl-3">
              <p>{away && getLastAndFirstInitial(away)}</p>
              <p
                onClick={toggleOdds}
                className="text-xs text-white cursor-pointer"
              >
                {getFormattedOdds(moneyline?.away)}
              </p>
            </div>
          </div>
        ) : null)}

      {/* Spreads */}
      <div
        onClick={() => handleSetActiveType("spreads")}
        className={`relative flex flex-row justify-center items-center p-1 cursor-pointer hover:bg-primary ${
          !activeType && "hover:animate-pulse"
        }`}
      >
        <p className="font-Signika text-white text-sm tracking-tighter">
          Spreads
        </p>
        <GoChevronDown
          className={`absolute right-3 text-white ${
            activeType === "spreads" && "rotate-180"
          }`}
        />
      </div>

      {activeType === "spreads" &&
        spreadGames?.map(({ spread, home, away }, index) => {
          const homeSpread = spread;
          const awaySpread = spread * -1;

          if (home || away) {
            return (
              <div
                key={index}
                className="bg-tertiary flex flex-row justify-center items-center py-1.5 px-[5%] hover:bg-secondary"
              >
                {/* Home odds */}
                <div className="flex flex-row justify-between w-full border-r-[1px] border-secondary text-fourth pr-3">
                  <p>
                    {homeSpread >= 0 && "+"}
                    {homeSpread.toFixed(1)}
                  </p>
                  <p
                    onClick={toggleOdds}
                    className="text-xs text-white cursor-pointer"
                  >
                    {getFormattedOdds(home)}
                  </p>
                </div>

                {/* Away odds */}
                <div className="flex flex-row justify-between w-full text-fourth pl-3">
                  <p>
                    {awaySpread >= 0 && "+"}
                    {awaySpread.toFixed(1)}
                  </p>
                  <p
                    onClick={toggleOdds}
                    className="text-xs text-white cursor-pointer"
                  >
                    {getFormattedOdds(away)}
                  </p>
                </div>
              </div>
            );
          }
        })}

      {/* Totals */}
      <div
        onClick={() => handleSetActiveType("totals")}
        className={`relative flex flex-row justify-center items-center p-1 cursor-pointer hover:bg-primary ${
          !activeType && "hover:animate-pulse"
        }`}
      >
        <p className="font-Signika text-white text-sm tracking-tighter">
          Totals
        </p>
        <GoChevronDown
          className={`absolute right-3 text-white ${
            activeType === "totals" && "rotate-180"
          }`}
        />
      </div>

      {activeType === "totals" &&
        totalGames?.map(({ line, over, under }, index) =>
          over || under ? (
            <div
              key={index}
              className="bg-tertiary flex flex-row justify-center items-center py-1.5 px-[5%] hover:bg-secondary"
            >
              <div className="flex flex-row justify-between w-full border-r-[1px] border-secondary text-fourth pr-3">
                <p>Over {line.toFixed(1)}</p>
                <p
                  onClick={toggleOdds}
                  className="text-xs text-white cursor-pointer"
                >
                  {getFormattedOdds(over)}
                </p>
              </div>
              <div className="flex flex-row justify-between w-full text-fourth pl-3">
                <p>Under {line.toFixed(1)}</p>
                <p
                  onClick={toggleOdds}
                  className="text-xs text-white cursor-pointer"
                >
                  {getFormattedOdds(under)}
                </p>
              </div>
            </div>
          ) : null
        )}

      {/* Set Props */}
      <div
        onClick={() => handleSetActiveType("sets")}
        className={`relative flex flex-row justify-center items-center p-1 cursor-pointer hover:bg-primary ${
          !activeType && "hover:animate-pulse"
        }`}
      >
        <p className="font-Signika text-white text-sm tracking-tighter">
          Set Props
        </p>
        <GoChevronDown
          className={`absolute right-3 text-white ${
            activeType === "sets" && "rotate-180"
          }`}
        />
      </div>

      {activeType === "sets" &&
        spreadSets?.map(({ spread, home, away }, index) => {
          const homeSpread = spread;
          const awaySpread = spread * -1;

          if (home || away) {
            return (
              <div
                key={index}
                className="bg-tertiary flex flex-row justify-center items-center py-1.5 px-[5%] hover:bg-secondary"
              >
                <div className="flex flex-row justify-between w-full border-r-[1px] border-secondary text-fourth pr-3">
                  <p>
                    {homeSpread >= 0 && "+"}
                    {homeSpread.toFixed(1)} sets
                  </p>
                  <p
                    onClick={toggleOdds}
                    className="text-xs text-white cursor-pointer"
                  >
                    {getFormattedOdds(home)}
                  </p>
                </div>
                <div className="flex flex-row justify-between w-full text-fourth pl-3">
                  <p>
                    {awaySpread >= 0 && "+"}
                    {awaySpread.toFixed(1)} sets
                  </p>

                  <p
                    onClick={toggleOdds}
                    className="text-xs text-white cursor-pointer"
                  >
                    {getFormattedOdds(away)}
                  </p>
                </div>
              </div>
            );
          }
        })}
    </div>
  );
};

export { Odds };
