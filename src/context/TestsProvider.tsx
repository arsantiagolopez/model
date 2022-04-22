import React, { FC, useEffect, useState } from "react";
import useSWR from "swr";
import axios from "../axios";
import { TestEntity, TournamentEntity } from "../types";
import { TestsContext } from "./TestsContext";

interface Props {
  children: JSX.Element;
}

const TestsProvider: FC<Props> = ({ children }) => {
  const [isModelRunning, setIsModelRunning] = useState<boolean>(false);

  const { data: tests, mutate: mutateTests } =
    useSWR<TestEntity[]>("/api/tests");

  const { data: tournaments } = useSWR<TournamentEntity[]>("/api/tournaments");

  // Reset tests if data has been wiped
  const resetTests = async () => {
    const { status } = await axios.post("/api/tests");
    if (status !== 200) {
      return console.log("Could not reset tests");
    }
    const updatedTests = tests?.map((test) => ({ ...test, passed: null }));
    mutateTests(updatedTests);
  };

  // If no tournament data, reset tests
  useEffect(() => {
    if (tests && tournaments && tournaments.length < 1) {
      resetTests();
    }
  }, [tournaments, tests]);

  return (
    <TestsContext.Provider
      value={{
        tests,
        isModelRunning,
        setIsModelRunning,
        mutateTests,
      }}
    >
      {children}
    </TestsContext.Provider>
  );
};

export { TestsProvider };
