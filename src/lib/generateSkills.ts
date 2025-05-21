import OpenAI from "openai";
import { Character, Skill } from "@/data/character";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export async function generateSkills(character: Character): Promise<Skill[]> {
  if (!character.race || !character.class) {
    throw new Error("Character race and class are required");
  }

  if (character.sheet?.skills) {
    return character.sheet.skills;
  }

  const prompt = `
    Generate skills for a D&D 5e character with the following details:
    
    Character Details:
    - Race: ${character.race.name}
    - Class: ${character.class.name}
    - Level: ${character.level}
    - Background: ${character.traits?.background}
    
    Ability Scores:
    - Strength: ${character.sheet?.abilitiesScores?.strength?.total}
    - Dexterity: ${character.sheet?.abilitiesScores?.dexterity?.total}
    - Constitution: ${character.sheet?.abilitiesScores?.constitution?.total}
    - Intelligence: ${character.sheet?.abilitiesScores?.intelligence?.total}
    - Wisdom: ${character.sheet?.abilitiesScores?.wisdom?.total}
    - Charisma: ${character.sheet?.abilitiesScores?.charisma?.total}
    
    ${character.traits?.personality?.length ? `Personality Traits: ${character.traits.personality.join(", ")}` : ''}
    
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

    const result = JSON.parse(content) as { skills: Skill[] };
    
    // Generate narrative description if requested
    // result.description = await generateSkillsDescription(character, result);
    
    return result.skills;
  } catch (error) {
    console.error("Error generating skills:", error);
    throw new Error("Failed to generate skills");
  }
}

// async function generateSkillsDescription(
//   character: Character,
//   result: SkillsOutput
// ): Promise<string> {
//   // Find the top 3 skills by modifier
//   const topSkills = [...result.skills]
//     .sort((a, b) => b.modifier - a.modifier)
//     .slice(0, 3);
  
//   const prompt = `
//     Create a brief, evocative description (2-3 sentences) of how a ${character.race?.name} ${character.class?.name} 
//     with a ${character.traits?.background} background demonstrates their skills and abilities.
    
//     Their top skills are:
//     ${topSkills.map(skill => `- ${skill.name} (+${skill.modifier})`).join('\n')}
    
//     The description should highlight these skills in action and reflect the character's personality.
//   `;

//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: "You are a creative writing assistant specializing in fantasy character descriptions. Create vivid, concise descriptions that capture a character's unique abilities and skills."
//         },
//         {
//           role: "user",
//           content: prompt
//         }
//       ],
//       temperature: 0.7,
//       max_tokens: 150
//     });

//     return completion.choices[0]?.message?.content?.trim() || 
//       "This character demonstrates remarkable proficiency in their top skills, showcasing their unique talents and abilities.";
//   } catch (error) {
//     console.error("Error generating skills description:", error);
//     return "This character demonstrates remarkable proficiency in their top skills, showcasing their unique talents and abilities.";
//   }
// }
