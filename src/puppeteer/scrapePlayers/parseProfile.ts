import moment from "moment";
import { Page } from "puppeteer";
import { PlayerProfile } from "../../types";

// Get player's profile information

const parseProfile = async (page: Page): Promise<PlayerProfile> => {
  // Enable log inside page evaluate
  page.on("console", async (msg) => {
    const msgArgs = msg.args();
    for (let i = 0; i < msgArgs.length; ++i) {
      console.log(await msgArgs[i].jsonValue());
    }
  });

  // Parse profile
  let profile: PlayerProfile = await page.evaluate(() => {
    // Player image
    let image =
      document.querySelector(".photo > .img > img")?.getAttribute("src") ??
      undefined;
    image = `${process.env.NEXT_PUBLIC_SCRAPING_SCHEDULE_URL}${image}`;

    const wrapper = document.querySelector(".plDetail");
    const info = wrapper?.querySelectorAll("td")[1];

    // Some players have heights displayed, some don't
    // Add an extra index if they do, subtract if they dont
    const hasHeight = info
      ?.querySelectorAll("div")[1]
      ?.textContent?.includes("Height");

    // Player name
    const name = info?.querySelector("h3")?.textContent ?? undefined;

    // Player country
    const country =
      info?.querySelectorAll("div")[0]?.textContent?.replace("Country: ", "") ??
      undefined;

    // Player height
    const height = hasHeight
      ? info
          ?.querySelectorAll("div")[1]
          ?.textContent?.split(": ")[1]
          .split(" / ")[0]
      : undefined;

    const date = info
      ?.querySelectorAll("div")
      [hasHeight ? 2 : 1]?.textContent?.replace("Age: ", "");

    // Player age
    const age = Number(date?.split(" ")[0] ?? 0);

    // Player birthday
    const birthday = date?.slice(3).replace("(", "").replace(")", "");

    // Player singles rank
    const singlesRank = Number(
      info
        ?.querySelectorAll("div")
        [hasHeight ? 3 : 2]?.textContent?.split(": ")[1]
        .split(". / ")[0] ?? 0
    );

    // // Player doubles rank
    // const doublesRank = Number(
    //   info
    //     ?.querySelectorAll("div")
    //     [hasHeight ? 4 : 3].textContent?.split(": ")[1]
    //     .split(". / ")[0]
    // );

    // Player sex
    const sex = info
      ?.querySelectorAll("div")
      [hasHeight ? 5 : 4]?.textContent?.replace("Sex: ", "");

    // Player hand
    const hand = info
      ?.querySelectorAll("div")
      [hasHeight ? 6 : 5]?.textContent?.replace("Plays: ", "");

    // Create & return profile entity
    const profile: PlayerProfile = {
      name,
      image,
      country,
      age,
      birthday,
      height,
      singlesRank,
      // doublesRank,
      sex,
      hand,
    };

    return profile;
  });

  // Convert birthday to date object
  const birthday = moment(profile?.birthday, "D. M. YYYY").isValid()
    ? moment(profile?.birthday, "D. M. YYYY").toDate()
    : undefined;
  console.log("**** BIRTHDAY: ", profile?.birthday, birthday);

  return { ...profile, birthday };
};

export { parseProfile };
