import { useState, useEffect } from 'react';
import { useRace } from './useRace';
import { useCharacterClass } from './useCharacterClass';
import { Race } from '@/data/races';
import { CharacterClass } from '@/data/classes';

export interface Character {
  race: Race | null;
  class: CharacterClass | null;
  name: string;
  background: string;
  motivation: string;
  appearance: string;
  traits: {
    personality: string[];
    fear: string[];
    memory: string;
    possession: string;
  };
}

export const useCharacter = () => {
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCharacterData = () => {
      try {
        // Get basic character info
        const name = localStorage.getItem('characterName') || '';
        const background = localStorage.getItem('characterBackground') || '';
        const motivation = localStorage.getItem('characterMotivation') || '';
        const appearance = localStorage.getItem('characterAppearance') || '';
        
        // Get character traits
        const characterTraits = JSON.parse(localStorage.getItem('characterTraits') || '{}');
        const personality = characterTraits.personality || [];
        const fear = characterTraits.fear || [];
        const memory = characterTraits.hauntingMemory || '';
        const possession = characterTraits.treasuredPossession || '';

        // Only set character if we have the minimum required data
        if (selectedRace && selectedClass) {
          setCharacter({
            race: selectedRace,
            class: selectedClass,
            name,
            background,
            motivation,
            appearance,
            traits: {
              personality,
              fear,
              memory,
              possession
            }
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading character data:', error);
        setLoading(false);
      }
    };

    if (!raceLoading && !classLoading) {
      loadCharacterData();
    }
  }, [selectedRace, selectedClass, raceLoading, classLoading]);

  const updateCharacter = (updates: Partial<Character>) => {
    if (!character) return;

    // Update local storage with new values
    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'traits' && value) {
        // Handle nested traits object
        Object.entries(value as Record<string, string>).forEach(([traitKey, traitValue]) => {
          localStorage.setItem(`character${traitKey.charAt(0).toUpperCase() + traitKey.slice(1)}`, traitValue);
        });
      } else if (typeof value === 'string') {
        localStorage.setItem(`character${key.charAt(0).toUpperCase() + key.slice(1)}`, value);
      }
    });

    // Update state
    setCharacter({ ...character, ...updates });
  };

  return {
    character,
    loading: loading || raceLoading || classLoading,
    updateCharacter
  };
};
