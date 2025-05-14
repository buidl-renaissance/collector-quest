import { useState, useEffect } from 'react';
import { useCharacter } from './useCharacter';
import { useRace } from './useRace';
import { useCharacterClass } from './useCharacterClass';
import { useTraits } from './useTraits';
import { useMotivation } from './useMotivation';

export const useBackstory = () => {
  const [isGeneratingBackstory, setIsGeneratingBackstory] = useState(false);
  const [characterBackstory, setCharacterBackstory] = useState("");
  const { character, loading, updateCharacter } = useCharacter();
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const { selectedTraits, loading: traitsLoading } = useTraits();
  const { motivationState, loading: motivationLoading } = useMotivation();

  // Load saved backstory from localStorage on initial render
  useEffect(() => {
    const savedBackstory = localStorage.getItem('characterBackstory');
    if (savedBackstory) {
      setCharacterBackstory(savedBackstory);
    }
  }, []);

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

    setIsGeneratingBackstory(true);
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
      setCharacterBackstory(data.backstory);
      // Save the generated backstory to character state and localStorage
      updateCharacter({ 
        backstory: data.backstory
      });
      localStorage.setItem('characterBackstory', data.backstory);
    } catch (error) {
      console.error("Error generating backstory:", error);
      setCharacterBackstory("Failed to generate character backstory. Please try again.");
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
        !loading &&
        selectedRace &&
        selectedClass &&
        selectedTraits &&
        motivationState.generatedMotivation &&
        character &&
        !characterBackstory // Only generate if we don't already have a backstory
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
    loading,
    selectedRace,
    selectedClass,
    selectedTraits,
    motivationState.generatedMotivation,
    character,
    characterBackstory,
    generateBackstory
  ]);

  return {
    characterBackstory,
    isGeneratingBackstory,
    generateBackstory,
    loading: raceLoading || classLoading || traitsLoading || motivationLoading || loading
  };
}; 