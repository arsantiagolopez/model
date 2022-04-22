import moment, { Duration } from "moment";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";

interface Props {
  date?: string | Date;
}

const CountdownToDate: FC<Props> = ({ date }) => {
  const [duration, setDuration] = useState<Duration>(calculateDuration(date));

  const timerRef = useRef(0);

  const timerCallback = useCallback(
    () => setDuration(calculateDuration(date)),
    [date]
  );

  useEffect(() => {
    // @ts-ignore
    timerRef.current = setInterval(timerCallback, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [date]);

  const days = duration.days();
  const hours = duration.hours();
  // duration.hours() < 10 ? `0${duration.hours()}` : duration.hours();
  const minutes =
    duration.minutes() < 10 ? `0${duration.minutes()}` : duration.minutes();
  const seconds =
    duration.seconds() < 10 ? `0${duration.seconds()}` : duration.seconds();

  const startTime =
    days || hours || minutes || seconds
      ? days > 0
        ? days === 1
          ? `${days} day`
          : `${days} days`
        : `${hours}:${minutes}:${seconds}`
      : null;

  return <p>{startTime}</p>;
};

const calculateDuration = (date?: string | Date) =>
  moment.duration(
    Math.max(moment(date).unix() - Math.floor(Date.now() / 1000), 0),
    "seconds"
  );

export { CountdownToDate };
