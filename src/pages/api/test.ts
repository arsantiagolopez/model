import { NextApiRequest, NextApiResponse } from "next";

// Main
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(
    "😎😎😎 PRINTING TIME – ",
    new Date().getMinutes(),
    new Date().getSeconds()
  );

  res.status(200).json({ success: true });
};

export default handler;
