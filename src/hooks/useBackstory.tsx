import { useState, useEffect } from "react";
import { useCurrentCharacter } from "./useCurrentCharacter";
import { useRace } from "./useRace";
import { useCharacterClass } from "./useCharacterClass";
import { useTraits } from "./useTraits";
import { useMotivation } from "./useMotivation";
import {
  getCurrentCharacterId,
  getCharacterKey,
  setCharacterKey,
} from "@/utils/storage";
import { generateBackstory as generateBackstoryRequest } from "@/lib/backstory";

interface BackstoryState {
  backstory: string | null;
  isGenerating: boolean;
  error: string | null;
}

export function useBackstory() {
  const [backstory, setBackstory] = useState<string | null>(null);
  const [isGeneratingBackstory, setIsGeneratingBackstory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { character, loading: characterLoading } = useCurrentCharacter();
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const { selectedTraits, loading: traitsLoading } = useTraits();
  const { motivation, loading: motivationLoading } = useMotivation();

  useEffect(() => {
    const loadBackstory = () => {
      try {
        const characterId = getCurrentCharacterId();
        if (!characterId) {
          setLoading(false);
          return;
        }

        // Get backstory data from namespaced storage
        const savedBackstory = getCharacterKey(
          characterId,
          "backstory_generatedBackstory"
        );
        setBackstory(savedBackstory);
      } catch (error) {
        console.error("Error loading backstory:", error);
        setError("Failed to load backstory");
      } finally {
        setLoading(false);
      }
    };

    loadBackstory();
  }, []);

  const saveBackstory = (newBackstory: string) => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setBackstory(newBackstory);
    setError(null);
    setCharacterKey(
      characterId,
      "backstory_generatedBackstory",
      newBackstory
    );
  };

  const clearBackstory = () => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setBackstory(null);
    setError(null);
    setCharacterKey(characterId, "backstory_generatedBackstory", null);
  };

  const generateBackstory = async () => {
    if (!character) {
      setError("Missing character information");
      return;
    }

    setIsGeneratingBackstory(true);
    setError(null);

    try {
      const { backstory: generatedBackstory, success } = await generateBackstoryRequest(character);
      if (success) {
        saveBackstory(generatedBackstory);
      } else {
        setError("Failed to generate backstory");
      }
    } catch (error) {
      console.error("Error generating backstory:", error);
      setError("Failed to generate character backstory. Please try again.");
    } finally {
      setIsGeneratingBackstory(false);
    }
  };

  // Auto-generate backstory when all required data is loaded
  useEffect(() => {
    const generateBackstoryIfNeeded = async () => {
      if (
        !raceLoading &&
        !classLoading &&
        !traitsLoading &&
        !motivationLoading &&
        !characterLoading &&
        selectedRace &&
        selectedClass &&
        selectedTraits &&
        motivation &&
        character &&
        !backstory // Only generate if we don't already have a backstory
      ) {
        setIsGeneratingBackstory(true);
        const { backstory: generatedBackstory, success } = await generateBackstoryRequest(character);
        if (success) {
          saveBackstory(generatedBackstory);
        }
        setIsGeneratingBackstory(false);
      }
    };

    generateBackstoryIfNeeded();
  }, [
    character,
    selectedRace,
    selectedClass,
    selectedTraits,
    motivation,
    backstory,
    raceLoading,
    classLoading,
    traitsLoading,
    motivationLoading,
    characterLoading,
  ]);

  return {
    backstory,
    isGeneratingBackstory,
    error,
    loading,
    generateBackstory,
    clearBackstory,
  };
}
