import type { NextApiRequest, NextApiResponse } from "next";
import { saveRsvp } from "@/lib/db";
import { TimeSlot } from "@/lib/interfaces";

type FormData = {
  name: string;
  email: string;
  guests: number;
  timeSlot: TimeSlot;
  message?: string;
};

type ResponseData = {
  success: boolean;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    // Parse the request body
    const { name, email, guests, timeSlot, message }: FormData = JSON.parse(req.body);

    // Basic validation
    if (!name || !email || !guests || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (typeof guests !== "number" || guests < 1 || guests > 5) {
      return res.status(400).json({
        success: false,
        message: "Invalid number of guests",
      });
    }

    // Validate timeSlot
    if (
      !timeSlot.id ||
      !timeSlot.date ||
      !timeSlot.startTime ||
      !timeSlot.endTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid time slot information",
      });
    }

    // Here you would typically store the data in a database
    // For example with a database client:
    // await db.collection('rsvps').insertOne({ name, email, guests, timeSlot, message, createdAt: new Date() });
    const result = await saveRsvp({ name, email, guests, timeSlot, message });

    // For now, we'll just log it and return success
    console.log("RSVP Submission:", { name, email, guests, timeSlot, message });

    // Return success response
    return res.status(200).json({
      success: true,
      message: "RSVP submitted successfully",
    });
  } catch (error) {
    console.error("Error processing RSVP:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
}
