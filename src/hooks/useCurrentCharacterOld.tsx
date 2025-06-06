import { useState, useEffect } from "react";
import {
  Character,
  CharacterStatus,
  Traits,
  Speed,
  CharacterSheet,
} from "@/data/character";
export type { Character, CharacterStatus, Traits, Speed, CharacterSheet };
import {
  getCurrentCharacterId,
  getCharacterKey,
  setCurrentCharacterId,
  setCharacterKey,
  getCharacter as getCharacterFromStorage,
  setCharacter,
} from "@/utils/storage";

const STORAGE_KEYS = {
  CURRENT_CHARACTER_ID: "currentCharacterId",
  CHARACTER_IDS: "characterIds",
};

export const useCurrentCharacter = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [characterId, setCharacterId] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacterData = () => {
      try {
        // Get current character ID
        const storedCharacterId = getCurrentCharacterId();
        setCharacterId(storedCharacterId);

        if (!storedCharacterId) {
          setLoading(false);
          return;
        }

        const characterData = getCharacterFromStorage(storedCharacterId);

        if (!characterData) {
          setCharacter({
            id: storedCharacterId,
            name: "",
            status: CharacterStatus.NEW,
          });
          updateCharacter({
            id: storedCharacterId,
            status: CharacterStatus.NEW,
            traits: {
              background: "",
              personality: [],
              alignment: "",
              ideals: [],
              bonds: [],
              flaws: [],
              memory: "",
              possession: "",
              fear: [],
              hauntingMemory: "",
              treasuredPossession: "",
              actions: [],
              forces: [],
              archetype: "",
            },
          });
        } else {
          characterData.id = storedCharacterId;
          // Only set character if we have the minimum required data
          setCharacter(characterData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading character data:", error);
        setError("Failed to load character data");
      } finally {
        setLoading(false);
      }
    };

    loadCharacterData();
  }, []);

  const updateCharacterTrait = (trait: keyof Traits, value: string) => {
    if (!character) return;
    if (typeof value === "string") {
      const updatedData = {
        ...character,
        traits: {
          ...(character.traits ?? {}),
          [trait]: value,
        },
      };
      console.log(updatedData);
      updateCharacter(updatedData);
    } else if (Array.isArray(value)) {
      const currentValues = (character.traits?.[trait] as string[]) ?? [];
      let updatedData;
      if (currentValues.includes(value)) {
        updatedData = {
          ...character,
          traits: {
            ...(character.traits ?? {}),
            [trait]: currentValues.filter((item) => item !== value),
          },
        };
      } else {
        updatedData = {
          ...character,
          traits: {
            ...(character.traits ?? {}),
            [trait]: [...currentValues, value],
          },
        };
      }
      console.log(updatedData);
      updateCharacter(updatedData);
    }
  };

  const updateCharacter = (updates: Partial<Character>) => {
    if (!character || !character.id) return;

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

    // Update state
    setCharacter({ ...character, ...updates });
  };

  const saveCharacter = async () => {
    if (!character) return;

    setSaving(true);
    setError(null);

    if (!character.status) {
      character.status = CharacterStatus.NEW;
    }

    if (
      character.status !== CharacterStatus.NEW &&
      character.status !== CharacterStatus.CREATING
    ) {
      setError("Character is not in a valid state to be saved");
      setSaving(false);
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

      // Update character IDs list
      const characterIds = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.CHARACTER_IDS) || "[]"
      );
      if (!characterIds.includes(savedCharacter.id)) {
        characterIds.push(savedCharacter.id);
        localStorage.setItem(
          STORAGE_KEYS.CHARACTER_IDS,
          JSON.stringify(characterIds)
        );
      }

      // Set as current character
      setCurrentCharacterId(savedCharacter.id);
      setCharacterId(savedCharacter.id);

      setCharacter(savedCharacter);
      return savedCharacter;
    } catch (err) {
      console.error("Error saving character:", err);
      setError("Failed to save character");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const fetchCharacter = async () => {
    setLoading(true);
    setError(null);

    const id = getCurrentCharacterId();

    if (!id) {
      setError("No character ID found");
      setLoading(false);
      return;
    }

    const response = await fetch(`/api/characters/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch character");
    }

    const fetchedCharacter = await response.json();
    setCharacter(fetchedCharacter);
    updateCharacter(fetchedCharacter);
    return fetchedCharacter;
  };

  const getCharacter = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/characters/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch character");
      }

      const fetchedCharacter = await response.json();

      // Set as current character
      setCurrentCharacterId(id);
      setCharacterId(id);

      setCharacter(fetchedCharacter);
      return fetchedCharacter;
    } catch (err) {
      console.error("Error fetching character:", err);
      setError("Failed to fetch character");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStoredCharacterIds = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHARACTER_IDS) || "[]");
  };

  return {
    character,
    loading,
    saving,
    error,
    characterId,
    updateCharacter,
    saveCharacter,
    getCharacter,
    updateCharacterTrait,
    getStoredCharacterIds,
    fetchCharacter,
  };
};
