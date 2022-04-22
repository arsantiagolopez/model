import moment from "moment";

// Convert date format to date string
const getDayAndTimeFromDate = (date?: Date | string) => {
  // Handle possible TBD dates
  if (!date) {
    return { day: null, time: null, date: null };
  }

  // Convert future date string to moment
  let momentDate = moment(date);
  const today = momentDate.endOf("day");
  const tomorrow = momentDate.add(1, "day").endOf("day");
  let day =
    momentDate < today ? "today" : momentDate < tomorrow ? "tomorrow" : null;

  // Day could be "today, tomorrow, or another day date in format dd.mm."
  if (day === "today") {
    day = null;
  } else if (day === "tomorrow") {
    momentDate = momentDate.add(1, "day");
    day = momentDate.format("MMM DD");
  } else {
    day = momentDate.format("MMM DD");
  }

  const isValidDate = momentDate.isValid();
  const time = isValidDate ? momentDate.format("HH:mm") : "--:--";

  return { day, time, date: momentDate };
};

export { getDayAndTimeFromDate };
