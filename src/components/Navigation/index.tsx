import { useSession } from "next-auth/react";
import React, { FC } from "react";
import { Authenticated } from "./Authenticated";
import { NotAuthenticated } from "./NotAuthenticated";

interface Props {}

const Navigation: FC<Props> = () => {
  const { data: session, status } = useSession();

  const isAuthenticated = status !== "loading" && session;

  const authenticatedProps = { session };

  return isAuthenticated ? (
    <Authenticated {...authenticatedProps} />
  ) : (
    <NotAuthenticated />
  );
};

export { Navigation };
