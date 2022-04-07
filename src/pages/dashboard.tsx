import Head from "next/head";
import React from "react";
import { Dashboard } from "../components/Dashboard";
import { Layout } from "../components/Layout";
import { MemberPage } from "../types";

interface Props {}

const DashboardPage: MemberPage<Props> = () => {
  const dashboardProps = {};

  return (
    <>
      <Head>
        <title>Dashboard | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Dashboard {...dashboardProps} />
      </Layout>
    </>
  );
};

DashboardPage.isMember = true;

export default DashboardPage;
