import { useState, useEffect } from 'react';
import { useRace } from './useRace';
import { useCharacterClass } from './useCharacterClass';
import { Race } from '@/data/races';
import { CharacterClass } from '@/data/classes';
import { getCurrentCharacterId, setCurrentCharacterId, setNamespacedJson } from '@/utils/storage';

const STORAGE_KEYS = {
  CURRENT_CHARACTER_ID: 'currentCharacterId',
  CHARACTER_IDS: 'characterIds',
};

const getNamespacedKey = (characterId: string, key: string) => `character_${characterId}_${key}`;

export enum CharacterStatus {
  NEW = 'new',
  ALIVE = 'alive',
  DEAD = 'dead',
  CREATING = 'creating',
  COMPLETED = 'completed',
  DELETED = 'deleted',
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
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
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
        const name = localStorage.getItem(getNamespacedKey(storedCharacterId, 'name')) || '';
        const backstory = localStorage.getItem(getNamespacedKey(storedCharacterId, 'backstory')) || '';
        const appearance = localStorage.getItem(getNamespacedKey(storedCharacterId, 'appearance')) || '';
        const bio = localStorage.getItem(getNamespacedKey(storedCharacterId, 'bio')) || '';
        
        // Get character traits from both sources with namespaced keys
        const personality = JSON.parse(localStorage.getItem(getNamespacedKey(storedCharacterId, 'personality')) || '[]');
        const fear = JSON.parse(localStorage.getItem(getNamespacedKey(storedCharacterId, 'fear')) || '[]');
        const memory = localStorage.getItem(getNamespacedKey(storedCharacterId, 'memory')) || '';
        const possession = localStorage.getItem(getNamespacedKey(storedCharacterId, 'possession')) || '';
        const status = localStorage.getItem(getNamespacedKey(storedCharacterId, 'status')) || CharacterStatus.NEW;
        const level = localStorage.getItem(getNamespacedKey(storedCharacterId, 'level')) || 1;
        const motivation = localStorage.getItem(getNamespacedKey(storedCharacterId, 'motivation')) || '';
        const sex = localStorage.getItem(getNamespacedKey(storedCharacterId, 'sex')) || '';
        const image_url = localStorage.getItem(getNamespacedKey(storedCharacterId, 'image_url')) || '';

        // Get old traits structure with namespaced keys
        const oldTraits = JSON.parse(localStorage.getItem(getNamespacedKey(storedCharacterId, 'selectedTraits')) || '{}');
        const ideals = oldTraits.ideals || [];
        const bonds = oldTraits.bonds || [];
        const flaws = oldTraits.flaws || [];
        const hauntingMemory = oldTraits.hauntingMemory || '';
        const treasuredPossession = oldTraits.treasuredPossession || '';

        // Get motivation data with namespaced keys
        const selectedActions = JSON.parse(localStorage.getItem(getNamespacedKey(storedCharacterId, 'motivationalFusion_selectedActions')) || '[]');
        const selectedForces = JSON.parse(localStorage.getItem(getNamespacedKey(storedCharacterId, 'motivationalFusion_selectedForces')) || '[]');
        const generatedMotivation = localStorage.getItem(getNamespacedKey(storedCharacterId, 'motivationalFusion_generatedMotive')) || '';

        // Only set character if we have the minimum required data
        setCharacter({
          id: storedCharacterId,
          race: selectedRace || undefined,
          class: selectedClass || undefined,
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
            memory: memory || hauntingMemory || bonds[0] || '',
            possession: possession || treasuredPossession || '',
            hauntingMemory: hauntingMemory || memory || bonds[0] || '',
            treasuredPossession: treasuredPossession || possession || ''
          }
        });
      } catch (error) {
        console.error('Error loading character data:', error);
        setError('Failed to load character data');
      } finally {
        setLoading(false);
      }
    };

    loadCharacterData();
  }, [selectedRace, selectedClass]);

  const updateCharacter = (updates: Partial<Character>) => {
    if (!character || !character.id) return;

    const characterId = character.id;
    if (!characterId) return;

    // Update local storage with new values using namespaced keys
    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'traits' && value) {
        // Handle nested traits object
        Object.entries(value).forEach(([traitKey, traitValue]) => {
          localStorage.setItem(
            getNamespacedKey(characterId, `character${traitKey.charAt(0).toUpperCase() + traitKey.slice(1)}`),
            typeof traitValue === 'string' ? traitValue : JSON.stringify(traitValue)
          );
        });
      } else if (typeof value === 'string') {
        localStorage.setItem(
          getNamespacedKey(characterId, `character${key.charAt(0).toUpperCase() + key.slice(1)}`),
          value
        );
      }
    });

    // Update state
    setCharacter({ ...character, ...updates });
  };

  const saveCharacter = async () => {
    if (!character) return;
    
    setSaving(true);
    setError(null);

    if (character.status !== CharacterStatus.NEW && character.status !== CharacterStatus.CREATING) {
      setError('Character is not in a valid state to be saved');
      setSaving(false);
      return;
    }

    character.status = CharacterStatus.CREATING;
    
    try {
      const response = await fetch('/api/characters', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(character),
      });

      if (!response.ok) {
        throw new Error('Failed to save character');
      }

      const savedCharacter = await response.json();
      
      // Update character IDs list
      const characterIds = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHARACTER_IDS) || '[]');
      if (!characterIds.includes(savedCharacter.id)) {
        characterIds.push(savedCharacter.id);
        localStorage.setItem(STORAGE_KEYS.CHARACTER_IDS, JSON.stringify(characterIds));
      }

      // Set as current character
      setCurrentCharacterId(savedCharacter.id);
      setCharacterId(savedCharacter.id);
      
      setCharacter(savedCharacter);
      return savedCharacter;
    } catch (err) {
      console.error('Error saving character:', err);
      setError('Failed to save character');
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
        throw new Error('Failed to fetch character');
      }

      const fetchedCharacter = await response.json();
      
      // Set as current character
      setCurrentCharacterId(id);
      setCharacterId(id);
      
      setCharacter(fetchedCharacter);
      return fetchedCharacter;
    } catch (err) {
      console.error('Error fetching character:', err);
      setError('Failed to fetch character');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStoredCharacterIds = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHARACTER_IDS) || '[]');
  };

  const createCharacter = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/character/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create character');
      }

      const { characterId } = await response.json();
      
      // Initialize character with empty data
      const newCharacter: Character = {
        id: characterId,
        name: '',
        status: CharacterStatus.NEW,
        race: undefined,
        class: undefined,
        traits: {
          personality: [],
          ideals: [],
          bonds: [],
          flaws: [],
        }
      };

      // Save initial character data
      setNamespacedJson(characterId, 'name', '');
      setNamespacedJson(characterId, 'traits', newCharacter.traits);
      
      setCharacter(newCharacter);
      setCurrentCharacterId(characterId);
      return newCharacter;
    } catch (err) {
      console.error('Error creating character:', err);
      setError('Failed to create character');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    character,
    loading: loading || raceLoading || classLoading,
    saving,
    error,
    characterId,
    createCharacter,
    updateCharacter,
    saveCharacter,
    getCharacter,
    getStoredCharacterIds
  };
};
