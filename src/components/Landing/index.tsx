import Link from "next/link";
import React, { FC } from "react";

interface Props {}

const Landing: FC<Props> = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <div className="flex flex-col md:flex-col items-start md:justify-center flex-wrap">
        <div className="flex flex-col items-center w-full md:justify-center">
          <Link href="/register">
            <a className="button text-xl py-3 px-10 my-6 mb-3 self-center ">
              Get Started
            </a>
          </Link>
          <Link href="/signin">
            <a className="font-Basic text-white tracking-tight text-xl self-center pl-2 md:pl-0">
              or Sign in
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export { Landing };
