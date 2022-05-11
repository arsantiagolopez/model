import Link from "next/link";
import React, { FC } from "react";

interface Props {}

const Landing: FC<Props> = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center min-h-[75vh]">
      <div className="flex flex-col items-center w-full md:justify-center">
        <img src="/logo.png" width={300} />
        <Link href="/signin">
          <a className="font-Signika text-white tracking-tight text-3xl self-center pl-2 md:pl-0 hover:text-fourth mt-4">
            Sign in 🎾🔥✅
          </a>
        </Link>
      </div>
    </div>
  );
};

export { Landing };
