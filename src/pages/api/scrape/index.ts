import moment from "moment";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Post } from "../../../models/Post";
import { scrapeReddit } from "../../../puppeteer";
import { PostEntity } from "../../../types";
import { convertPastToDate } from "../../../utils/convertPastToDate";
import { dbConnect } from "../../../utils/dbConnect";

// Scrape recent posts from all platforms
const scrapeAll = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<PostEntity[] | void> => {
  try {
    const redditPosts = await fetchRedditPosts();

    // Create post entities
    for await (const post of redditPosts) {
      let { platformId, timestamp } = post;

      // Create timestamp from date
      timestamp = moment(convertPastToDate(timestamp)).format("LLLL");

      await Post.findOneAndUpdate(
        { platformId },
        {
          ...post,
          timestamp,
        },
        {
          upsert: true,
        }
      );
    }

    // Only keep last 100

    return res.status(200).json(redditPosts);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
};

// // Scrape test with github cron jobs
// const scrapeTest = async (_: NextApiRequest, res: NextApiResponse) => {
//   try {
//     const now = moment(new Date()).format("h:mm A");

//     console.log(`RUNNING CRON JOB NOW: ${now}`);

//     return res.status(200).json(`Successful at ${now}`);
//   } catch (error) {
//     console.log(error);
//     return res.status(405).json(error);
//   }
// };

// Scrape reddit comments & save posts to database
const fetchRedditPosts = async (): Promise<PostEntity[]> => {
  let posts: PostEntity[] = [];

  posts = await scrapeReddit();

  return posts;
};

// Scrape twitter comments & save posts to database
const fetchTwitterPosts = async (): Promise<PostEntity[]> => {
  let posts: PostEntity[] = [];

  const now = moment(new Date()).format("h:mm A");
  console.log(`*** CALLED AT ${now}`);

  return posts;
};

// Scrape instagram comments & save posts to database
const fetchInstagramPosts = async (): Promise<PostEntity[]> => {
  let posts: PostEntity[] = [];

  const now = moment(new Date()).format("h:mm A");
  console.log(`*** CALLED AT ${now}`);

  return posts;
};

// Main
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await getSession({ req });
  const { method } = req;

  const userId = data?.user.id;
  // const isAdmin = data?.user.isAdmin;

  await dbConnect();

  // @ts-ignore
  const { ACTION_KEY } = req.headers.authorization?.split(" ")[1] || {};

  switch (method) {
    case "POST":
      // @todo Decide whether any user can fetch, or only admins, or public

      // If regular cron job or if authenticated user
      if (ACTION_KEY === process.env.APP_KEY || !!userId) {
        console.log("in hea");
        // return scrapeTest(req, res);
        return scrapeAll(req, res);
      } else {
        return res.status(401);
      }
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export { fetchRedditPosts, fetchTwitterPosts, fetchInstagramPosts };
export default handler;
