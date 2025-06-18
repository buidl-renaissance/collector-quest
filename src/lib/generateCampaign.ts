import OpenAI from 'openai';
import { Character } from '../data/character';
import { formatCharacterDescription, generateCharacterSummaries } from './character';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCampaign(characters: Character[]) {
  const characterSummaries = generateCharacterSummaries(characters);
  const characterDescriptions = characterSummaries.map((summary, index) => formatCharacterDescription(summary, `Character ${index + 1}:`)).join("\n\n");
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a world-class game master helping storytellers generate immersive RPG campaigns based on a party of characters. Given a list of characters with traits, design a compelling campaign title and description that integrates their backgrounds, motivations, and unique abilities. Return the response in JSON format with 'name' and 'description' fields."
      },
      {
        role: "user", 
        content: `Here are the characters:\n\n${characterDescriptions}\n\nGenerate a campaign name and description that reflects each character's personal arc while tying into a shared world conflict. Format the response as JSON with 'name' and 'description' fields.`
      }
    ],
    temperature: 0.8
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No content returned from OpenAI');
  }
  const json = JSON.parse(content);
  if (!json.name || !json.description) {
    throw new Error('Invalid JSON response from OpenAI');
  }
  return json;
}
