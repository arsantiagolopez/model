import { Page } from "puppeteer";
import { PlayerRecord, YearRecord } from "../../types";

// Get tournament overview, next matches, results, and details

const parseRecord = async (page: Page): Promise<PlayerRecord> =>
  await page.evaluate(() => {
    // Tables containing record data per year
    const tables = document.querySelectorAll("table[class*='result balance']");
    const summaryTypes = document.querySelectorAll(
      "table[class*='result balance'] .summary"
    );

    const singles = tables[0].querySelectorAll("tr");
    // const doubles = tables[1].querySelectorAll("tr");

    // @unsupported: Deprecate support for doubles
    // const types = [singles, doubles];
    const types = [singles];

    let playerRecord: PlayerRecord = {} as PlayerRecord;
    let years: YearRecord[] = [];
    let all: YearRecord = {} as YearRecord;

    // Get every year from every type (singles and doubles)
    for (const [index, table] of types.entries()) {
      // Year type
      // const type = index === 0 ? "singles" : "doubles";

      // Every row is a year
      for (const [rowIndex, row] of table.entries()) {
        // First row is header, second row is summary, skip those
        if (rowIndex > 1) {
          // Year
          const year = Number(row.querySelector("td a")?.textContent ?? 0);

          // Year link
          const yearLink =
            row.querySelector("a")?.getAttribute("href") ?? undefined;

          // Total summary year
          const totalRecord = row?.querySelectorAll("td")[1]?.textContent;
          const totalWin = totalRecord?.split("/")[0];
          const totalLoss = totalRecord?.split("/")[1];
          const summary = {
            win: Number(totalWin ?? 0),
            loss: Number(totalLoss ?? 0),
          };

          // Clay record
          const clayRecord = row?.querySelectorAll("td")[2]?.textContent;
          const clayWin = clayRecord?.split("/")[0];
          const clayLoss = clayRecord?.split("/")[1];
          const clay = {
            win: Number(clayWin ?? 0),
            loss: Number(clayLoss ?? 0),
          };

          // Hard record
          const hardRecord = row?.querySelectorAll("td")[3]?.textContent;
          const hardWin = hardRecord?.split("/")[0];
          const hardLoss = hardRecord?.split("/")[1];
          const hard = {
            win: Number(hardWin ?? 0),
            loss: Number(hardLoss ?? 0),
          };

          // Indoors record
          const indoorsRecord = row?.querySelectorAll("td")[4]?.textContent;
          const indoorsWin = indoorsRecord?.split("/")[0];
          const indoorsLoss = indoorsRecord?.split("/")[1];
          const indoors = {
            win: Number(indoorsWin ?? 0),
            loss: Number(indoorsLoss ?? 0),
          };

          // Grass record
          const grassRecord = row?.querySelectorAll("td")[5]?.textContent;
          const grassWin = grassRecord?.split("/")[0];
          const grassLoss = grassRecord?.split("/")[1];
          const grass = {
            win: Number(grassWin ?? 0),
            loss: Number(grassLoss ?? 0),
          };

          const yearRecord: YearRecord = {
            year,
            yearLink,
            summary,
            clay,
            hard,
            indoors,
            grass,
          };

          // Push year record
          years.push(yearRecord);
        }
      }

      // Get sum of all win/loss record by surface
      const totalCols = summaryTypes[index].querySelectorAll("td");

      // All summary
      const summaryRecord = totalCols[1]?.textContent;
      const summaryWin = summaryRecord?.split("/")[0];
      const summaryLoss = summaryRecord?.split("/")[1];
      const summary = {
        win: Number(summaryWin ?? 0),
        loss: Number(summaryLoss ?? 0),
      };

      // All clay
      const clayRecord = totalCols[2]?.textContent;
      const clayWin = clayRecord?.split("/")[0];
      const clayLoss = clayRecord?.split("/")[1];
      const clay = { win: Number(clayWin ?? 0), loss: Number(clayLoss ?? 0) };

      // All hard
      const hardRecord = totalCols[3]?.textContent;
      const hardWin = hardRecord?.split("/")[0];
      const hardLoss = hardRecord?.split("/")[1];
      const hard = { win: Number(hardWin ?? 0), loss: Number(hardLoss ?? 0) };

      // All indoors
      const indoorsRecord = totalCols[4]?.textContent;
      const indoorsWin = indoorsRecord?.split("/")[0];
      const indoorsLoss = indoorsRecord?.split("/")[1];
      const indoors = {
        win: Number(indoorsWin ?? 0),
        loss: Number(indoorsLoss ?? 0),
      };

      // All grass
      const grassRecord = totalCols[5]?.textContent;
      const grassWin = grassRecord?.split("/")[0];
      const grassLoss = grassRecord?.split("/")[1];
      const grass = {
        win: Number(grassWin ?? 0),
        loss: Number(grassLoss ?? 0),
      };

      // Update all record
      all = {
        summary,
        clay,
        hard,
        indoors,
        grass,
      };
    }

    // Update record
    playerRecord = { years, all };

    // Return final player record with with years record and all summary
    return playerRecord;
  });

export { parseRecord };
