import OpenAI from 'openai';
import { formatCharacterDescription, generateCharacterSummaries } from './character';
import { Character } from '@/data/character';
import { Locale } from '@/data/locales';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSceneIntroduction(characters: Character[], locale: Locale) {
  const characterSummaries = generateCharacterSummaries(characters);
  const characterDescriptions = characterSummaries.map((summary, index) => formatCharacterDescription(summary, `Character ${index + 1}:`)).join("\n\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an expert dungeon master skilled at setting scenes and creating engaging scenarios for players. Given character details and a location, create an immersive introduction that sets up an interesting situation for roleplay."
      },
      {
        role: "user",
        content: `Location: ${locale.name} (${locale.type})
${locale.description}
        
Characters present:
${characterDescriptions}

Create an engaging scene introduction that:
1. Describes the atmosphere and relevant NPCs at ${locale.name}
2. Sets up an interesting situation or conflict
3. Gives the players clear opportunities to interact and make choices
4. Incorporates elements of the location and surroundings if relevant

Keep the tone appropriate for the setting while creating opportunities for character development and roleplay.`
      }
    ],
    temperature: 0.8,
    max_tokens: 1000
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No content returned from OpenAI');
  }

  return content;
}
