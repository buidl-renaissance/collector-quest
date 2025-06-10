import { useEffect, useState } from "react";
import { useCurrentCharacter } from "./useCurrentCharacter";
import { useGeneratedResult } from "./useGeneratedResult";
import { Equipment } from "@/data/character";

export const useEquipment = () => {
  const { character, updateCharacter } = useCurrentCharacter();
  const [hasAttemptedGeneration, setHasAttemptedGeneration] = useState(false);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const {
    startGeneration,
    isGenerating,
    error,
    status,
    result: equipmentResult,
    event,
  } = useGeneratedResult<Equipment>();


  useEffect(() => {
    if (character?.id && !character.equipment) {
      generateEquipment();
    } else if (character?.id && character.equipment) {
      setEquipment(character.equipment);
    }
  }, [character]);

  useEffect(() => {
    if (equipmentResult) {
      setEquipment(equipmentResult);
    }
  }, [equipmentResult]);

  const generateEquipment = async () => {
    if (!character) {
      throw new Error("No character selected");
    }

    if (hasAttemptedGeneration) {
      return;
    }

    setHasAttemptedGeneration(true);

    await startGeneration(async () => {
      const response = await fetch("/api/character/generate-equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characterId: character.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start equipment generation");
      }

      const { event, equipment } = await response.json();

      if (equipment && character) {
        updateCharacter({ equipment });
      }

      return { event, result: equipment };
    });
  };

  return {
    generateEquipment,
    isGenerating,
    error,
    status,
    equipment,
    event,
  };
}; 