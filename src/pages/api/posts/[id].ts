import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Post } from "../../../models/Post";
import { dbConnect } from "../../../utils/dbConnect";

/**
 * Update post by ID.
 * @param {object} req - http request, including the body.
 * @param {object} res - http response.
 * @returns an updated post object.
 */
const updatePost = async (
  { body, query }: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = query;

  // Update post visibility
  try {
    const post = await Post.findByIdAndUpdate(id, body);
    return res.status(200).json(post);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

// Main
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await getSession({ req });
  const { method } = req;

  if (!data?.user?.isAdmin) {
    return res.status(405).end("Must be an admin to update a post.");
  }

  await dbConnect();

  switch (method) {
    case "PUT":
      return updatePost(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
