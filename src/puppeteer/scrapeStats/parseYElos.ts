import { Page } from "puppeteer";
import { YEloRanking } from "../../types/stats";

const parseYElos = async (page: Page, tour: string): Promise<YEloRanking[]> =>
  await page.evaluate((tour: string) => {
    let rankings: YEloRanking[] = [];

    // Get table with rankings
    const table = document.querySelector("table[id='reportable']");

    const rows = table?.querySelectorAll("tbody tr");

    /**
     * Row head & format on TennisAbstract
     * -----------------------------------
     * Col 1: Rank
     * Col 2: Player
     * Col 3: Wins
     * Col 4: Losses
     * Col 5: yElo ranking
     */

    if (rows) {
      // Every row if a ranking
      for (const [index, row] of rows.entries()) {
        // First row is null
        if (index) {
          // Ranking number
          const rank = index;

          // Player
          const player =
            row?.querySelectorAll("td")[1]?.querySelector("a")?.textContent ??
            undefined;

          // Wins
          const wins = Number(row?.querySelectorAll("td")[2]?.textContent);

          // Losses
          const losses = Number(row?.querySelectorAll("td")[3]?.textContent);

          // yElo ranking
          const yElo = Number(row?.querySelectorAll("td")[4]?.textContent);

          // Get last updated
          const lastIndex = row.querySelectorAll("p > i").length - 1;
          let lastUpdated =
            row.querySelectorAll("p > i")[lastIndex]?.textContent ?? undefined;

          // Date is in string format "YYYY-MM-DD"
          lastUpdated =
            lastUpdated?.substring(lastUpdated?.length - 10) ?? undefined;

          const ranking: YEloRanking = {
            tour,
            player,
            rank,
            wins,
            losses,
            yElo,
            lastUpdated,
          } as YEloRanking;

          // Push new ranking to rankings array
          rankings.push(ranking);
        }
      }
    }

    return rankings;
  }, tour);

export { parseYElos };
