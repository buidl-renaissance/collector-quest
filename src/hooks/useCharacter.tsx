import { useState, useEffect } from 'react';
import { useRace } from './useRace';
import { useCharacterClass } from './useCharacterClass';
import { Race } from '@/data/races';
import { CharacterClass } from '@/data/classes';

export interface Character {
  name: string;
  race?: Race;
  class?: CharacterClass;
  traits?: {
    personality: string[];
    ideals: string[];
    bonds: string[];
    flaws: string[];
    memory?: string;
    possession?: string;
    fear?: string[];
  };
  motivation?: string;
  bio?: string;
  sex?: string;
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
        const appearance = localStorage.getItem('characterAppearance') || '';
        const bio = localStorage.getItem('characterBio') || '';
        
        // Get character traits from both sources
        const personality = JSON.parse(localStorage.getItem('characterPersonality') || '[]');
        const fear = JSON.parse(localStorage.getItem('characterFear') || '[]');
        const memory = localStorage.getItem('characterMemory') || '';
        const possession = localStorage.getItem('characterPossession') || '';

        // Get old traits structure
        const oldTraits = JSON.parse(localStorage.getItem('selectedTraits') || '{}');
        const ideals = oldTraits.ideals || [];
        const bonds = oldTraits.bonds || [];
        const flaws = oldTraits.flaws || [];
        const hauntingMemory = oldTraits.hauntingMemory || '';
        const treasuredPossession = oldTraits.treasuredPossession || '';

        // Get motivation data from the correct localStorage keys
        const selectedActions = JSON.parse(localStorage.getItem('motivationalFusion_selectedActions') || '[]');
        const selectedForces = JSON.parse(localStorage.getItem('motivationalFusion_selectedForces') || '[]');
        const generatedMotivation = localStorage.getItem('motivationalFusion_generatedMotive') || '';

        // Only set character if we have the minimum required data
        if (selectedRace && selectedClass) {
          setCharacter({
            race: selectedRace,
            class: selectedClass,
            name,
            level: 1,
            background,
            motivation: generatedMotivation,
            appearance,
            bio,
            traits: {
              personality: personality.length > 0 ? personality : ideals,
              fear: fear.length > 0 ? fear : flaws,
              memory: memory || hauntingMemory || bonds[0] || '',
              possession: possession || treasuredPossession || ''
            }
          });
        }
      } catch (error) {
        console.error('Error loading character data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCharacterData();
  }, [selectedRace, selectedClass]);

  const updateCharacter = (updates: Partial<Character>) => {
    if (!character) return;

    // Update local storage with new values
    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'traits' && value) {
        // Handle nested traits object
        Object.entries(value).forEach(([traitKey, traitValue]) => {
          localStorage.setItem(`character${traitKey.charAt(0).toUpperCase() + traitKey.slice(1)}`, 
            typeof traitValue === 'string' ? traitValue : JSON.stringify(traitValue));
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
