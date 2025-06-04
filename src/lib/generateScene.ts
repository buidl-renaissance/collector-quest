import OpenAI from "openai";
import { Scene } from "../data/scenes";
import { Locale } from "../data/locales";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface SceneGenerationInput {
  campaignId: string;
  customPrompt?: string;
  locale?: Locale;
}

export async function generateScene(input: SceneGenerationInput): Promise<Scene> {
  try {
    const systemPrompt = `You are a creative scene generator for a fantasy RPG. Generate a scene description that matches exactly this TypeScript interface:

{
  name: string;
  description: string;
  imageUrl: string;
  atmosphere: string;
  npcsPresent: Array<{ id: string; name: string; imageUrl?: string }>;
  interactables: Array<{
    name: string;
    description?: string;
    imageUrl?: string;
    type?: string;
  }>;
  secrets: string[];
  challenges: string[];
  lighting: string;
  ambiance: {
    sounds: string[];
    smells: string[];
  };
  lore: string;
  encounterType: "combat" | "social" | "exploration" | "puzzle" | "mixed";
  objectives: string[];
}

Be creative and detailed in your descriptions. Include:
- Evocative location names and physical descriptions
- Rich atmospheric details and emotional tones
- NPCs with clear roles and motivations
- Interactive objects that players can meaningfully engage with
- Interesting secrets and discoverable elements
- Clear challenges or obstacles
- Specific lighting conditions
- Immersive ambient details
- Relevant historical or lore elements
- Clear encounter type and objectives`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Generate a scene for campaign ${input.campaignId}${
            input.locale ? ` set in ${input.locale.name}: ${input.locale.description}` : ''
          }${input.customPrompt ? `\nAdditional context: ${input.customPrompt}` : ''}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const sceneData = JSON.parse(completion.choices[0]?.message?.content || "{}");
    
    return {
      id: crypto.randomUUID(),
      campaignId: input.campaignId,
      locale: input.locale || {
        id: "",
        name: "",
        description: "",
        imageUrl: "",
        isRealWorld: false,
        geoLocation: {
          lat: 0,
          lng: 0
        }
      },
      ...sceneData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error generating scene:", error);
    throw new Error("Failed to generate scene");
  }
}


