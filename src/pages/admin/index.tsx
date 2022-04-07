import Head from "next/head";
import React from "react";
import { AdminDashboard } from "../../components/AdminDashboard";
import { Layout } from "../../components/Layout";
import { AdminPage as IAdminPage } from "../../types";

interface Props {}

const AdminPage: IAdminPage<Props> = () => {
  return (
    <>
      <Head>
        <title>Admin | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <AdminDashboard />
      </Layout>
    </>
  );
};

AdminPage.isAdmin = true;

export default AdminPage;
