import { useSession } from "next-auth/react";
import React, { FC } from "react";
import { Authenticated } from "./Authenticated";

interface Props {}

const Navigation: FC<Props> = () => {
  const { data: session, status } = useSession();

  const isAuthenticated = status !== "loading" && session;

  const authenticatedProps = { session };

  if (isAuthenticated) {
    return <Authenticated {...authenticatedProps} />;
  }

  return null;
};

export { Navigation };
