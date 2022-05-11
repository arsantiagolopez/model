import React, { FC } from "react";
import useSWR from "swr";
import countryCodes from "../../data/countries.json";
import { PlayerEntity } from "../../types";
import { Avatar } from "../Avatar";
import { FormGraph } from "../FormGraph";
import { SurfaceRecords } from "../SurfaceRecords";

interface Props {
  playerId?: string;
}

const PlayerTemplate: FC<Props> = ({ playerId }) => {
  const { data: player } = useSWR<PlayerEntity>(
    playerId && `/api/players/${playerId}`
  );

  const { profile, lastMatches, upcomingMatch, record } = player || {};

  let { name, image, country, age, hand, height, singlesRank } = profile || {};

  // Get country's flag
  const countryCode =
    country &&
    countryCodes
      .find(
        ({ name }) =>
          country && name.toLowerCase().includes(country.toLowerCase())
      )
      ?.code.toLowerCase();
  const flag = `${process.env.NEXT_PUBLIC_SCRAPING_FLAGS_URL}${countryCode}.png`;

  // Camelcase hand & country fields
  hand = hand && hand.charAt(0).toUpperCase() + hand.slice(1, hand.length);
  country =
    country &&
    country.charAt(0).toUpperCase() + country.slice(1, country.length);

  const avatarProps = { image, width: "3.5rem" };
  const flagAvatarProps = { image: flag };
  const nationalityAvatarProps = { image: flag, width: "0.75rem" };
  const formGraphProps = {
    lastMatches,
    graphHeight: "h-[40vh] md:h-[30vh]",
  };
  const surfaceRecordsProps = {
    allSurfaces: true,
    currentSurface: upcomingMatch?.surface,
    record,
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col w-full text-white pb-6">
        <div className="flex flex-row items-center">
          {/* Name */}
          <h1 className="text-3xl md:text-4xl text-white font-Signika font-bold tracking-tight">
            {name}
          </h1>

          {/* Headshot and country flag */}
          <div className="relative">
            <div className=" mx-2 md:mx-4">
              <Avatar {...avatarProps} />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 md:bottom-0 md:right-0 w-4 h-4 mx-2 md:mx-3 rounded-full aspect-square">
              <Avatar {...flagAvatarProps} />
            </div>
          </div>
        </div>
      </div>

      {/* Profile */}
      <div className="flex flex-col gap-2 text-sm text-white pb-3 md:min-w-[28rem] md:w-[30vw] px-4">
        {/* Rank & Nationality */}
        <div className="flex flex-row w-full md:w-[70%]">
          {singlesRank ? (
            <p className="font-bold w-full">
              {singlesRank}{" "}
              <span className="text-[0.6rem] font-normal text-fourth">
                RANK{" "}
              </span>
              🏆
            </p>
          ) : null}

          {country && (
            <div className="flex flex-row justify-end md:justify-start items-baseline w-full">
              <span className="truncate">{country}</span>

              <span className="text-[0.6rem] mx-1 text-fourth">
                NATIONALITY
              </span>
              <Avatar {...nationalityAvatarProps} />
            </div>
          )}
        </div>

        {/* Age & Hand */}
        <div className="flex flex-row w-full md:w-[70%]">
          {age ? (
            <p className="font-bold w-full">
              {age}{" "}
              <span className="text-[0.6rem] font-normal text-fourth">
                YRS{" "}
              </span>
              🎂
            </p>
          ) : null}

          {hand && (
            <p className="flex justify-end md:justify-start w-full">
              {hand}-Handed
              <span className="text-[0.6rem] text-fourth mx-1">PLAYS</span>
              👋
            </p>
          )}
        </div>

        {/* Height */}
        <div className="flex flex-row w-full md:w-[70%]">
          {height && (
            <p className="font-bold self-center">
              {hand}{" "}
              <span className="text-[0.6rem] font-normal text-fourth">
                TALL
              </span>{" "}
              📏
            </p>
          )}
        </div>
      </div>

      {/* Form graph */}
      <div className="my-4">
        <h1 className="font-Signika tracking-tight text-xl mb-2 text-white">
          Recent Form
        </h1>
        <div className="md:min-w-[28rem] md:w-[30vw] p-6 rounded-md bg-secondary">
          <FormGraph isDetailed {...formGraphProps} />
        </div>
      </div>

      {/* Overall record */}
      <div className="my-4 mb-8">
        <h1 className="font-Signika tracking-tight text-xl mb-2 text-white">
          Records
        </h1>
        <div className="md:min-w-[28rem] md:w-[30vw] rounded-md bg-tertiary p-2 py-4 md:py-5 md:px-4 text-fourth text-xs w-full">
          <SurfaceRecords {...surfaceRecordsProps} />
        </div>
      </div>
    </div>
  );
};

export { PlayerTemplate };
