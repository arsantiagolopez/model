import { Page } from "puppeteer";
import { EloRanking } from "../../types/stats";

const parseElos = async (page: Page, tour: string): Promise<EloRanking[]> =>
  await page.evaluate((tour: string) => {
    let rankings: EloRanking[] = [];

    // Get table with rankings
    const table = document.querySelector("table[id='reportable']");

    const rows = table?.querySelectorAll("tbody tr");

    /**
     * Row head & format on TennisAbstract
     * -----------------------------------
     * Col 1: Rank
     * Col 2: Player
     * Col 3: Player age
     * Col 4: ELO ranking
     * Col 6: hard raw ranking
     * Col 7: clay raw ranking
     * Col 8: grass raw ranking
     * Col 10: hard ELO ranking
     * Col 11: clay ELO ranking
     * Col 12: grass ELO ranking
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

          // Player age
          const age = Number(row?.querySelectorAll("td")[2]?.textContent);

          // ELO ranking
          const elo = Number(row?.querySelectorAll("td")[3]?.textContent);

          // Hard raw ranking
          const hardRaw = Number(row?.querySelectorAll("td")[5]?.textContent);

          // Hard clay ranking
          const clayRaw = Number(row?.querySelectorAll("td")[6]?.textContent);

          // Grass raw ranking
          const grassRaw = Number(row?.querySelectorAll("td")[7]?.textContent);

          // Hard raw ranking
          const hElo = Number(row?.querySelectorAll("td")[9]?.textContent);

          // Hard clay ranking
          const cElo = Number(row?.querySelectorAll("td")[10]?.textContent);

          // Grass raw ranking
          const gElo = Number(row?.querySelectorAll("td")[11]?.textContent);

          // Get last updated
          const lastIndex = row.querySelectorAll("p > i").length - 1;
          let lastUpdated =
            row.querySelectorAll("p > i")[lastIndex]?.textContent ?? undefined;

          // Date is in string format "YYYY-MM-DD"
          lastUpdated =
            lastUpdated?.substring(lastUpdated?.length - 10) ?? undefined;

          const ranking: EloRanking = {
            tour,
            player,
            rank,
            age,
            elo,
            hardRaw,
            clayRaw,
            grassRaw,
            hElo,
            cElo,
            gElo,
            lastUpdated,
          } as EloRanking;

          // Push new ranking to rankings array
          rankings.push(ranking);
        }
      }
    }

    return rankings;
  }, tour);

export { parseElos };
