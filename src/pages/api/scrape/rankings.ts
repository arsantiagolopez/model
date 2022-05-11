import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { dbConnect } from "../../../utils/dbConnect";
import { updatePlayerDataWeekly } from "../../../utils/updatePlayerDataWeekly";

const getRankings = async (
  _?: NextApiRequest,
  res?: NextApiResponse
): Promise<boolean> => {
  let success = true;

  try {
    // Update player data weekly if needed
    success = await updatePlayerDataWeekly();

    // ATP & WTA data not available
    if (!success) return false;

    return res?.status(200).json(success) || success;
  } catch (error) {
    success = false;
    console.log(error);
    return res?.status(400).json(success) || success;
  }
};

// Main
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await getSession({ req });
  const { method } = req;

  const isAdmin = data?.user.isAdmin;

  await dbConnect();

  switch (method) {
    case "POST":
      if (!isAdmin) {
        return res.status(405).end("Must be an admin to run the model.");
      }

      return getRankings(req, res);

    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
