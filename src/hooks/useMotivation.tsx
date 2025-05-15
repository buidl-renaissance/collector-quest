import { useState, useEffect } from 'react';
import { getCurrentCharacterId, getNamespacedItem, getNamespacedJson, setNamespacedJson } from '@/utils/storage';
import { useCharacter } from './useCharacter';

export function useMotivation() {
  const { character } = useCharacter();
  const [motivation, setMotivation] = useState<string | null>(null);
  const [actions, setActions] = useState<string[]>([]);
  const [forces, setForces] = useState<string[]>([]);
  const [archetype, setArchetype] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadMotivation = () => {
      try {
        const characterId = getCurrentCharacterId();
        if (!characterId) {
          setLoading(false);
          return;
        }

        // Get motivation data from namespaced storage
        const actions = getNamespacedJson(characterId, 'motivationalFusion_selectedActions') || [];
        const forces = getNamespacedJson(characterId, 'motivationalFusion_selectedForces') || [];
        const archetype = getNamespacedJson(characterId, 'motivationalFusion_selectedArchetype');
        const motivation = getNamespacedItem(characterId, 'motivationalFusion_generatedMotive');

        setActions(actions);
        setForces(forces);
        setArchetype(archetype);
        setMotivation(motivation);

      } catch (error) {
        console.error('Error loading motivation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMotivation();
  }, []);

  const setSelectedActions = (actions: string[]) => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setActions(actions);
    setNamespacedJson(characterId, 'motivationalFusion_selectedActions', actions);
  };

  const setSelectedForces = (forces: string[]) => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setForces(forces);
    setNamespacedJson(characterId, 'motivationalFusion_selectedForces', forces);
  };

  const setSelectedArchetype = (archetype: string | null) => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setArchetype(archetype);
    setNamespacedJson(characterId, 'motivationalFusion_selectedArchetype', archetype);
  };

  const setGeneratedMotivation = (motivation: string) => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setMotivation(motivation);
    setNamespacedJson(characterId, 'motivationalFusion_generatedMotive', motivation);
  };

  const clearMotivation = () => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setActions([]);
    setForces([]);
    setArchetype(null);
    setMotivation(null);

    setNamespacedJson(characterId, 'motivationalFusion_selectedActions', []);
    setNamespacedJson(characterId, 'motivationalFusion_selectedForces', []);
    setNamespacedJson(characterId, 'motivationalFusion_selectedArchetype', null);
    setNamespacedJson(characterId, 'motivationalFusion_generatedMotive', null);
  };

  // Generate motive
  const generateMotivation = async () => {
    if (actions.length === 0 || forces.length === 0) return;

    setIsGenerating(true);

    try {
      const response = await fetch('/api/character/generate-motivation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(character),
      });

      if (!response.ok) {
        throw new Error('Failed to generate motivation');
      }

      const data = await response.json();
      setGeneratedMotivation(data.motivation);
    } catch (error) {
      console.error('Error generating motivation:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    actions,
    forces,
    archetype,
    motivation,
    loading,
    generateMotivation,
    setSelectedActions,
    setSelectedForces,
    setSelectedArchetype,
    setGeneratedMotivation,
    clearMotivation
  };
}

export default useMotivation; 