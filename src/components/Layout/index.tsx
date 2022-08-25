import React, { FC } from "react";
import { Navigation } from "../Navigation";

interface Props {
  children: JSX.Element;
  isAdmin?: boolean;
}

const Layout: FC<Props> = ({ children, isAdmin }) => {
  return (
    <div className="flex flex-col bg-primary h-full">
      <Navigation />
      <div
        className={`flex flex-col  min-h-screen px-5 md:px-12 h-full ${
          isAdmin ? "pt-20 md:pt-12 md:pl-[6%]" : "pt-6 md:pt-12"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export { Layout };
