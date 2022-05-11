import type { GetServerSideProps, NextPage } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  useSession,
} from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Layout } from "../components/Layout";
import { SignIn } from "../components/SignIn";

interface Props {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}

const SignInPage: NextPage<Props> = ({ providers }) => {
  const { data } = useSession();

  const router = useRouter();

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (data?.user) {
      router.push("/");
    }
  }, [data]);

  const signInProps = { providers };

  return (
    <>
      <Head>
        <title>Sign In | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <SignIn {...signInProps} />
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

export default SignInPage;
