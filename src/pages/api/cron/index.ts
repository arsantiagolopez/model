import type { NextApiRequest, NextApiResponse } from "next";
import { scrapeTomorrow } from "../scrape";

/**
 * Runs every day at 01:00 UTC/19:00 CST (Cron expression "0 1 * * *")
 */

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers.authorization;

  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return res.status(401).json({
      success: false,
      message: "❌ The Vercel CRON_SECRET keys don't match",
    });
  }

  // Scrape tomorrow's matches
  try {
    console.log("⚡️ Scraping tomorrow's matches...");

    await scrapeTomorrow(req, res);

    console.log("✅ Successfully tomorrow's matches!");

    res.status(200).json({
      success: true,
      message: "The cron job succeeded!",
    });
  } catch (error) {
    console.error("❌ Something went wrong while scraping tomorrow's matches");
    console.error("❌ Error: ", error);

    return res.status(400).json({
      success: false,
      message: "The Vercel CRON_SECRET keys don't match",
    });
  }
};

export default handler;
