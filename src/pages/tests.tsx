import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { Layout } from "../components/Layout";
import { Tests } from "../components/Tests";
import { AdminPage } from "../types";

interface Props {}

const TestsPage: AdminPage<Props> = () => {
  const { data } = useSession();

  const isAdmin = !!data?.user?.isAdmin;

  const layoutProps = { isAdmin };
  const testsProps = {};

  return (
    <>
      <Head>
        <title>Tests | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout {...layoutProps}>
        <Tests {...testsProps} />
      </Layout>
    </>
  );
};

TestsPage.isAdmin = true;

export default TestsPage;
