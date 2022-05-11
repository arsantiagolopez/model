import { Session } from "next-auth";
import Link from "next/link";
import React, { FC, useContext, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { FaPlay } from "react-icons/fa";
import { GiDrippingTube } from "react-icons/gi";
import { IoLogOut, IoSettingsSharp } from "react-icons/io5";
import { RiDashboard3Fill, RiLineChartLine } from "react-icons/ri";
import axios from "../../axios";
import { TestsContext } from "../../context/TestsContext";
import { refreshScreen } from "../../utils/refreshScreen";
import { Avatar } from "../Avatar";
import { SignOutAlert } from "../SignOutAlert";
import { MobileMenu } from "./MobileMenu";

interface Props {
  session: Session | null;
}

const Authenticated: FC<Props> = ({ session }) => {
  const [isSignOutOpen, setIsSignOutOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const { isModelRunning, setIsModelRunning, tests, mutateTests } =
    useContext(TestsContext);

  const { user } = session || {};

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = () => setIsSignOutOpen(true);

  // Start a full model run.
  // Deletes previous tournament & matches entities.
  // Updates current player entities.
  const startModel = async () => {
    setIsModelRunning(true);

    // Set all to null
    const nullTests = tests?.map((test) => ({ ...test, passed: null }));
    mutateTests(nullTests);

    const { status } = await axios.post("/api/scrape");

    if (status !== 200) {
      console.log("Could not start model.");

      setIsModelRunning(false);
      return;
    }

    // Refresh screen to mutate UI
    refreshScreen();
    setIsModelRunning(false);
  };

  const avatarProps = { image: user?.image };
  const mobileMenuProps = {
    isMenuOpen,
    setIsMenuOpen,
  };
  const signOutAlertProps = {
    isOpen: isSignOutOpen,
    setIsOpen: setIsSignOutOpen,
    isCentered: true,
  };

  return (
    <div
      className={`fixed z-50 flex flex-row md:flex-col items-center justify-between h-14 md:h-screen w-screen md:w-[4%] px-5 md:p-5 ${
        isMenuOpen ? "bg-none" : "bg-secondary shadow-xl shadow-neutral-900"
      }`}
    >
      {/* Left */}
      <div className="z-50 flex flex-col md:w-full h-full md:h-[10%] items-center justify-center md:justify-start">
        <div className="flex flex-row justify-center h-[60%] md:h-10 aspect-square md:mt-auto cursor-pointer">
          <Link href="/">
            <a>
              <Avatar {...avatarProps} />
            </a>
          </Link>
        </div>
      </div>

      {/* Middle links */}
      <div className="hidden md:flex flex-col justify-center items-center md:mx-10 h-full">
        {user?.isSuperAdmin && (
          <button
            disabled={!!isModelRunning}
            onClick={startModel}
            className="text-white hover:text-fourth my-3"
          >
            {isModelRunning ? (
              // <ImCheckmark className="text-4xl px-1" />
              <BiLoaderAlt className="text-4xl animate-spin-slow text-yellow-400" />
            ) : (
              // @todo If no failed tests, show Checkmark
              <FaPlay className="text-4xl px-1 text-green-400 animate-pulse" />
            )}
          </button>
        )}
        <Link href="/">
          <button className="text-white hover:text-fourth my-3">
            <RiDashboard3Fill className="text-4xl" />
          </button>
        </Link>
        <Link href="/rankings">
          <button className="text-white hover:text-fourth my-3">
            <RiLineChartLine className="text-4xl" />
          </button>
        </Link>
        <Link href="/tests">
          <button className="text-white hover:text-fourth my-3">
            <GiDrippingTube className="text-4xl" />
          </button>
        </Link>
      </div>

      {/* Right */}
      <div className="flex flex-row justify-end md:justify-start w-full ml-auto md:ml-none md:h-[20%] md:mb-auto">
        {/* Mobile only menu */}
        <button onClick={toggleMenu} className="md:hidden text-3xl">
          <MobileMenu {...mobileMenuProps} />
        </button>

        <div className="hidden md:flex flex-col w-full items-center text-white">
          <Link href="/settings">
            <button>
              <IoSettingsSharp className="text-4xl cursor-pointer hover:text-fourth" />
            </button>
          </Link>
          <button
            onClick={handleSignOut}
            className="pt-0 md:pt-4 hover:text-fourth"
          >
            <IoLogOut className="text-4xl ml-2" />
          </button>
        </div>
      </div>

      {/* Sign Out Modal */}
      <SignOutAlert {...signOutAlertProps} />
    </div>
  );
};

export { Authenticated };
