import { useState, useEffect } from "react";
import { Character } from "./useCharacter";

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

export const useEquipment = (character: Character | null) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus | null>(null);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [hasAttemptedGeneration, setHasAttemptedGeneration] = useState(false);

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
      const response = await fetch("/api/equipment/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characterId: character.id,
          character,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start equipment generation");
      }

      const { resultId } = await response.json();
      pollStatus(resultId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate equipment");
      setIsGenerating(false);
    }
  };

  const pollStatus = async (resultId: string) => {
    try {
      const response = await fetch(`/api/image/status?id=${resultId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch status");
      }

      const data = await response.json();
      setStatus(data.status);

      const result = JSON.parse(data.result);

      console.log("result", result);

      if (result?.equipment) {
        setEquipment(result.equipment);
        setIsGenerating(false);
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
  };
}; 