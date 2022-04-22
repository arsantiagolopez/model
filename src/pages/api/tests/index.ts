import { NextApiRequest, NextApiResponse } from "next";
import { Test } from "../../../models/Test";
import { TestEntity } from "../../../types";
import { dbConnect } from "../../../utils/dbConnect";
/**
 * Get a test results.
 * @param req - HTTP request.
 * @param res - HTTP response.
 * @returns an array of test results.
 */
const getTestResults = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<TestEntity[] | void> => {
  try {
    const tests = await Test.find();
    return res.status(200).json(tests);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

/**
 * Update test result by name.
 * @param name - Test name.
 * @param success - Test result.
 */
export const updateTest = async (
  name: string,
  success?: boolean
): Promise<void> => {
  try {
    await Test.findOneAndUpdate(
      {
        name,
      },
      {
        passed: success ?? null,
        date: success !== null ? new Date() : null,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.log(err);
  }
};

/**
 * Reset all tests
 */
export const resetTests = async (
  _?: NextApiRequest,
  res?: NextApiResponse
): Promise<void> => {
  try {
    await Test.updateMany({}, { passed: null });
    if (res) return res.status(200).json(null);
  } catch (error) {
    console.log(error);
    if (res) return res.status(200).json(null);
  }
};

// Main
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const data = await getSession({ req });
  const { method } = req;

  await dbConnect();

  switch (method) {
    // Get test results
    case "GET":
      return getTestResults(req, res);

    // Reset tests
    case "POST":
      return resetTests(req, res);

    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
