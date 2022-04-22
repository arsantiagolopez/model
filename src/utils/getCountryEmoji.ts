/**
 * Get country flag emoji based on identifier.
 * @param country - Country ISO code.
 * @returns a string of a country emoji.
 */
const getCountryEmoji = (countryCode?: string) =>
  countryCode
    ?.toUpperCase()
    // @ts-ignore
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));

export { getCountryEmoji };
