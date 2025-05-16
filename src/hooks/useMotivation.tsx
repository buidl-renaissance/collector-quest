import { useState, useEffect } from "react";
import {
  getCurrentCharacterId,
  getCharacterKey,
  setCharacterKey,
} from "@/utils/storage";
import { useCharacter } from "./useCharacter";

export function useMotivation() {
  const { character, updateCharacter } = useCharacter();
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
        setActions(character?.traits?.actions || []);
        setForces(character?.traits?.forces || []);
        setArchetype(character?.traits?.archetype || null);
        setMotivation(character?.motivation || null);
      } catch (error) {
        console.error("Error loading motivation:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMotivation();
  }, [character]);

  const addSelectedAction = (action: string) => {
    if (actions.includes(action)) {
      setActions(actions.filter((a) => a !== action));
      updateCharacter({
        ...character,
        traits: {
          ...character?.traits,
          actions: actions.filter((a) => a !== action),
        },
      });
    } else {
      const newActions = [...actions, action];
      if (newActions.length > 2) {
        setActions(newActions.slice(1, 3));
        updateCharacter({
          ...character,
          traits: {
            ...character?.traits,
            actions: newActions.slice(1, 3),
          },
        });
      } else {
        setActions(newActions);
        updateCharacter({
          ...character,
          traits: {
            ...character?.traits,
            actions: newActions,
          },
        });
      }
    }
  };

  const addSelectedForce = (force: string) => {
    if (forces.includes(force)) {
      setForces(forces.filter((f) => f !== force));
      updateCharacter({
        ...character,
        traits: {
          ...character?.traits,
          forces: forces.filter((f) => f !== force),
        },
      });
    } else {
      const newForces = [...forces, force];
      if (newForces.length > 2) {
        setForces(newForces.slice(1, 3));
        updateCharacter({
          ...character,
          traits: {
            ...character?.traits,
            forces: newForces.slice(1, 3),
          },
        });
      } else {
        setForces(newForces);
        updateCharacter({
          ...character,
          traits: {
            ...character?.traits,
            forces: newForces,
          },
        });
      }
    }
  };

  const setSelectedActions = (actions: string[]) => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setActions(actions);
    const traits = character?.traits;
    if (!traits) return;
    traits.actions = actions;
    updateCharacter({
      ...character,
      traits: traits,
    });
  };

  const setSelectedForces = (forces: string[]) => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setForces(forces);
    const traits = character?.traits;
    if (!traits) return;
    traits.forces = forces;
    updateCharacter({
      ...character,
      traits: traits,
    });
  };

  const setSelectedArchetype = (archetype: string | null) => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setArchetype(archetype);
    const traits = character?.traits;
    if (!traits) return;
    traits.archetype = archetype ?? undefined;
    updateCharacter({
      ...character,
      traits: traits,
    });
  };

  const setGeneratedMotivation = (motivation: string) => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setMotivation(motivation);
    if (!motivation) return;
    updateCharacter({
      ...character,
      motivation: motivation,
    });
  };

  const clearMotivation = () => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setActions([]);
    setForces([]);
    setArchetype(null);
    setMotivation(null);

    setCharacterKey(characterId, "motivationalFusion_selectedActions", []);
    setCharacterKey(characterId, "motivationalFusion_selectedForces", []);
    setCharacterKey(characterId, "motivationalFusion_selectedArchetype", null);
    setCharacterKey(characterId, "motivationalFusion_generatedMotive", null);
  };

  // Generate motive
  const generateMotivation = async () => {
    if (actions.length === 0 || forces.length === 0) return;

    setIsGenerating(true);

    try {
      const response = await fetch("/api/character/generate-motivation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(character),
      });

      if (!response.ok) {
        throw new Error("Failed to generate motivation");
      }

      const data = await response.json();
      setGeneratedMotivation(data.motivation);
    } catch (error) {
      console.error("Error generating motivation:", error);
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
    clearMotivation,
    addSelectedAction,
    addSelectedForce,
  };
}

export default useMotivation;
