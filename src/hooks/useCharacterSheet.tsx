import { useState, useEffect } from 'react';
import { Character } from './useCharacter';

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
    attacks: string[];
    spellcasting: string[];
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
      localStorage.setItem('character_sheet', JSON.stringify(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateDeathSaves = (type: 'successes' | 'failures', value: number) => {
    if (!characterSheet) return;

    setCharacterSheet(prev => {
      if (!prev) return prev;
      const newSheet = { ...prev };
      newSheet.deathSaves[type] = Math.max(0, Math.min(3, value));
      localStorage.setItem('character_sheet', JSON.stringify(newSheet));
      return newSheet;
    });
  };

  const updateSkillProficiency = (skillName: string, proficient: boolean) => {
    if (!characterSheet) return;

    setCharacterSheet(prev => {
      if (!prev) return prev;
      const newSheet = { ...prev };
      const skillIndex = newSheet.skills.findIndex(s => s.name === skillName);
      if (skillIndex !== -1) {
        newSheet.skills[skillIndex].proficient = proficient;
        localStorage.setItem('character_sheet', JSON.stringify(newSheet));
      }
      return newSheet;
    });
  };

  const updateCurrentHitPoints = (value: number) => {
    if (!characterSheet) return;

    setCharacterSheet(prev => {
      if (!prev) return prev;
      const newSheet = { ...prev };
      newSheet.combatStats.currentHitPoints = Math.max(0, value);
      localStorage.setItem('character_sheet', JSON.stringify(newSheet));
      return newSheet;
    });
  };

  // Load character sheet from localStorage on mount
  useEffect(() => {
    const savedSheet = localStorage.getItem('character_sheet');
    if (savedSheet) {
      try {
        setCharacterSheet(JSON.parse(savedSheet));
      } catch (err) {
        console.error('Error loading character sheet from localStorage:', err);
      }
    }
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