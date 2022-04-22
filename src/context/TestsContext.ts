import { createContext, Dispatch, SetStateAction } from "react";
import { KeyedMutator, mutate } from "swr";
import { TestEntity } from "../types";

interface ContextState {
  tests?: TestEntity[];
  isModelRunning: boolean;
  setIsModelRunning: Dispatch<SetStateAction<boolean>>;
  mutateTests: KeyedMutator<TestEntity[]>;
}

const TestsContext = createContext<ContextState>({
  tests: [],
  isModelRunning: false,
  setIsModelRunning: () => {},
  mutateTests: mutate,
});

export { TestsContext };
