import moment from "moment";
import { useSession } from "next-auth/react";
import React, { FC, useContext, useEffect } from "react";
import { CgCheck } from "react-icons/cg";
import { IoCloseSharp } from "react-icons/io5";
import { RiLoader4Line } from "react-icons/ri";
import { VscDebugRestart } from "react-icons/vsc";
import axios from "../../axios";
import { TestsContext } from "../../context/TestsContext";
import { refreshScreen } from "../../utils/refreshScreen";

interface Props {}

const TestSummary: FC<Props> = () => {
  const { data: session } = useSession();

  const { user } = session || {};

  const { tests, isModelRunning } = useContext(TestsContext);

  const restartScrape = async (name: string) => {
    // Only super admin can run
    if (user?.isSuperAdmin) {
      const { status } = await axios.post(`/api/scrape/${name}`);

      if (status !== 200) {
        console.log(`Could not scrape ${name}...`);
        return;
      }

      // Refresh screen to update test result UI
      refreshScreen();
    }
  };

  // Refresh UI to show loading tests
  useEffect(() => {
    if (isModelRunning) refreshScreen();
  }, [isModelRunning]);

  return (
    <div className="bg-tertiary rounded-md w-auto mb-4 md:mb-0 p-4 md:p-6">
      {/* Tests */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 pt-6 pb-10">
        {tests?.map(({ name, date, passed }) => {
          const lastPassed = moment(date).format("h:mm A – MM/DD/YY");
          return (
            <div
              key={name}
              onClick={() => restartScrape(name)}
              className="flex flex-col justify-start md:justify-center items-center group cursor-pointer"
            >
              {passed === null && !isModelRunning ? (
                <VscDebugRestart className="text-5xl md:text-6xl hover:text-neutral-500 animate-pulse" />
              ) : passed === null && isModelRunning ? (
                <RiLoader4Line className="text-6xl text-yellow-300 animate-spin-slow" />
              ) : passed ? (
                <>
                  <CgCheck className="group-hover:hidden text-green-400 text-5xl md:text-7xl" />
                  <VscDebugRestart className="hidden group-hover:block text-5xl md:text-6xl hover:text-neutral-500 my-1.5 animate-pulse" />
                </>
              ) : (
                <>
                  <IoCloseSharp className="group-hover:hidden text-red-400 text-4xl md:text-6xl my-1.5" />
                  <VscDebugRestart className="hidden group-hover:block text-5xl md:text-6xl hover:text-neutral-500 my-1.5 animate-pulse" />
                </>
              )}

              <p className="text-white font-Signika tracking-tight text-xl md:text-2xl">
                {name}
              </p>
              <p className="text-white uppercase tracking-widest text-[0.6rem] md:text-xs font-thin">
                {passed === null ? "Hasn't run" : lastPassed}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { TestSummary };
