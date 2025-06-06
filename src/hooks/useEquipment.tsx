import { useState, useEffect } from "react";
import { Character } from "./useCurrentCharacter";
import { useCurrentCharacter } from "./useCurrentCharacter";
import { GenerationResult } from "@/data/generate";
interface EquipmentItem {
  name: string;
  quantity: number;
}

interface Equipment {
  weapons: EquipmentItem[];
  armor: EquipmentItem[];
  adventuringGear: EquipmentItem[];
  tools: EquipmentItem[];
  currency: EquipmentItem[];
}

interface GenerationStatus {
  step: string;
  message: string;
  equipment?: Equipment;
}

export const useEquipment = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus | null>(null);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const { character, updateCharacter } = useCurrentCharacter();
  const [hasAttemptedGeneration, setHasAttemptedGeneration] = useState(false);
  const [event, setEvent] = useState<GenerationResult<Equipment> | null>(null);

  const generateEquipment = async () => {
    if (!character) {
      setError("No character selected");
      return;
    }

    if (hasAttemptedGeneration) {
      return;
    }

    setIsGenerating(true);
    setError(null);
    setStatus(null);
    setHasAttemptedGeneration(true);

    try {
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

      if (equipment) {
        setEquipment(equipment);
        setIsGenerating(false);
        if (character) {
          updateCharacter({ equipment: equipment });
        }
      } else {
        setEvent(event);
        pollStatus(event.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate equipment");
      setIsGenerating(false);
    }
  };

  const pollStatus = async (resultId: string) => {
    try {
      const response = await fetch(`/api/generate/results?id=${resultId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch status");
      }

      const data = await response.json();
      setStatus(data);

      const result = data.result;

      if (result) {
        setEquipment(result);
        setIsGenerating(false);
        if (character) {
          updateCharacter({ equipment: result });
        }
      } else if (result?.step !== "complete") {
        // Continue polling if not complete
        setTimeout(() => pollStatus(resultId), 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch status");
      setIsGenerating(false);
    }
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