import { Cluster } from "puppeteer-cluster";
import puppeteerCore from "puppeteer-core";
import chromium from "chrome-aws-lambda";

const REQ_TIMEOUT = 8000;
const IS_LAMBDA = process.env.NODE_ENV === "production";

// @todo – @starthere – Still unable to make scraping with
// puppeteer/puppeteer-cluster/chronium hosted in vercel
// This seems to be the most up to date/relevant thread
// https://gist.github.com/kettanaito/56861aff96e6debc575d522dd03e5725

const puppeteerClient = async () => {
  const launchOptions = {
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 10,
    ...(IS_LAMBDA && {
      puppeteer: puppeteerCore,
      puppeteerOptions: {
        args: [
          ...chromium.args,
          "--disable-web-security",
          "--disable-dev-profile",
          "--font-render-hinting=medium", // could be 'none', 'medium'
          "--enable-font-antialiasing",
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: true,
        timeout: REQ_TIMEOUT,
        userDataDir: "/dev/null",
      },
    }),
  };

  return Cluster.launch(launchOptions);
};

export default puppeteerClient;
