import { Session } from "next-auth";
import Link from "next/link";
import React, { FC, useState } from "react";
import { Logo } from "../Logo";
import { SignOutAlert } from "../SignOutAlert";
import { MobileMenu } from "./MobileMenu";

interface Props {
  session: Session | null;
}

const Authenticated: FC<Props> = ({ session }) => {
  const [isSignOutOpen, setIsSignOutOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const { user } = session || {};

  const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME;

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
      className={`fixed z-50 flex items-center justify-between h-16 md:h-20 w-screen px-5 md:px-[15%] transition-all duration-200 ease-in-out ${
        isMenuOpen ? "bg-none" : "bg-primary shadow-xl shadow-neutral-900"
      }`}
    >
      {/* Left */}
      <div className="z-50 flex flex-row h-full items-center">
        <>
          <div className="relative aspect-square h-[40%] w-auto mr-3">
            <Logo />
          </div>
          <Link href="/">
            <h1 className="font-Basic text-xl text-white tracking-tighter cursor-pointer">
              {BRAND_NAME}
            </h1>
          </Link>
        </>

        <div className="hidden md:flex md:mx-10">
          <Link href="/dashboard">
            <button className="font-Basic text-white mx-4">Dashboard</button>
          </Link>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-row ml-auto">
        {/* Mobile only menu */}
        <button onClick={toggleMenu} className="md:hidden text-3xl">
          <MobileMenu {...mobileMenuProps} />
        </button>

        <div className="hidden md:flex flex-row h-full items-center">
          <Link href="/signin">
            <a className="font-Basic text-white tracking-tight self-center pr-2 md:pr-4">
              Hi, {user?.name}!
            </a>
          </Link>

          <button onClick={handleSignOut} className="button py-1.5 px-6 ml-2">
            Sign out
          </button>
        </div>
      </div>

      {/* Sign Out Modal */}
      <SignOutAlert {...signOutAlertProps} />
    </div>
  );
};

export { Authenticated };
