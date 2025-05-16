import { useState, useEffect } from 'react';
import { getCurrentCharacterId, getCharacterKey, setCharacterKey } from '@/utils/storage';
import { useCharacter } from './useCharacter';
interface Traits {
  personality: string[];
  ideals: string[];
  bonds: string[];
  flaws: string[];
  memory?: string;
  possession?: string;
  fear?: string[];
  hauntingMemory?: string;
  treasuredPossession?: string;
}

export function useTraits() {
  const { character, updateCharacter } = useCharacter();
  const [selectedTraits, setSelectedTraits] = useState<Traits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTraits = () => {
      try {
        const characterId = getCurrentCharacterId();
        if (!characterId) {
          setLoading(false);
          return;
        }

        // Get traits from namespaced storage
        const traits = character?.traits;
        if (traits) {
          setSelectedTraits(traits);
        }
      } catch (error) {
        console.error('Error loading traits:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTraits();
  }, []);

  const updateTraits = (traits: Partial<Traits>) => {
    const characterId = getCurrentCharacterId();
    if (!characterId || !selectedTraits) return;

    const updatedTraits: Traits = {
      personality: traits.personality || selectedTraits.personality,
      ideals: traits.ideals || selectedTraits.ideals,
      bonds: traits.bonds || selectedTraits.bonds,
      flaws: traits.flaws || selectedTraits.flaws,
      memory: traits.memory || selectedTraits.memory,
      possession: traits.possession || selectedTraits.possession,
      fear: traits.fear || selectedTraits.fear,
      hauntingMemory: traits.hauntingMemory || selectedTraits.hauntingMemory,
      treasuredPossession: traits.treasuredPossession || selectedTraits.treasuredPossession
    };

    setSelectedTraits(updatedTraits);
    updateCharacter({
      ...character,
      traits: updatedTraits
    });
  };

  const clearTraits = () => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setSelectedTraits(null);
    setCharacterKey(characterId, 'traits', null);
  };

  return {
    selectedTraits,
    loading,
    updateTraits,
    clearTraits
  };
}

export default useTraits; 