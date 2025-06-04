
import OpenAI from "openai";
import { Locale, LocaleType } from "../data/locales";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


interface LocaleGenerationInput {
  prompt: string;
  localeType: LocaleType;
  isRealWorld?: boolean;
}

export async function generateLocale(input: LocaleGenerationInput): Promise<Omit<Locale, "id" | "imageUrl">> {
  try {
    const systemPrompt = `You are a creative location generator for a fantasy RPG. Generate a ${input.localeType} location name and description based on the provided prompt. The response should be in JSON format with these fields:
{
  "name": "A concise but evocative ${input.localeType} name",
  "description": "A rich, detailed description of the ${input.localeType} including its key features, atmosphere, and any notable characteristics"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user", 
          content: input.prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const localeData = JSON.parse(completion.choices[0]?.message?.content || "{}");

    return {
      name: localeData.name,
      description: localeData.description,
      type: input.localeType as LocaleType,
    };
  } catch (error) {
    console.error("Error generating locale:", error);
    throw new Error("Failed to generate locale");
  }
}

export async function generateLocaleImage(locale: Locale): Promise<string> {
  try {
    const imagePrompt = `Fantasy RPG style digital art of a ${locale.type} called "${locale.name}". ${locale.description}`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid"
    });

    return response.data[0]?.url || '';
  } catch (error) {
    console.error("Error generating locale image:", error);
    throw new Error("Failed to generate locale image");
  }
}