import moment from "moment";
import React, { FC, useContext, useState } from "react";
import { PreferencesContext } from "../../context/PreferencesContext";
import { TestsContext } from "../../context/TestsContext";
import { Schedule } from "../Schedule";
import { ActiveMatchPanel } from "./ActiveMatchPanel";
import { StatsPanels } from "./StatsPanels";

interface Props {}

const Dashboard: FC<Props> = () => {
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [activePlayerId, setActivePlayerId] = useState<string | undefined>();

  const { isModelRunning } = useContext(TestsContext);
  const { toggleOdds, oddsFormat } = useContext(PreferencesContext);

  const tomorrow = moment(new Date()).add(1, "day").format("MMM D, yyyy");

  // Switch between active matches, hide panel on same match click
  const handleSetActiveMatchId = (id: string) => {
    if (!activeMatchId || activeMatchId !== id) setActiveMatchId(id);
    else setActiveMatchId(null);
  };

  const scheduleProps = {
    handleSetActiveMatchId,
    activePlayerId,
    activeMatchId,
    isModelRunning,
    toggleOdds,
    oddsFormat,
  };
  const activeMatchPanelProps = {
    id: activeMatchId,
    setActiveMatchId,
    setActivePlayerId,
    toggleOdds,
    oddsFormat,
  };
  const statsPanels = { setActivePlayerId };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col w-full text-white pb-6">
        <img src="/logo.png" width={115} className="mb-1 -mt-1 md:-mt-8" />
        <h1 className="text-3xl md:text-4xl text-white font-Signika font-bold tracking-tight -mt-1 md:-mt-2">
          Tomorrow's ATP, WTA, and ITF Matches
        </h1>
        <p className="text-fourth text-xs font-light py-1">{tomorrow}</p>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="order-2 md:order-1 w-full md:w-[30vw] md:min-w-[20rem]">
          <Schedule {...scheduleProps} />
        </div>
        <div className="order-2 md:ml-4">
          {activeMatchId ? (
            <ActiveMatchPanel {...activeMatchPanelProps} />
          ) : (
            <StatsPanels {...statsPanels} />
          )}
        </div>
        {/* <script
          type="text/javascript"
          src="https://widget.enetscores.com/FWB0F157A7438D8ED2"
        ></script> */}
      </div>
    </div>
  );
};

export { Dashboard };
