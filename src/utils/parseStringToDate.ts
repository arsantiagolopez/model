// Convert parsed string from scrape, convert it into Date

import moment from "moment";

interface Props {
  date?: string | Date;
  isNextMatch?: boolean;
  isPastMatch?: boolean;
}

const parseStringToDate = ({
  date: str,
  isNextMatch,
  isPastMatch,
}: Props): Date | undefined => {
  /**
   * Handle possible cases for next matches date string:
   * 1) String is in "today, hh:mm" format, if today or tomorrow
   * 2) String is in "dd.mm., hh:mm" format e.g. "15.04., 10:00", if date after tomorrow
   */
  if (isNextMatch) {
    const left = String(str)?.split(",")[0];
    const isDayName = !left.includes(".");
    const year = new Date().getFullYear();

    // Date string in format "today, hh:mm"
    if (isDayName) {
      const day = left;
      const time = String(str)?.split(", ")[1];
      const hours = Number(time.split(":")[0]);
      const minutes = Number(time.split(":")[1]);

      if (day.toLowerCase() === "today") {
        const today = moment(new Date());
        return today.set("hour", hours).set("minute", minutes).toDate();
      } else {
        const tomorrow = moment(new Date()).add(1, "day");
        return tomorrow.set("hour", hours).set("minute", minutes).toDate();
      }
    }
    // Date string in format "dd.mm., hh:mm"
    else if (!isDayName) {
      // Get days and month
      const dayAndMonth = String(str)?.split(", ")[0];
      const day = dayAndMonth?.split(".")[0];
      const month = dayAndMonth?.split(".")[1];

      // Get hours and minutes
      const hoursAndMinutes = String(str)?.split("., ")[1];
      const hours = hoursAndMinutes?.split(".")[0];
      const minutes = hoursAndMinutes?.split(".")[1];

      str = `${day}.${month}, ${hours}:${minutes}, ${year}`;

      return moment(str, "DD.MM, kk:mm, YYYY").toDate();
    } else {
      // String doesn't follow fomart
      return undefined;
    }
  }

  /**
   * Handle possible cases for past matches date string:
   * 1) String is in "dd.mm.hh:mm" format
   */
  if (isPastMatch) {
    const day = String(str).split(".")[0];
    const month = String(str).split(".")[1];
    const hours = String(str).split(".")[2];
    const minutes = String(str).split(".")[3];
    const year = new Date().getFullYear();

    str = `${day}.${month}, ${hours}:${minutes}, ${year}`;

    return moment(str, "DD.MM, kk:mm, YYYY").toDate();

    // String doesn't follow fomart
    // return undefined;
  }
};
export { parseStringToDate };
