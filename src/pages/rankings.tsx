import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { Layout } from "../components/Layout";
import { RankingsTemplate } from "../components/RankingsTemplate";

const RankingsPage: NextPage = () => {
  const { data } = useSession();

  const isAdmin = !!data?.user?.isAdmin;

  const layoutProps = { isAdmin };

  return (
    <>
      <Head>
        <title>Rankings | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout {...layoutProps}>
        <RankingsTemplate />
      </Layout>
    </>
  );
};

export default RankingsPage;
