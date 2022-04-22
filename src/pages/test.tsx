import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Layout } from "../components/Layout";

const TestPage: NextPage = () => {
  const players = [
    {
      playerId: 1,
      lastMatches: [
        { home: "test", result: { winner: "test" } },
        { home: "test", result: { winner: "test" } },
        { home: "test", result: { winner: "test" } },
        { home: "test", result: { winner: "no" } },
      ],
    },
    {
      playerId: 2,
      lastMatches: [
        { home: "test", result: { winner: "test" } },
        { home: "test", result: { winner: "test" } },
        { home: "test", result: { winner: "test" } },
        { home: "test", result: { winner: "test" } },
        { home: "test", result: { winner: "test" } },
        { home: "test", result: { winner: "no" } },
      ],
    },
    {
      playerId: 3,
      lastMatches: [
        { home: "test", result: { winner: "test" } },
        { home: "test", result: { winner: "no" } },
        { home: "test", result: { winner: "no" } },
        { home: "test", result: { winner: "test" } },
        { home: "test", result: { winner: "test" } },
        { home: "test", result: { winner: "no" } },
      ],
    },
  ];

  // Upsert players entities
  for (const player of players) {
    const { playerId, lastMatches } = player;

    // Track form over last 10 matches
    const wins = lastMatches.reduce(
      (acc, { home, result }) => (home === result?.winner ? ++acc : acc),
      0
    );
    const form = wins / lastMatches.length;

    console.log(`PlayerId: ${playerId}, avg: ${form}`);
  }
  return (
    <>
      <Head>
        <title>Test | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div></div>
      </Layout>
    </>
  );
};

export default TestPage;
