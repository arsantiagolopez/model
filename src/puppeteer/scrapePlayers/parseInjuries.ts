import moment from "moment";
import { Page } from "puppeteer";
import { Injury } from "../../types";

const parseInjuries = async (page: Page): Promise<Injury[]> => {
  let injuries: Injury[] = [];

  // Parse player injuries
  injuries = await page.evaluate(() => {
    let injuries: Injury[] = [];

    const rows = document.querySelectorAll(
      "#playerInjuries tbody tr:not(tr[class*='fullonly'])"
    );

    // Every row is an injury
    for (const row of rows) {
      // Date is in "23.06.2021 - 28.06.2021" format
      const date = row?.querySelectorAll("td")[0];

      // Injury start date
      const startDate = date?.textContent?.split(" - ")[0] ?? undefined;

      // Injury end date
      const endDate = date?.textContent?.split(" - ")[1] ?? undefined;

      // Injury tournament name
      const tournament =
        row?.querySelectorAll("td")[1]?.textContent ?? undefined;

      // Injury reason
      const reason = row?.querySelectorAll("td")[2]?.textContent ?? undefined;

      // Create & push injury entity
      const injury: Injury = {
        startDate,
        endDate,
        tournament,
        reason,
      } as Injury;

      injuries.push(injury);
    }

    return injuries;
  });

  // Parse date strings into date objects
  injuries = injuries.map((injury) => {
    let { startDate, endDate } = injury;

    // String date is in "23.06.2021" format
    startDate = moment(startDate, "DD.MM.YYYY").toDate();
    endDate = moment(endDate, "DD.MM.YYYY").toDate();

    return { ...injury, startDate, endDate };
  });

  return injuries;
};
export { parseInjuries };
