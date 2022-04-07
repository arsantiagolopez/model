import axios from "axios";
import { NextComponentType, NextPage, NextPageContext } from "next";
import { SessionProvider } from "next-auth/react";
import type { AppProps as NextAppProps } from "next/app";
import { SWRConfig } from "swr";
import { AdminRoute } from "../components/AdminRoute";
import { MemberRoute } from "../components/MemberRoute";
import "../styles/globals.css";

interface IsAdminProp {
  isAdmin?: boolean;
}

interface IsMemberProp {
  isMember?: boolean;
}

// Custom type to override Component type
type AppProps<P = any> = {
  Component: NextComponentType<NextPageContext, any, {}> &
    IsAdminProp &
    IsMemberProp;
} & Omit<NextAppProps<P>, "Component">;

const MyApp: NextPage<AppProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <SessionProvider session={session}>
    <SWRConfig
      value={{
        fetcher: (url) => axios(url).then((res) => res.data),
      }}
    >
      {Component.isAdmin ? (
        <AdminRoute>
          <Component {...pageProps} />
        </AdminRoute>
      ) : Component.isMember ? (
        <MemberRoute>
          <Component {...pageProps} />
        </MemberRoute>
      ) : (
        <Component {...pageProps} />
      )}
    </SWRConfig>
  </SessionProvider>
);

export default MyApp;
