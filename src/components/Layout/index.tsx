import React, { FC, ReactNode } from "react";
import { Navigation } from "../Navigation";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col bg-primary h-full">
      <Navigation />
      <div className="flex flex-col pt-20 md:pt-12 md:ml-20 min-h-screen px-5 md:px-12 h-full">
        {children}
      </div>
    </div>
  );
};

export { Layout };
