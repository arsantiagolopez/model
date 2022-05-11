import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import useSWR from "swr";
import axios from "../axios";
import { Layout } from "../components/Layout";
import { PlayerProfile } from "../types";

const TestPage: NextPage = () => {
  const { data: player } = useSWR<PlayerProfile>(
    "/api/players/profile/borodulina/"
  );

  const fetchPlayersData = async () => {
    const response = await axios.post("/api/scrape/rankings");
  };

  return (
    <>
      <Head>
        <title>Test | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="ml-24 text-white">
          <button onClick={fetchPlayersData}>Click me</button>
        </div>
      </Layout>
    </>
  );
};

export default TestPage;
