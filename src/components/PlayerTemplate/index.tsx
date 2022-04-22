import React, { FC } from "react";
import useSWR from "swr";
import countryCodes from "../../data/countries.json";
import { PlayerEntity } from "../../types";
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

  const { name, image, country } = profile || {};

  // Get country's flag
  const countryCode =
    country &&
    countryCodes
      .find(({ name }) => name.toLowerCase().includes(country.toLowerCase()))
      ?.code.toLowerCase();
  const flag = `${process.env.NEXT_PUBLIC_SCRAPING_FLAGS_URL}${countryCode}.png`;

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
            <img
              src={image}
              className="object-cover rounded-full w-14 h-14 md:w-12 md:h-12 mx-2 md:mx-4"
            />
            <div className="absolute -bottom-1.5 -right-1.5 md:bottom-0 md:right-0 w-4 h-4 mx-2 md:mx-3 rounded-full aspect-square">
              <img src={flag} />
            </div>
          </div>
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
