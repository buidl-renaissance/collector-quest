import OpenAI from "openai";
import { Character } from "@/hooks/useCharacter";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface SkillInput {
  race: string;
  characterClass: string;
  background: string;
  level: number;
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  traits?: string[];
  narrativeFlavor?: boolean;
}

export interface Skill {
  name: string;
  ability: string;
  modifier: number;
  proficient: boolean;
  expertise?: boolean;
}

interface SkillsOutput {
  skills: Skill[];
  description?: string;
}

export async function generateSkills(character: Character): Promise<SkillsOutput> {
  if (!character.race || !character.class) {
    throw new Error("Character race and class are required");
  }

  // Default ability scores if not provided
  const abilityScores = {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    // Override with character's actual scores if available
    // ...(character.abilityScores || {})
  };

  const input: SkillInput = {
    race: character.race.name,
    characterClass: character.class.name,
    background: character.traits?.background || "Commoner",
    level: character.level || 1,
    abilityScores,
    traits: character.traits?.personality,
    narrativeFlavor: true
  };

  const prompt = `
    Generate skills for a D&D 5e character with the following details:
    
    Character Details:
    - Race: ${input.race}
    - Class: ${input.characterClass}
    - Level: ${input.level}
    - Background: ${input.background}
    
    Ability Scores:
    - Strength: ${input.abilityScores.strength}
    - Dexterity: ${input.abilityScores.dexterity}
    - Constitution: ${input.abilityScores.constitution}
    - Intelligence: ${input.abilityScores.intelligence}
    - Wisdom: ${input.abilityScores.wisdom}
    - Charisma: ${input.abilityScores.charisma}
    
    ${input.traits?.length ? `Personality Traits: ${input.traits.join(", ")}` : ''}
    
    Please generate a comprehensive list of all 18 D&D 5e skills for this character, including:
    1. Each skill's associated ability
    2. Whether the character is proficient in the skill (based on class, background, and race)
    3. Whether the character has expertise in the skill (if applicable)
    4. The calculated modifier for each skill
    
    Return the result as a JSON object with the following structure:
    {
      "skills": [
        {
          "name": "Acrobatics",
          "ability": "Dexterity",
          "modifier": 3,
          "proficient": true,
          "expertise": false
        },
        ...
      ]
    }
    
    Calculate modifiers using:
    - Ability modifier = (ability score - 10) / 2, rounded down
    - Proficiency bonus = 2 + (level - 1) / 4, rounded down
    - Skill modifier = ability modifier + (proficiency bonus if proficient) + (proficiency bonus again if expertise)
  `;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a D&D 5e rules expert specializing in character creation. You provide accurate, comprehensive lists of character skills based on official D&D 5e rules."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1000
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("Failed to generate skills");
    }

    const result = JSON.parse(content) as SkillsOutput;
    
    // Generate narrative description if requested
    if (input.narrativeFlavor) {
      result.description = await generateSkillsDescription(input, result);
    }
    
    return result;
  } catch (error) {
    console.error("Error generating skills:", error);
    throw new Error("Failed to generate skills");
  }
}

async function generateSkillsDescription(
  input: SkillInput,
  result: SkillsOutput
): Promise<string> {
  // Find the top 3 skills by modifier
  const topSkills = [...result.skills]
    .sort((a, b) => b.modifier - a.modifier)
    .slice(0, 3);
  
  const prompt = `
    Create a brief, evocative description (2-3 sentences) of how a ${input.race} ${input.characterClass} 
    with a ${input.background} background demonstrates their skills and abilities.
    
    Their top skills are:
    ${topSkills.map(skill => `- ${skill.name} (+${skill.modifier})`).join('\n')}
    
    The description should highlight these skills in action and reflect the character's personality.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a creative writing assistant specializing in fantasy character descriptions. Create vivid, concise descriptions that capture a character's unique abilities and skills."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return completion.choices[0]?.message?.content?.trim() || 
      "This character demonstrates remarkable proficiency in their top skills, showcasing their unique talents and abilities.";
  } catch (error) {
    console.error("Error generating skills description:", error);
    return "This character demonstrates remarkable proficiency in their top skills, showcasing their unique talents and abilities.";
  }
}
