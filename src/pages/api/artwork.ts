import { NextApiRequest, NextApiResponse } from "next";
import { getArtworks } from "@/lib/getArtwork";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const artworks = await getArtworks();
    return res.status(200).json({ artworks });
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return res.status(500).json({ message: "Error fetching artworks", error });
  }
}
