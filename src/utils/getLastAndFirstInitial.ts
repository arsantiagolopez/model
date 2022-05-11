// Return formatted name in format "Federed R."

const getLastAndFirstInitial = (name: string) => {
  let [last, ...names] = name.split(" ");

  // Account for potential "De Minaur" type of names
  last =
    last.toLowerCase() === "de" && names.length > 1
      ? `${last} ${names[0]}`
      : last;

  // Account for potential "Van De Zandschulp" type of names
  last =
    last.toLowerCase() === "van" &&
    names[0].toLowerCase() === "de" &&
    names.length > 2
      ? `${last} ${names[0]} ${names[1]}`
      : last;

  const initial = names[names.length - 1]?.charAt(0) + ".";
  return `${last} ${initial}`;
};

export { getLastAndFirstInitial };
