import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { dbConnect } from "../../../utils/dbConnect";

const getStats = async (_: NextApiRequest, __: NextApiResponse) => {
  try {
  } catch (error) {}
};

// Main
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await getSession({ req });
  const { method } = req;

  const isAdmin = data?.user.isAdmin;

  if (!isAdmin) {
    return res.status(405).end("Must be an admin to access the model.");
  }

  await dbConnect();

  switch (method) {
    case "GET":
      return getStats(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
