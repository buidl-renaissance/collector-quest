import { useState, useEffect } from 'react';
import { getCurrentCharacterId, getNamespacedJson, setNamespacedJson } from '@/utils/storage';

interface MotivationState {
  selectedActions: string[];
  selectedForces: { id: string; intensity: number }[];
  selectedArchetype: string | null;
  generatedMotivation: string | null;
}

export function useMotivation() {
  const [motivationState, setMotivationState] = useState<MotivationState>({
    selectedActions: [],
    selectedForces: [],
    selectedArchetype: null,
    generatedMotivation: null
  });
  const [loading, setLoading] = useState(true);

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
        const motivation = getNamespacedJson(characterId, 'motivationalFusion_generatedMotive');

        setMotivationState({
          selectedActions: actions,
          selectedForces: forces,
          selectedArchetype: archetype,
          generatedMotivation: motivation
        });
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

    setMotivationState(prev => ({ ...prev, selectedActions: actions }));
    setNamespacedJson(characterId, 'motivationalFusion_selectedActions', actions);
  };

  const setSelectedForces = (forces: { id: string; intensity: number }[]) => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setMotivationState(prev => ({ ...prev, selectedForces: forces }));
    setNamespacedJson(characterId, 'motivationalFusion_selectedForces', forces);
  };

  const setSelectedArchetype = (archetype: string | null) => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setMotivationState(prev => ({ ...prev, selectedArchetype: archetype }));
    setNamespacedJson(characterId, 'motivationalFusion_selectedArchetype', archetype);
  };

  const setGeneratedMotivation = (motivation: string) => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setMotivationState(prev => ({ ...prev, generatedMotivation: motivation }));
    setNamespacedJson(characterId, 'motivationalFusion_generatedMotive', motivation);
  };

  const clearMotivation = () => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setMotivationState({
      selectedActions: [],
      selectedForces: [],
      selectedArchetype: null,
      generatedMotivation: null
    });
    setNamespacedJson(characterId, 'motivationalFusion_selectedActions', []);
    setNamespacedJson(characterId, 'motivationalFusion_selectedForces', []);
    setNamespacedJson(characterId, 'motivationalFusion_selectedArchetype', null);
    setNamespacedJson(characterId, 'motivationalFusion_generatedMotive', null);
  };

  return {
    motivationState,
    loading,
    setSelectedActions,
    setSelectedForces,
    setSelectedArchetype,
    setGeneratedMotivation,
    clearMotivation
  };
}

export default useMotivation; 