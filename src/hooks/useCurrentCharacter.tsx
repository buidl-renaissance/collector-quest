import { useState, useEffect } from 'react';
import { Character, CharacterStatus, Traits } from '@/data/character';
import { getCharacterKey, getCurrentCharacterId, setCharacterKey } from '@/utils/storage';
import { useCache } from '@/context/CacheContext';
import { useCharacter, updateCharacterCache } from '@/cache/character';
export type { Character, CharacterSheet, CharacterStatus, Traits } from '@/data/character';

export const useCurrentCharacter = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [characterId, setCharacterId] = useState<string | null>(null);
  const cache = useCache();
  const { getCharacter } = useCharacter(characterId);


  useEffect(() => {
    const storedCharacterId = getCurrentCharacterId();
    setCharacterId(storedCharacterId);
  }, []); 

  useEffect(() => {
    const loadCharacter = async () => {
      try {

        if (!characterId) {
          setLoading(false);
          return;
        }

        const characterData = await getCharacter();
        if (characterData) {
          setCharacter(characterData);
        }
      } catch (err) {
        console.error('Error loading character:', err);
        setError('Failed to load character');
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [cache, getCharacter]);

  const updateCharacter = (updates: Partial<Character>) => {
    if (!character) return;
    const updatedCharacter = { ...character, ...updates };
    setCharacter(updatedCharacter);
    updateCharacterCache(updatedCharacter, cache);

    const characterId = character.id;
    if (!characterId) return;

    // Update local storage with new values using namespaced keys
    Object.entries(updates).forEach(([key, value]) => {
      if (key === "traits" && value) {
        // Handle nested traits object
        Object.entries(value).forEach(([traitKey, traitValue]) => {
          const traits = getCharacterKey(characterId, "traits") ?? {};
          traits[traitKey] = traitValue;
          setCharacterKey(characterId, "traits", traits);
        });
      } else if (typeof value === "string") {
        setCharacterKey(characterId, key, value);
      } else if (key === "race" && value) {
        setCharacterKey(characterId, "race", value);
      } else if (key === "class" && value) {
        setCharacterKey(characterId, "class", value);
      } else if (key === "equipment" && value) {
        setCharacterKey(characterId, "equipment", value);
      }
    });

  };

  const updateCharacterTrait = (trait: keyof Traits, value: string | string[]) => {
    if (!character) return;
    const traits = character.traits ?? {};
    traits[trait] = value as any; // Type assertion to fix type error
    const updatedCharacter = { ...character, traits };
    setCharacter(updatedCharacter);
    updateCharacterCache(updatedCharacter, cache);
  };

  const saveCharacter = async () => {
    if (!character) return;
    setError(null);

    if (!character.status) {
      character.status = CharacterStatus.NEW;
    }

    if (
      character.status !== CharacterStatus.NEW &&
      character.status !== CharacterStatus.CREATING
    ) {
      setError("Character is not in a valid state to be saved");
      return;
    }

    character.status = CharacterStatus.CREATING;

    try {
      const response = await fetch("/api/characters", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(character),
      });

      if (!response.ok) {
        throw new Error("Failed to save character");
      }

      const savedCharacter = await response.json();
      setCharacter(savedCharacter);
      return savedCharacter;
    } catch (err) {
      console.error("Error saving character:", err);
      setError("Failed to save character");
      throw err;
    }
  };

  return {
    character,
    loading,
    error,
    characterId,
    saveCharacter,
    updateCharacter,
    updateCharacterTrait,
  };
};
