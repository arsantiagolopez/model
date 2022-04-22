import Head from "next/head";
import React from "react";
import { Dashboard } from "../components/Dashboard";
import { Layout } from "../components/Layout";
import { AdminPage } from "../types";

interface Props {}

const DashboardPage: AdminPage<Props> = () => {
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

DashboardPage.isAdmin = true;

export default DashboardPage;
