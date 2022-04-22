// Format name in "Federed R." format

const getLastAndFirstInitial = (name: string) => {
  let [last, ...names] = name.split(" ");
  const initial = names[names.length - 1]?.charAt(0) + ".";
  return `${last} ${initial}`;
};

export { getLastAndFirstInitial };
