import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface BackstoryRequest {
  name: string;
  race: {
    name: string;
    description: string;
  };
  class: {
    name: string;
    description: string;
  };
  traits: {
    personality: string[];
    ideals: string[];
    bonds: string[];
    flaws: string[];
    hauntingMemory: string;
    treasuredPossession: string;
  };
  motivation: string;
  sex: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      name,
      race,
      class: characterClass,
      traits,
      motivation,
      sex,
    } = req.body as BackstoryRequest;

    const prompt = `Create a rich, detailed backstory for a ${sex} ${race.name} ${characterClass.name} named ${name}. 
    
    Character traits:
    - Personality: ${traits.personality.join(", ")}
    - Ideals: ${traits.ideals.join(", ")}
    - Bonds: ${traits.bonds.join(", ")}
    - Flaws: ${traits.flaws.join(", ")}
    - Haunting Memory: ${traits.hauntingMemory}
    - Treasured Possession: ${traits.treasuredPossession}
    
    Primary Motivation: ${motivation}
    
    Race Description: ${race.description}
    Class Description: ${characterClass.description}
    
    Write a compelling backstory that weaves together these elements into a cohesive narrative. The backstory should be written in third person and be approximately 3-4 paragraphs long.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a creative writing assistant specializing in crafting rich, detailed character backstories for fantasy roleplaying games. Your writing should be engaging, vivid, and emotionally resonant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.8,
      max_tokens: 1000,
    });

    const backstory = completion.choices[0]?.message?.content || "";

    res.status(200).json({ backstory });
  } catch (error) {
    console.error("Error generating backstory:", error);
    res.status(500).json({ message: "Error generating backstory" });
  }
} 