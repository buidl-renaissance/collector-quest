import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface InitiativeInput {
  characterClass: string;
  race: string;
  background: string;
  alignment: string;
  dexterityScore: number;
  level: number;
  traits: string[];
  bonuses?: {
    feats?: string[];
    magicItems?: string[];
    classFeatures?: boolean;
  };
  narrativeFlavor?: boolean;
  outputFormat?: string;
}

interface InitiativeOutput {
  initiativeModifier: number;
  breakdown: {
    dexterityModifier: number;
    featBonus: number;
    magicItemBonus: number;
    classFeatureBonus: number;
  };
  description?: string;
}

export async function generateInitiative(input: InitiativeInput): Promise<InitiativeOutput> {
  // Calculate dexterity modifier
  const dexterityModifier = Math.floor((input.dexterityScore - 10) / 2);
  
  // Initialize other bonuses
  let featBonus = 0;
  let magicItemBonus = 0;
  let classFeatureBonus = 0;
  
  // Check for Alert feat
  if (input.bonuses?.feats?.includes("Alert")) {
    featBonus += 5;
  }
  
  // Process magic items (simplified implementation)
  if (input.bonuses?.magicItems?.length) {
    // This would be expanded with actual item effects
    if (input.bonuses.magicItems.includes("Boots of Speed")) {
      magicItemBonus += 1;
    }
  }
  
  // Process class features
  if (input.bonuses?.classFeatures) {
    // Example: Swashbuckler Rogue adds Charisma modifier
    // In a real implementation, you would check the character's class and subclass
    if (input.characterClass === "Rogue" && input.level >= 3) {
      // Assuming Charisma modifier would be provided in a real implementation
      // For now, just adding a placeholder bonus
      classFeatureBonus += 1;
    }
  }
  
  // Calculate total initiative modifier
  const initiativeModifier = dexterityModifier + featBonus + magicItemBonus + classFeatureBonus;
  
  // Create the result object
  const result: InitiativeOutput = {
    initiativeModifier,
    breakdown: {
      dexterityModifier,
      featBonus,
      magicItemBonus,
      classFeatureBonus
    }
  };
  
  // Generate narrative description if requested
  if (input.narrativeFlavor) {
    const description = await generateInitiativeDescription(input, result);
    result.description = description;
  }
  
  return result;
}

async function generateInitiativeDescription(
  input: InitiativeInput,
  result: InitiativeOutput
): Promise<string> {
  const prompt = `
    Create a short, cinematic description (1-2 sentences) of how a ${input.race} ${input.characterClass} 
    with a ${input.background} background and ${input.alignment} alignment, 
    possessing a Dexterity score of ${input.dexterityScore} and an initiative modifier of +${result.initiativeModifier}, 
    reacts at the start of combat.
    
    Character traits: ${input.traits.join(", ")}
    
    ${input.bonuses?.feats?.length ? `Special feats: ${input.bonuses.feats.join(", ")}` : ""}
    ${input.bonuses?.magicItems?.length ? `Magic items: ${input.bonuses.magicItems.join(", ")}` : ""}
    
    The description should be vivid and reflect the character's personality and combat style.
  `;

  try {
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
      max_tokens: 150
    });

    return completion.choices[0]?.message?.content?.trim() || 
      "With lightning reflexes, they spring into action at the first sign of danger.";
  } catch (error) {
    console.error("Error generating initiative description:", error);
    return "With lightning reflexes, they spring into action at the first sign of danger.";
  }
}
