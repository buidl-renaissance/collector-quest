import OpenAI from 'openai';
import { Character } from '../data/character';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCampaign(characters: Character[]) {
  // Format characters into summaries
  const characterSummaries = characters.map((char, i) => ({
    name: char.name,
    race: char.race?.name || 'Unknown',
    class: char.class?.name || 'Unknown',
    backstory: char.backstory || 'Unknown',
    motivation: char.motivation || 'Unknown',
    personality: char.traits?.personality?.join(', ') || 'Unknown',
    bonds: char.traits?.bonds?.join(', ') || 'Unknown',
    flaws: char.traits?.flaws?.join(', ') || 'Unknown',
    alignment: char.traits?.alignment || 'Unknown',
    deity: char.traits?.deity || 'Unknown',
    background: char.traits?.background || 'Unknown',
    ideals: char.traits?.ideals?.join(', ') || 'Unknown',
    actions: char.traits?.actions?.join(', ') || 'Unknown',
  }));

  // Build character descriptions string
  const characterDescriptions = characterSummaries
    .map((char, i) => (
      `${i + 1}. Name: ${char.name}\n` +
      `   Race: ${char.race}\n` +
      `   Class: ${char.class}\n` +
      `   Background: ${char.background}\n` +
      `   Motivation: ${char.motivation}\n` +
      `   Personality: ${char.personality}\n` +
      `   Bonds: ${char.bonds}\n` +
      `   Flaws: ${char.flaws}\n` +
      `   Alignment: ${char.alignment}\n` +
      `   Deity: ${char.deity}\n` +
      `   Background: ${char.background}\n` +
      `   Ideals: ${char.ideals}\n` +
      `   Actions: ${char.actions}`
    ))
    .join('\n\n');

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
    temperature: 0.8,
    response_format: { type: "json_object" }
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
