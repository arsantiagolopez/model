import { Page } from "puppeteer";

// Wait for page to scroll to bottom
const scrollToBottom = async (page: Page) =>
  await page.evaluate(
    async () =>
      await new Promise((resolve) => {
        var totalHeight = 0;
        var distance = 100;
        var timer = setInterval(() => {
          var scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight - window.innerHeight) {
            clearInterval(timer);
            resolve("Scrolled to bottom.");
          }
        }, 100);
      })
  );

export { scrollToBottom };
