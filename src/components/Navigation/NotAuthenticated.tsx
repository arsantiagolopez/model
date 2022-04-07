import Link from "next/link";
import React, { FC, useState } from "react";
import { Logo } from "../Logo";
import { MobileMenu } from "./MobileMenu";

interface Props {}

const NotAuthenticated: FC<Props> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const mobileMenuProps = {
    isMenuOpen,
    setIsMenuOpen,
  };

  return (
    <div className="fixed z-50 bg-primary shadow-neutral-900 shadow-xl flex items-center justify-center h-16 md:h-20 w-screen px-5 md:px-[15%]">
      {/* Left */}
      <div className="z-50 flex flex-row h-full items-center">
        <>
          <div className="relative aspect-square h-[40%] mr-3">
            <Logo />
          </div>
          <Link href="/">
            <h1 className="font-Basic text-xl text-white tracking-tighter cursor-pointer">
              {BRAND_NAME}
            </h1>
          </Link>
        </>

        <div className="hidden md:flex md:mx-10">
          <Link href="/">
            <button className="font-Basic text-white mx-4">Home</button>
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
            <a className="font-Basic tracking-wide text-white md:px-4 self-center">
              Sign in
            </a>
          </Link>
          <Link href="/register">
            <button className="button py-1.5 px-6 ml-2">Get started</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export { NotAuthenticated };
