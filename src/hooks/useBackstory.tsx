import { useState, useEffect } from 'react';
import { useCharacter } from './useCharacter';
import { useRace } from './useRace';
import { useCharacterClass } from './useCharacterClass';
import { useTraits } from './useTraits';
import { useMotivation } from './useMotivation';
import { getCurrentCharacterId, getNamespacedJson, setNamespacedJson } from '@/utils/storage';

interface BackstoryState {
  generatedBackstory: string | null;
  isGenerating: boolean;
  error: string | null;
}

export function useBackstory() {
  const [backstoryState, setBackstoryState] = useState<BackstoryState>({
    generatedBackstory: null,
    isGenerating: false,
    error: null
  });
  const [loading, setLoading] = useState(true);
  const { character, loading: characterLoading, updateCharacter } = useCharacter();
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const { selectedTraits, loading: traitsLoading } = useTraits();
  const { motivationState, loading: motivationLoading } = useMotivation();

  useEffect(() => {
    const loadBackstory = () => {
      try {
        const characterId = getCurrentCharacterId();
        if (!characterId) {
          setLoading(false);
          return;
        }

        // Get backstory data from namespaced storage
        const backstory = getNamespacedJson(characterId, 'backstory_generatedBackstory');

        setBackstoryState(prev => ({
          ...prev,
          generatedBackstory: backstory
        }));
      } catch (error) {
        console.error('Error loading backstory:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBackstory();
  }, []);

  const setGeneratedBackstory = (backstory: string) => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setBackstoryState(prev => ({
      ...prev,
      generatedBackstory: backstory,
      isGenerating: false,
      error: null
    }));
    setNamespacedJson(characterId, 'backstory_generatedBackstory', backstory);
  };

  const setGenerating = (isGenerating: boolean) => {
    setBackstoryState(prev => ({
      ...prev,
      isGenerating,
      error: null
    }));
  };

  const setError = (error: string | null) => {
    setBackstoryState(prev => ({
      ...prev,
      error,
      isGenerating: false
    }));
  };

  const clearBackstory = () => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setBackstoryState({
      generatedBackstory: null,
      isGenerating: false,
      error: null
    });
    setNamespacedJson(characterId, 'backstory_generatedBackstory', null);
  };

  const generateBackstory = async () => {
    if (
      !selectedRace ||
      !selectedClass ||
      !selectedTraits ||
      !motivationState.generatedMotivation ||
      !character
    )
      return;
    if (raceLoading || classLoading || traitsLoading || motivationLoading)
      return;

    setGenerating(true);
    try {
      const response = await fetch("/api/character/generate-backstory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: character.name || "Unknown",
          race: {
            name: selectedRace.name,
            description: selectedRace.description || "",
          },
          class: {
            name: selectedClass.name,
            description: selectedClass.description || "",
          },
          traits: {
            personality: selectedTraits.personality || [],
            ideals: selectedTraits.ideals || [],
            bonds: selectedTraits.bonds || [],
            flaws: selectedTraits.flaws || [],
            hauntingMemory: selectedTraits.hauntingMemory || "",
            treasuredPossession: selectedTraits.treasuredPossession || "",
          },
          motivation: motivationState.generatedMotivation,
          sex: character.sex || "unknown",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate backstory");
      }

      const data = await response.json();
      setGeneratedBackstory(data.backstory);
      // Save the generated backstory to character state and localStorage
      updateCharacter({ 
        backstory: data.backstory
      });
    } catch (error) {
      console.error("Error generating backstory:", error);
      setError("Failed to generate character backstory. Please try again.");
    } finally {
      setGenerating(false);
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
        motivationState.generatedMotivation &&
        character &&
        !backstoryState.generatedBackstory // Only generate if we don't already have a backstory
      ) {
        await generateBackstory();
      }
    };

    generateBackstoryIfNeeded();
  }, [
    raceLoading,
    classLoading,
    traitsLoading,
    motivationLoading,
    characterLoading,
    selectedRace,
    selectedClass,
    selectedTraits,
    motivationState.generatedMotivation,
    character,
    backstoryState.generatedBackstory,
    generateBackstory
  ]);

  return {
    backstoryState,
    loading,
    setGeneratedBackstory,
    setGenerating,
    setError,
    clearBackstory,
    generateBackstory
  };
} 