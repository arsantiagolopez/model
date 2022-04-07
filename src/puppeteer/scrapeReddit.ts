import puppeteer from "puppeteer";
import { PostEntity } from "../types";
import { scrollToBottom } from "./scrollToBottom";

// Scrape post comments from the reddit r/sportsbook tennis thread
const scrapeReddit = async (): Promise<PostEntity[]> => {
  let posts: PostEntity[] = [];

  const url = "https://www.reddit.com/r/sportsbook/";

  // Keywords to select tipster related comments
  const keywords = ["maize", "corn", "🌽", "🍿", "grain"];
  const excludedKeywords = ["corner", "corners", "cornet"];
  const tipster = process.env.TIPSTER_USERNAME!;

  try {
    const browser = await puppeteer.launch({
      // headless: false,
    });
    const page = await browser.newPage();

    // Set default timeout to infinite: page will load
    page.setDefaultNavigationTimeout(0);

    // Go to URL
    await page.goto(url);

    // Scroll to bottom of page to capture all comments
    await scrollToBottom(page);

    // Might need to scroll a bit to see the Tennis thread
    await page.evaluate(() =>
      document.querySelector("a[href*='tennis_daily_']")?.scrollIntoView()
    );

    await page.waitForSelector("a[href*='tennis_daily_']");

    // Get tennis thread link
    const link = await page.evaluate(() =>
      document.querySelector("a[href*='tennis_daily_']")?.getAttribute("href")
    );

    // Navigate to tennis thread
    if (link) await page.goto(link);

    // Wait for images to load
    await page.waitForSelector("img[alt='User avatar']");

    // Scroll to bottom of page to capture all comments
    // await scrollToBottom(page);

    // Enable log inside page evaluate
    page.on("console", async (msg) => {
      const msgArgs = msg.args();
      for (let i = 0; i < msgArgs.length; ++i) {
        console.log(await msgArgs[i].jsonValue());
      }
    });

    // Scroll to bottom of page to capture all comments
    await scrollToBottom(page);

    // Get only comments related to keywords
    let comments = await page.evaluate(
      (keywords, tipster, excludedKeywords) => {
        return Array.from(document.querySelectorAll(".Comment"), (node) => {
          let message = "";
          let messageHtml = "";

          const commentTags = node.querySelectorAll(
            "div[data-testid='comment'] > div"
          );

          // Concatenate all comments into one
          for (const commentTag of commentTags) {
            message = message + " " + commentTag.textContent;
            messageHtml = messageHtml + " " + commentTag.innerHTML;
          }

          // Get all the remaining comment info
          const platformId = node.parentElement?.id;
          const username = node.querySelector(
            "a[data-testid='comment_author_link']"
          )?.textContent;
          const timestamp = node.querySelector(
            "a[data-testid='comment_timestamp']"
          )?.textContent;
          const likes = node.querySelector(
            "div[id*='vote-arrows'] > div"
          )?.textContent;
          const link = node
            .querySelector("a[data-testid='comment_timestamp']")
            ?.getAttribute("href");
          const image = node
            .querySelector("img[alt*='User avatar']")
            ?.getAttribute("src");

          // Analyze comments & only keep keyword related ones (Maize)
          const isRelated = (keywords as string[]).some((keyword) =>
            message.toLowerCase().includes(keyword.toLowerCase())
          );

          // Make sure they don't include excluded words
          const isExcluded = (excludedKeywords as string[]).some((keyword) =>
            message.toLowerCase().includes(keyword.toLowerCase())
          );

          if (isRelated && !isExcluded && username !== tipster) {
            return {
              platformId,
              username,
              timestamp,
              message,
              messageHtml,
              likes: Number(likes) ? likes : 0,
              link,
              image,
              platform: "reddit",
            };
          }
        });
      },
      keywords,
      tipster,
      excludedKeywords
    );

    comments = comments.filter((comment) => comment !== null);

    // Next, scrape POTD thread
    await page.goBack();

    // Might need to scroll a bit to see the POTD thread
    await page.evaluate(() =>
      document.querySelector("a[href*='pick_of_the_day_']")?.scrollIntoView()
    );

    await page.waitForSelector("a[href*='pick_of_the_day_']");

    // Get POTD thread link
    const potdLink = await page.evaluate(() =>
      document
        .querySelector("a[href*='pick_of_the_day_']")
        ?.getAttribute("href")
    );

    // Navigate to tennis thread
    if (potdLink) await page.goto(potdLink);

    // Wait for images to load
    await page.waitForSelector("img[alt='User avatar']");

    // Scroll to bottom of page to capture all comments
    await scrollToBottom(page);

    // Second iteration, let's go
    let potdComments = await page.evaluate(
      (keywords, tipster, excludedKeywords) => {
        return Array.from(document.querySelectorAll(".Comment"), (node) => {
          let message = "";
          let messageHtml = "";

          const commentTags = node.querySelectorAll(
            "div[data-testid='comment'] > div"
          );

          // Concatenate all comments into one
          for (const commentTag of commentTags) {
            message = message + " " + commentTag.textContent;
            messageHtml = messageHtml + " " + commentTag.innerHTML;
          }

          // Get all the remaining comment info
          const platformId = node.parentElement?.id;
          const username = node.querySelector(
            "a[data-testid='comment_author_link']"
          )?.textContent;
          const timestamp = node.querySelector(
            "a[data-testid='comment_timestamp']"
          )?.textContent;
          const likes = node.querySelector(
            "div[id*='vote-arrows'] > div"
          )?.textContent;
          const link = node
            .querySelector("a[data-testid='comment_timestamp']")
            ?.getAttribute("href");
          const image = node
            .querySelector("img[alt*='User avatar']")
            ?.getAttribute("src");

          // Analyze comments & only keep keyword related ones (Maize)
          const isRelated = (keywords as string[]).some((keyword) =>
            message.toLowerCase().includes(keyword.toLowerCase())
          );

          // Make sure they don't include excluded words
          const isExcluded = (excludedKeywords as string[]).some((keyword) =>
            message.toLowerCase().includes(keyword.toLowerCase())
          );

          if (isRelated && !isExcluded && username !== tipster) {
            return {
              platformId,
              username,
              timestamp,
              message,
              messageHtml,
              likes: Number(likes) ? likes : 0,
              link,
              image,
              platform: "reddit",
            };
          }
        });
      },
      keywords,
      tipster,
      excludedKeywords
    );

    potdComments = potdComments.filter((comment) => comment !== null);

    // Merge all comments
    // @ts-ignore
    posts = [...comments, ...potdComments];

    // Close the browser
    await browser.close();

    return posts;
  } catch (err) {
    console.log(err);
  }

  return posts;
};

export { scrapeReddit };
