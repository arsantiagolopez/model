import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { Dashboard } from "../components/Dashboard";
import { Layout } from "../components/Layout";

const IndexPage: NextPage = () => {
  const { data } = useSession();

  const isAdmin = !!data?.user?.isAdmin;

  const title = data?.user?.isAdmin ? "Dashboard" : "Home";

  const layoutProps = { isAdmin };

  return (
    <>
      <Head>
        <title>
          {title} | {process.env.NEXT_PUBLIC_BRAND_NAME}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Layout {...layoutProps}>{isAdmin ? <Dashboard /> : <Landing />}</Layout> */}
      <Layout {...layoutProps}>
        <Dashboard />
      </Layout>
    </>
  );
};

export default IndexPage;
