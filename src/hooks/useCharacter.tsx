import { useState, useEffect } from "react";
import { Race } from "@/data/races";
import { CharacterClass } from "@/data/classes";
import {
  getCurrentCharacterId,
  getCharacterKey,
  setCurrentCharacterId,
  setCharacterKey,
} from "@/utils/storage";

const STORAGE_KEYS = {
  CURRENT_CHARACTER_ID: "currentCharacterId",
  CHARACTER_IDS: "characterIds",
};

export enum CharacterStatus {
  NEW = "new",
  ALIVE = "alive",
  DEAD = "dead",
  CREATING = "creating",
  COMPLETED = "completed",
  DELETED = "deleted",
}

export interface Character {
  id?: string;
  name: string;
  status?: string;
  race?: Race;
  class?: CharacterClass;
  level?: number;
  traits?: {
    personality: string[];
    ideals: string[];
    bonds: string[];
    flaws: string[];
    memory?: string;
    possession?: string;
    fear?: string[];
    hauntingMemory?: string;
    treasuredPossession?: string;
    actions?: string[];
    forces?: string[];
    archetype?: string;
  };
  motivation?: string;
  bio?: string;
  backstory?: string;
  sex?: string;
  creature?: string;
  image_url?: string;
  sheet?: string;
}

export const useCharacter = () => {
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

        // Get basic character info with namespaced keys
        const name = getCharacterKey(storedCharacterId, "name") || "";
        const backstory = getCharacterKey(storedCharacterId, "backstory") || "";
        const appearance =
          getCharacterKey(storedCharacterId, "appearance") || "";
        const bio = getCharacterKey(storedCharacterId, "bio") || "";

        // Get character Race / Class
        const race = getCharacterKey(storedCharacterId, "race") || "";
        const characterClass =
          getCharacterKey(storedCharacterId, "class") || "";

        // Get character traits from both sources with namespaced keys
        const personality =
          getCharacterKey(storedCharacterId, "personality") || [];
        const fear = getCharacterKey(storedCharacterId, "fear") || [];
        const memory = getCharacterKey(storedCharacterId, "memory") || "";
        const possession =
          getCharacterKey(storedCharacterId, "possession") || "";
        const status =
          getCharacterKey(storedCharacterId, "status") || CharacterStatus.NEW;
        const level = getCharacterKey(storedCharacterId, "level") || 1;
        const motivation =
          getCharacterKey(storedCharacterId, "motivation") || "";
        const sex = getCharacterKey(storedCharacterId, "sex") || "";
        const image_url = getCharacterKey(storedCharacterId, "image_url") || "";

        // Get old traits structure with namespaced keys
        const oldTraits =
          getCharacterKey(storedCharacterId, "selectedTraits") || {};
        const ideals = oldTraits.ideals || [];
        const bonds = oldTraits.bonds || [];
        const flaws = oldTraits.flaws || [];
        const hauntingMemory = oldTraits.hauntingMemory || "";
        const treasuredPossession = oldTraits.treasuredPossession || "";

        // Get motivation data with namespaced keys
        const actions =
          getCharacterKey(
            storedCharacterId,
            "motivationalFusion_selectedActions"
          ) || [];
        const forces =
          getCharacterKey(
            storedCharacterId,
            "motivationalFusion_selectedForces"
          ) || [];
        const generatedMotivation =
          getCharacterKey(
            storedCharacterId,
            "motivationalFusion_generatedMotive"
          ) || "";

        // Only set character if we have the minimum required data
        setCharacter({
          id: storedCharacterId,
          race: race || undefined,
          class: characterClass || undefined,
          status: status,
          level: parseInt(level as string),
          sex: sex,
          image_url: image_url,
          name,
          backstory,
          motivation: generatedMotivation,
          bio,
          traits: {
            personality: personality.length > 0 ? personality : ideals,
            ideals: ideals,
            bonds: bonds,
            flaws: fear.length > 0 ? fear : flaws,
            memory: memory || hauntingMemory || bonds[0] || "",
            possession: possession || treasuredPossession || "",
            actions: actions,
            forces: forces,
            hauntingMemory: hauntingMemory || memory || bonds[0] || "",
            treasuredPossession: treasuredPossession || possession || "",
          },
        });
      } catch (error) {
        console.error("Error loading character data:", error);
        setError("Failed to load character data");
      } finally {
        setLoading(false);
      }
    };

    loadCharacterData();
  }, []);

  const updateCharacter = (updates: Partial<Character>) => {
    if (!character || !character.id) return;

    const characterId = character.id;
    if (!characterId) return;

    // Update local storage with new values using namespaced keys
    Object.entries(updates).forEach(([key, value]) => {
      if (key === "traits" && value) {
        // Handle nested traits object
        Object.entries(value).forEach(([traitKey, traitValue]) => {
          const traits = getCharacterKey(characterId, "traits");
          traits[traitKey] = traitValue;
          setCharacterKey(characterId, "traits", traits);
        });
      } else if (typeof value === "string") {
        setCharacterKey(characterId, key, value);
      }
    });

    // Update state
    setCharacter({ ...character, ...updates });
  };

  const saveCharacter = async () => {
    if (!character) return;

    setSaving(true);
    setError(null);

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

  const createCharacter = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/character/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create character");
      }

      const { characterId } = await response.json();

      // Initialize character with empty data
      const newCharacter: Character = {
        id: characterId,
        name: "",
        status: CharacterStatus.NEW,
        race: undefined,
        class: undefined,
        traits: {
          personality: [],
          ideals: [],
          bonds: [],
          flaws: [],
        },
      };

      // Save initial character data
      setCharacterKey(characterId, "name", "");
      setCharacterKey(characterId, "traits", newCharacter.traits);

      setCharacter(newCharacter);
      setCurrentCharacterId(characterId);
      return newCharacter;
    } catch (err) {
      console.error("Error creating character:", err);
      setError("Failed to create character");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    character,
    loading,
    saving,
    error,
    characterId,
    createCharacter,
    updateCharacter,
    saveCharacter,
    getCharacter,
    getStoredCharacterIds,
  };
};
