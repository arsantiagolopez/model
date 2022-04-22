import moment from "moment";
import Link from "next/link";
import React, { Dispatch, FC, SetStateAction } from "react";
import { GoChevronLeft } from "react-icons/go";
import useSWR from "swr";
import countryCodes from "../../../data/countries.json";
import { MatchEntity, PlayerProfile } from "../../../types";
import { getLastAndFirstInitial } from "../../../utils/getLastAndFirstInitial";
import { SurfaceBadge } from "../../SurfaceBadge";
import { CountdownToDate } from "./CountdownToDate";
import { Head2Head } from "./Head2Head";
import { Odds } from "./Odds";
import { Records } from "./Records";

interface Props {
  id: string | null;
  setActiveMatchId: Dispatch<SetStateAction<string | null>>;
}

const ActiveMatchPanel: FC<Props> = ({ id, setActiveMatchId }) => {
  const { data: match } = useSWR<MatchEntity>(id && `/api/matches/${id}`);

  let {
    tournament,
    tournamentLink,
    round,
    home,
    away,
    homeLink,
    awayLink,
    surface,
    date,
  } = match || {};

  const { data: homeProfile } = useSWR<PlayerProfile>(
    homeLink &&
      `/api/players/profile/${homeLink
        ?.replace("/player/", "")
        .replace("/", "")}`
  );

  const { data: awayProfile } = useSWR<PlayerProfile>(
    awayLink &&
      `/api/players/profile/${awayLink
        ?.replace("/player/", "")
        .replace("/", "")}`
  );

  const {
    image: homeImage,
    singlesRank: homeRank,
    country: homeCountry,
  } = homeProfile || {};
  const {
    image: awayImage,
    singlesRank: awayRank,
    country: awayCountry,
  } = awayProfile || {};

  // Deduce tour by players' sex
  const tour = homeProfile?.sex === "woman" ? "wta" : "atp";

  // Get country flags
  const homeCountryCode =
    homeCountry &&
    countryCodes
      .find(({ name }) =>
        name.toLowerCase().includes(homeCountry.toLowerCase())
      )
      ?.code.toLowerCase();
  const awayCountryCode =
    awayCountry &&
    countryCodes
      .find(({ name }) =>
        name.toLowerCase().includes(awayCountry.toLowerCase())
      )
      ?.code.toLowerCase();

  const homeFlag = `${process.env.NEXT_PUBLIC_SCRAPING_FLAGS_URL}${homeCountryCode}.png`;
  const awayFlag = `${process.env.NEXT_PUBLIC_SCRAPING_FLAGS_URL}${awayCountryCode}.png`;

  // Get start time
  date = moment(date).toDate();
  const isStartTomorrow = moment(date).isAfter(moment(new Date()).endOf("day"));
  const formattedDate = moment(date).format("h:mm A");

  const countdownToDateProps = { date };
  const recordsProps = { match, homeLink, awayLink };
  const head2HeadProps = { match, homeProfile, awayProfile };
  const oddsProps = { match };

  return (
    <div className="sticky top-4 w-full md:w-[30vw] mb-10 md:mb-4 rounded-md bg-tertiary p-4 text-xs overflow-y-auto max-h-[95vh]">
      {/* Close panel button */}
      <div
        onClick={() => setActiveMatchId(null)}
        className="absolute top-4 right-4"
      >
        <GoChevronLeft className="text-xl cursor-pointer hover:animate-pulse text-white" />
      </div>

      {/* Tournament & round */}
      <p className="tracking-tight truncate mb-1 text-fourth">
        <Link href={`/tournament${tournamentLink}`}>
          <span className="inline underline cursor-pointer">{tournament} </span>
        </Link>
        – {round}
      </p>

      {/* Headline */}
      <h1 className="flex flex-row items-center font-Signika text-xl tracking-tight truncate text-white">
        {home && getLastAndFirstInitial(home)} –{" "}
        {away && getLastAndFirstInitial(away)}{" "}
        <span className="h-4 w-auto mx-2">
          <SurfaceBadge surface={surface} withText />
        </span>
      </h1>

      {/* Images and start time */}
      <div className="flex flex-row justify-around items-center py-10">
        {/* Home */}
        <div className="flex flex-col justify-center items-center">
          {homeRank ? (
            <p className="flex flex-row text-center uppercase rounded-full w-auto min-w-[2rem] px-2 py-0.5 bg-secondary text-blue-500 hover:bg-primary mb-2 -mt-6 text-[0.6rem]">
              {tour} {homeRank}
            </p>
          ) : null}
          {homeLink && (
            <Link href={homeLink}>
              <div className="relative">
                <img
                  src={homeImage}
                  className={`object-cover h-16 w-16 min-h-[4rem] min-w-[4rem] rounded-full cursor-pointer ${
                    !homeImage && "bg-primary animate-pulse"
                  }`}
                />
                <div className="absolute -bottom-1.5 -left-1.5 md:bottom-0 md:right-0 w-5 h-5 mx-2 md:mx-3 rounded-full aspect-square">
                  <img src={homeFlag} />
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Start time */}
        <div className="flex flex-col justify-center items-center text-xs text-fourth">
          <p>{isStartTomorrow ? "Tomorrow" : "Today"}</p>
          <p className="text-white text-base">{formattedDate}</p>
          <CountdownToDate {...countdownToDateProps} />
        </div>

        {/* Away */}
        <div className="flex flex-col justify-center items-center">
          {awayRank ? (
            <p className="flex flex-row text-center uppercase rounded-full w-auto min-w-[2rem] px-2 py-0.5 bg-secondary text-blue-500 hover:bg-primary mb-2 -mt-6 text-[0.6rem]">
              {tour} {awayRank}
            </p>
          ) : null}
          {awayLink && (
            <Link href={awayLink}>
              <div className="relative">
                <img
                  src={awayImage}
                  className={`object-cover h-16 w-16 min-h-[4rem] min-w-[4rem] rounded-full cursor-pointer ${
                    !awayImage && "bg-primary animate-pulse"
                  }`}
                />
                <div className="absolute -bottom-1.5 -right-1.5 md:bottom-0 md:-right-2 w-5 h-5 mx-2 md:mx-3 rounded-full aspect-square">
                  <img src={awayFlag} />
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Head 2 Head */}
      <Head2Head {...head2HeadProps} />

      {/* Records */}
      <Records {...recordsProps} />

      {/* Odds */}
      <Odds {...oddsProps} />
    </div>
  );
};

export { ActiveMatchPanel };
