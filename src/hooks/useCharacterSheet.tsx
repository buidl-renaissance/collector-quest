import { useState, useEffect } from 'react';
import { CharacterSheet, useCurrentCharacter } from './useCurrentCharacter';
import { getCurrentCharacterId, getCharacterKey, setCharacterKey } from '@/utils/storage';
import { useGeneratedResult } from './useGeneratedResult';

export function useCharacterSheet() {
  const { character } = useCurrentCharacter();
  const [characterSheet, setCharacterSheet] = useState<CharacterSheet | null>(null);
  const [currentStep, setCurrentStep] = useState<string>("calculate-abilities");

  const {
    startGeneration,
    isGenerating: loading,
    error,
    status,
    result: characterSheetResult,
    event
  } = useGeneratedResult<CharacterSheet>();

  useEffect(() => {
    if (character?.id && !character?.sheet && !loading && !event) {
      generateCharacterSheet();
    } else if (character?.id && character.sheet) {
      setCharacterSheet(character.sheet);
    }
  }, [character, loading, event]);

  const generateCharacterSheet = async () => {
    await startGeneration(async () => {
      const response = await fetch('/api/character/sheet/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ characterId: character?.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate character sheet');
      }

      const data = await response.json();
      return { event: data.event };
    });
  };

  // Update state based on generation status
  useEffect(() => {
    if (status?.step) {
      setCurrentStep(status.step);
    }

    if (status?.result?.sheet) {
      setCharacterSheet(status.result.sheet);
      if (character?.id) {
        setCharacterKey(character.id, 'sheet', status.result.sheet);
      }
    }
  }, [status, character]);

  useEffect(() => {
    if (characterSheetResult) {
      setCharacterSheet(characterSheetResult);
      if (character?.id) {  
        setCharacterKey(character.id, 'sheet', characterSheetResult);
      }
    }
  }, [characterSheetResult]);

  // Load character sheet from namespaced storage on mount
  useEffect(() => {
    const loadCharacterSheet = () => {
      try {
        const characterId = getCurrentCharacterId();
        if (!characterId) return;

        const savedSheet = getCharacterKey(characterId, 'sheet');
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
    currentStep,
  };
}