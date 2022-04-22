import { Page } from "puppeteer";
import { PlayerStatsEntity } from "../../types/stats";

const parseStats = async (
  page: Page,
  _: string
): Promise<PlayerStatsEntity> => {
  let playerStats: PlayerStatsEntity = {} as PlayerStatsEntity;

  await page.evaluate(() => {});

  // @todo Link up playerStats to player entity

  return playerStats;
};
export { parseStats };
