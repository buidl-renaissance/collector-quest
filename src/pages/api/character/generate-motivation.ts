import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface MotivationInput {
  actions: string[];
  forces: string[];
  forceIntensities: Record<string, number>;
  archetype: string | null;
  sex: string;
  race: string;
  class: string;
  personality: string[];
  ideals: string[];
  flaws: string[];
  hauntingMemory: string;
  treasuredPossession: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      actions, 
      forces, 
      forceIntensities, 
      archetype, 
      sex,
      race,
      class: characterClass,
      personality,
      ideals,
      flaws,
      hauntingMemory,
      treasuredPossession
    } = req.body as MotivationInput;

    // Create a detailed prompt for the AI
    const prompt = `Create a compelling character motivation based on the following elements:

Character Details:
- Race: ${race}
- Class: ${characterClass}
- Sex: ${sex}

Personality & Traits:
- Personality: ${personality.join(', ')}
- Ideals: ${ideals.join(', ')}
- Flaws: ${flaws.join(', ')}
- Haunting Memory: ${hauntingMemory}
- Treasured Possession: ${treasuredPossession}

Motivational Elements:
- Actions: ${actions.join(', ')}
- Driving Forces: ${forces.join(', ')}
- Force Intensities: ${Object.entries(forceIntensities)
  .map(([force, intensity]) => `${force}: ${intensity}/5`)
  .join(', ')}
- Archetype: ${archetype || 'None'}

Generate a rich, nuanced motivation that:
1. Incorporates all selected actions and forces
2. Reflects the intensity levels of each force
3. Matches the character archetype if specified
4. Includes subtle psychological depth
5. Suggests potential internal conflicts
6. Maintains a natural, flowing narrative style
7. Acknowledges the character's race, class, and sex in a nuanced way
8. Connects to their personality traits, ideals, and flaws
9. References their haunting memory and treasured possession
10. Creates a cohesive narrative that ties all elements together

The output should be a single, cohesive paragraph that reads like a character study.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a creative writing expert specializing in character development and motivation. Your task is to generate rich, nuanced character motivations that incorporate multiple elements while maintaining narrative coherence."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const generatedMotivation = completion.choices[0]?.message?.content || '';

    res.status(200).json({ motivation: generatedMotivation });
  } catch (error) {
    console.error('Error generating motivation:', error);
    res.status(500).json({ error: 'Failed to generate motivation' });
  }
} 