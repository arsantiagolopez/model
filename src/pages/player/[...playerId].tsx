import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../../components/Layout";
import { PlayerTemplate } from "../../components/PlayerTemplate";

const PlayerPage: NextPage = () => {
  const { data } = useSession();
  const isAdmin = !!data?.user?.isAdmin;

  const { query } = useRouter();

  const playerId = query && query.playerId ? query.playerId[0] : undefined;

  const layoutProps = { isAdmin };
  const playerTemplateProps = { playerId };

  return (
    <>
      <Head>
        <title>Player | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout {...layoutProps}>
        <PlayerTemplate {...playerTemplateProps} />
      </Layout>
    </>
  );
};

export default PlayerPage;
