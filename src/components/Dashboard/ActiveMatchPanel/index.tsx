import moment from "moment";
import Link from "next/link";
import React, { Dispatch, FC, SetStateAction } from "react";
import { GoChevronLeft } from "react-icons/go";
import { HiOutlineExternalLink } from "react-icons/hi";
import useSWR from "swr";
import countryCodes from "../../../data/countries.json";
import { MatchEntity, PlayerProfile } from "../../../types";
import { getLastAndFirstInitial } from "../../../utils/getLastAndFirstInitial";
import { Avatar } from "../../Avatar";
import { SurfaceBadge } from "../../SurfaceBadge";
import { CountdownToDate } from "./CountdownToDate";
import { Head2Head } from "./Head2Head";
import { Odds } from "./Odds";
import { Records } from "./Records";

interface Props {
  id: string | null;
  setActiveMatchId: Dispatch<SetStateAction<string | null>>;
  setActivePlayerId: Dispatch<SetStateAction<string | undefined>>;
  toggleOdds: () => void;
  oddsFormat: string;
}

const ActiveMatchPanel: FC<Props> = ({
  id,
  setActiveMatchId,
  setActivePlayerId,
  toggleOdds,
  oddsFormat,
}) => {
  const { data: match } = useSWR<MatchEntity>(id && `/api/matches/${id}`);

  const TENNIS_EXPLORER_MATCH_INFO_LINK =
    match && process.env.NEXT_PUBLIC_SCRAPING_SCHEDULE_URL + match.matchLink;

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

  // Reset both the matchId and the playerId
  const resetActiveIds = () => {
    setActiveMatchId(null);
    setActivePlayerId(undefined);
  };

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

  const homeAvatarProps = { image: homeImage, width: "4rem" };
  const awayAvatarProps = { image: awayImage, width: "4rem" };
  const homeFlagAvatarProps = { image: homeFlag };
  const awayFlagAvatarProps = { image: awayFlag };
  const countdownToDateProps = { date };
  const recordsProps = { match, homeLink, awayLink };
  const head2HeadProps = { match, homeProfile, awayProfile };
  const oddsProps = { match, toggleOdds, oddsFormat };

  return (
    <div className="sticky top-4 w-full md:w-[30vw] mb-10 md:mb-4 rounded-md bg-tertiary p-4 text-xs overflow-y-auto max-h-[95vh]">
      {/* Close panel button */}
      <div onClick={resetActiveIds} className="absolute top-4 right-4">
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
        <a
          href={TENNIS_EXPLORER_MATCH_INFO_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto mr-1"
        >
          <HiOutlineExternalLink className="text-white text-lg hover:scale-110 hover:animate-pulse" />
        </a>
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
              <div className="relative cursor-pointer">
                <Avatar {...homeAvatarProps} />

                <div className="absolute -bottom-1.5 -left-1.5 md:bottom-0 md:right-0 w-5 h-5 mx-2 md:mx-3 rounded-full aspect-square">
                  <Avatar {...homeFlagAvatarProps} />
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
              <div className="relative cursor-pointer">
                <Avatar {...awayAvatarProps} />

                <div className="absolute -bottom-1.5 -right-1.5 md:bottom-0 md:-right-2 w-5 h-5 mx-2 md:mx-3 rounded-full aspect-square">
                  <Avatar {...awayFlagAvatarProps} />
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
