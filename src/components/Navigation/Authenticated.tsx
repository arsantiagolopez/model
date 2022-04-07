import { Session } from "next-auth";
import Link from "next/link";
import React, { FC, useState } from "react";
import { GiDrippingTube } from "react-icons/gi";
import { IoLogOut, IoSettingsSharp } from "react-icons/io5";
import { RiDashboard3Fill } from "react-icons/ri";
import { SignOutAlert } from "../SignOutAlert";
import { MobileMenu } from "./MobileMenu";

interface Props {
  session: Session | null;
}

const Authenticated: FC<Props> = ({ session }) => {
  const [isSignOutOpen, setIsSignOutOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const { user } = session || {};

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = () => setIsSignOutOpen(true);

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
      className={`fixed z-50 flex flex-row md:flex-col items-center justify-between h-14 md:h-screen w-screen md:w-[5%] px-5 md:p-5 ${
        isMenuOpen ? "bg-none" : "bg-secondary shadow-xl shadow-neutral-900"
      }`}
    >
      {/* Left */}
      <div className="z-50 flex flex-col md:w-full h-full md:h-[10%] items-center justify-center md:justify-start">
        <div className="flex flex-row justify-center h-[60%] md:h-10 aspect-square md:mt-auto">
          <img src={user?.image} className="rounded-full object-contain" />
        </div>
      </div>

      {/* Middle links */}
      <div className="hidden md:flex flex-col justify-center items-center md:mx-10 h-full">
        <Link href="/">
          <button className="font-Signika text-white hover:text-fourth my-2">
            <RiDashboard3Fill className="text-4xl " />
          </button>
        </Link>
        <Link href="/tests">
          <button className="font-Signika text-white hover:text-fourth my-2">
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
