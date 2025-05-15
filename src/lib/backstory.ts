import { Character } from "@/hooks/useCharacter";

interface BackstoryGenerationResult {
  backstory: string;
  success: boolean;
  error?: string;
}

export const generateBackstory = async (character: Character): Promise<BackstoryGenerationResult> => {
  if (
    !character.race ||
    !character.class ||
    !character.traits ||
    !character.motivation
  ) {
    return {
      backstory: "",
      success: false,
      error: "Missing required character information"
    };
  }

  try {
    const response = await fetch("/api/character/generate-backstory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: character.name || "Unknown",
        race: {
          name: character.race.name,
          description: character.race.description || "",
        },
        class: {
          name: character.class.name,
          description: character.class.description || "",
        },
        traits: {
          personality: character.traits.personality || [],
          ideals: character.traits.ideals || [],
          bonds: character.traits.bonds || [],
          flaws: character.traits.flaws || [],
          hauntingMemory: character.traits.hauntingMemory || "",
          treasuredPossession: character.traits.treasuredPossession || "",
        },
        motivation: character.motivation,
        sex: character.sex || "unknown",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate backstory");
    }

    const data = await response.json();
    return {
      backstory: data.backstory,
      success: true
    };
  } catch (error) {
    console.error("Error generating backstory:", error);
    return {
      backstory: "",
      success: false,
      error: "Failed to generate character backstory. Please try again."
    };
  }
};

