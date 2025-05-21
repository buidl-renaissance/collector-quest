import OpenAI from "openai";
import { Character, Initiative } from "@/data/character";
import { DetailedAbilityScores } from "./generateAbilities";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export function generateInitiative(character: Character, abilitiesScores: DetailedAbilityScores): Initiative {
  if (!character.race || !character.class || !abilitiesScores) {
    throw new Error("Character race, class, and abilities are required");
  }

  // Calculate dexterity modifier
  const dexScore = (character.sheet?.abilitiesScores?.dexterity?.modifier ?? 0) + (character.sheet?.abilitiesScores?.dexterity?.base ?? 0) || 10;
  const dexMod = Math.floor((dexScore - 10) / 2);
  
  // Get character class
  const characterClass = character.class.name;
  
  // Initialize bonuses
  const classBonus = 0; // TODO: Add class bonus
  const relics: { name: string; initiativeBonus: number }[] = [];
  const traits: { name: string; initiativeBonus: number }[] = [];
  const statusEffects: { name: string; initiativeBonus: number }[] = [];
  
  // Check for class-specific initiative bonuses
  // if (characterClass === "Rogue" && character.class?.subclasses?.some((subclass: CharacterSubclass) => subclass.id === "swashbuckler")) {
  //   classBonus += 2;
  // }
  
  // Check for equipment/relics that might affect initiative
  if (character.equipment) {
    // Example: Check for items that boost initiative
    if (character.equipment.magicItems?.some(item => item.name === "Boots of Speed")) {
      relics.push({ name: "Boots of Speed", initiativeBonus: 1 });
    }
  }
  
  // Check for traits that affect initiative
  if (character.traits?.personality) {
    // Example: If the character has an "Alert" trait
    if (character.traits.personality.some(trait => trait.toLowerCase().includes("alert") || trait.toLowerCase().includes("quick"))) {
      traits.push({ name: "Alert", initiativeBonus: 1 });
    }
  }
  
  // Calculate total bonuses
  const relicBonus = relics.reduce((sum, relic) => sum + relic.initiativeBonus, 0);
  const traitBonus = traits.reduce((sum, trait) => sum + trait.initiativeBonus, 0);
  const statusBonus = statusEffects.reduce((sum, status) => sum + status.initiativeBonus, 0);
  
  // Calculate total initiative
  const totalInitiative = dexMod + classBonus + relicBonus + traitBonus + statusBonus;
  
  // Determine initiative tier
  const tier = getInitiativeTier(totalInitiative);
  
  // Generate flavor text
  const flavorText = generateFlavorText(character, totalInitiative, tier);
  
  return {
    dexMod,
    class: characterClass,
    relics,
    traits,
    statusEffects,
    initiativeBreakdown: {
      dexMod,
      classBonus,
      relicBonus,
      traitBonus,
      statusBonus,
      totalInitiative,
      tier
    },
    flavorText
  };
}

function getInitiativeTier(score: number): string {
  if (score >= 6) return "Lightning";
  if (score >= 4) return "Quick";
  if (score >= 2) return "Steady";
  if (score >= 0) return "Cautious";
  return "Sluggish";
}

function generateFlavorText(character: Character, initiative: number, tier: string): string {
  const race = character.race?.name || "adventurer";
  const characterClass = character.class?.name || "fighter";
  
  // Basic flavor text based on initiative tier
  switch (tier) {
    case "Lightning":
      return `With supernatural reflexes, the ${race} ${characterClass} moves before others can even register danger.`;
    case "Quick":
      return `Alert and ready, the ${race} ${characterClass} springs into action with impressive speed.`;
    case "Steady":
      return `The ${race} ${characterClass} reacts with practiced efficiency, neither rushing nor hesitating.`;
    case "Cautious":
      return `The ${race} ${characterClass} takes a moment to assess the situation before committing to action.`;
    case "Sluggish":
      return `The ${race} ${characterClass} moves deliberately, preferring caution over haste.`;
    default:
      return `The ${race} ${characterClass} prepares to face whatever challenges lie ahead.`;
  }
}

// Async version that uses OpenAI for more creative flavor text
export async function generateInitiativeWithAI(character: Character, abilitiesScores: DetailedAbilityScores): Promise<Initiative> {
  const baseResult = generateInitiative(character, abilitiesScores);
  
  try {
    const prompt = `
      Generate a short, cinematic description (1 sentence) of how a ${character.race?.name} ${character.class?.name} 
      with a ${character.traits?.background || "mysterious"} background and ${character.traits?.alignment || "neutral"} alignment, 
      having an initiative modifier of +${baseResult.initiativeBreakdown.totalInitiative}, 
      reacts at the start of combat.
      
      Initiative tier: ${baseResult.initiativeBreakdown.tier}
      
      Character traits: ${character.traits?.personality?.join(", ") || "unknown"}
      
      The description should be vivid and reflect the character's personality and combat style.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a creative writing assistant specializing in fantasy combat descriptions. Create vivid, concise descriptions that capture a character's unique combat style."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    const aiFlavorText = completion.choices[0]?.message?.content?.trim();
    if (aiFlavorText) {
      baseResult.flavorText = aiFlavorText;
    }
  } catch (error) {
    console.error("Error generating initiative description with AI:", error);
    // Keep the default flavor text if AI generation fails
  }
  
  return baseResult;
}
