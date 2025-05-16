import { useState, useEffect } from 'react';
import { Character } from './useCharacter';
import { Attack } from '@/data/attacks';
import { getCurrentCharacterId, getCharacterKey, setCharacterKey } from '@/utils/storage';

export interface CharacterSheet {
  abilities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  combatStats: {
    armorClass: number;
    initiative: number;
    currentHitPoints: number;
    hitDice: string;
  };
  skills: {
    name: string;
    proficient: boolean;
  }[];
  deathSaves: {
    successes: number;
    failures: number;
  };
  combat: {
    attacks: Attack[];
    hitDice: {
      type: string;
      bonus: number;
      count: number;
      current: number;
    };
  };
  effects: {
    ideals: string[];
    bonds: string[];
    flaws: string[];
    personality_traits: string[];
  };
  equipment: string[];
  features: string[];
  proficiencies: string[];
  languages: string[];
}

export function useCharacterSheet() {
  const [characterSheet, setCharacterSheet] = useState<CharacterSheet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCharacterSheet = async (characterData: Character) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/character/generate-sheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(characterData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate character sheet');
      }

      const data = await response.json();
      setCharacterSheet(data);

      const characterId = getCurrentCharacterId();
      if (characterId) {
        setCharacterKey(characterId, 'character_sheet', data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateDeathSaves = (type: 'successes' | 'failures', value: number) => {
    if (!characterSheet) return;

    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setCharacterSheet(prev => {
      if (!prev) return prev;
      const newSheet = { ...prev };
      newSheet.deathSaves[type] = Math.max(0, Math.min(3, value));
      setCharacterKey(characterId, 'character_sheet', newSheet);
      return newSheet;
    });
  };

  const updateSkillProficiency = (skillName: string, proficient: boolean) => {
    if (!characterSheet) return;

    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setCharacterSheet(prev => {
      if (!prev) return prev;
      const newSheet = { ...prev };
      const skillIndex = newSheet.skills.findIndex(s => s.name === skillName);
      if (skillIndex !== -1) {
        newSheet.skills[skillIndex].proficient = proficient;
        setCharacterKey(characterId, 'character_sheet', newSheet);
      }
      return newSheet;
    });
  };

  const updateCurrentHitPoints = (value: number) => {
    if (!characterSheet) return;

    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setCharacterSheet(prev => {
      if (!prev) return prev;
      const newSheet = { ...prev };
      newSheet.combatStats.currentHitPoints = Math.max(0, value);
      setCharacterKey(characterId, 'character_sheet', newSheet);
      return newSheet;
    });
  };

  // Load character sheet from namespaced storage on mount
  useEffect(() => {
    const loadCharacterSheet = () => {
      try {
        const characterId = getCurrentCharacterId();
        if (!characterId) return;

        const savedSheet = getCharacterKey(characterId, 'character_sheet');
        if (savedSheet) {
          setCharacterSheet(savedSheet);
        }
      } catch (err) {
        console.error('Error loading character sheet from storage:', err);
      }
    };

    loadCharacterSheet();
  }, []);

  return {
    characterSheet,
    loading,
    error,
    generateCharacterSheet,
    updateDeathSaves,
    updateSkillProficiency,
    updateCurrentHitPoints,
  };
} 