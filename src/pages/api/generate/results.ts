import { NextApiRequest, NextApiResponse } from "next";
import { getResult } from "@/db/generate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Result ID is required" });
    }

    const result = await getResult(id);

    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching generation result:", error);
    return res.status(500).json({ 
      error: "Failed to fetch generation result",
      details: error instanceof Error ? error.message : String(error)
    });
  }
}