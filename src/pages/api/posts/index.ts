import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import { Post } from "../../../models/Post";
import { PostEntity } from "../../../types";
import { dbConnect } from "../../../utils/dbConnect";

/**
 * Get all posts.
 * @param {object} req - HTTP request.
 * @param {object} res - HTTP response.
 * @returns an array of objects of all user posts.
 */
const getAllPosts = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<PostEntity[] | void> => {
  try {
    let posts: PostEntity[] = await Post.find();

    // Sort posts by date (newest to oldest)
    posts.sort((a, b) =>
      moment(b.timestamp).valueOf() > moment(a.timestamp).valueOf() ? 1 : -1
    );

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

/**
 * Get all reddit posts.
 * @param {object} req - HTTP request.
 * @param {object} res - HTTP response.
 * @returns an array of objects of all user reddit posts.
 */
const getRedditPosts = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<PostEntity[] | void> => {
  try {
    let posts: PostEntity[] = await Post.find();

    // Sort posts by date (newest to oldest)
    posts.sort((a, b) =>
      b.timestamp.valueOf() > a.timestamp.valueOf() ? 1 : -1
    );

    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Get all twitter posts.
 * @param {object} req - HTTP request.
 * @param {object} res - HTTP response.
 * @returns an array of objects of all user twitter posts.
 */
const getTwitterPosts = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<PostEntity[] | void> => {
  try {
    let posts: PostEntity[] = await Post.find();

    // Sort posts by date (newest to oldest)
    posts.sort((a, b) =>
      b.timestamp.valueOf() > a.timestamp.valueOf() ? 1 : -1
    );

    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Get all instagram posts.
 * @param {object} req - HTTP request.
 * @param {object} res - HTTP response.
 * @returns an array of objects of all user instagram posts.
 */
const getInstagramPosts = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<PostEntity[] | void> => {
  try {
    let posts: PostEntity[] = await Post.find();

    // Sort posts by date (newest to oldest)
    posts.sort((a, b) =>
      b.timestamp.valueOf() > a.timestamp.valueOf() ? 1 : -1
    );

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

// Main
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const data = await getSession({ req });
  const { method, query } = req;

  // const userId = data?.user.id;
  // const isAdmin = data?.user.isAdmin;

  await dbConnect();

  switch (method) {
    case "GET":
      const { set } = query;

      // What set of posts to fetch
      switch (set) {
        case "all":
          return getAllPosts(req, res);
        case "reddit":
          return getRedditPosts(req, res);
        case "twitter":
          return getTwitterPosts(req, res);
        case "instagram":
          return getInstagramPosts(req, res);
        default:
          return getAllPosts(req, res);
      }
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
