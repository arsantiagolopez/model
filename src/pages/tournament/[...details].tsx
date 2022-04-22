import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../../components/Layout";
import { TournamentTemplate } from "../../components/TournamentTemplate";

const TournamentPage: NextPage = () => {
  const { data } = useSession();

  const isAdmin = !!data?.user?.isAdmin;

  const router = useRouter();
  const { details } = router?.query;

  const capitalizeWords = (slug: string) => {
    let words = slug.toLowerCase().split("-");
    for (const letter in words) {
      words[letter] =
        words[letter].charAt(0).toUpperCase() + words[letter].substring(1);
    }
    return words.join(" ");
  };

  let name = details ? capitalizeWords(details?.[0]) : null;
  let year = details?.[1];

  const title = details ? `${name} (${year})` : "Tournament";
  const tournamentId = name
    ? router.asPath.replace("/tournament", "")
    : undefined;

  const layoutProps = { isAdmin };
  const tournamentTemplateProps = { title, tournamentId };

  return (
    <>
      <Head>
        <title className="uppercase">
          {title} | {process.env.NEXT_PUBLIC_BRAND_NAME}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout {...layoutProps}>
        <TournamentTemplate {...tournamentTemplateProps} />
      </Layout>
    </>
  );
};

export default TournamentPage;
