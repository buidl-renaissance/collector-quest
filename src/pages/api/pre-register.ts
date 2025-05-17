import { NextApiRequest, NextApiResponse } from "next";
import db from "@/db/client";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, phone } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate phone number if provided
    if (phone) {
      const phoneNumbers = phone.replace(/\D/g, "");
      if (phoneNumbers.length !== 10) {
        return res.status(400).json({ error: "Phone number must be 10 digits" });
      }
    }

    // Check if email already exists
    const existingUser = await db("characters")
      .where({ email })
      .first();

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Generate verification code
    const verificationCode = crypto.randomBytes(32).toString("hex");
    const verificationCodeExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const id = uuidv4();

    // Insert new pre-registration
    await db("characters").insert({
      id,
      name: '',
      real_name: name,
      email,
      status: "pre_registered",
      phone: phone || null,
      verified: false,
      verification_code: verificationCode,
      verification_code_expiration: verificationCodeExpiration,
    });

    // TODO: Send verification email
    // This would be implemented with your email service of choice

    return res.status(200).json({
      success: true,
      message: "Pre-registration successful",
      id
    });
  } catch (error) {
    console.error("Error in pre-registration:", error);
    return res.status(500).json({
      error: "Failed to process pre-registration",
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 