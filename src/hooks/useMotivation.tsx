import { useState, useEffect } from 'react';

interface MotivationState {
  selectedActions: string[];
  drivingForces: {
    id: string;
    intensity: number;
  }[];
  generatedMotivation: string | null;
}

export function useMotivation() {
  const [motivationState, setMotivationState] = useState<MotivationState>({
    selectedActions: [],
    drivingForces: [],
    generatedMotivation: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMotivation = () => {
      try {
        const savedMotivation = localStorage.getItem('selectedMotivation');
        if (savedMotivation) {
          setMotivationState(JSON.parse(savedMotivation));
        }
      } catch (error) {
        console.error('Error loading motivation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMotivation();
  }, []);

  const selectAction = (actionId: string) => {
    setMotivationState(prev => {
      const newActions = prev.selectedActions.includes(actionId)
        ? prev.selectedActions.filter(id => id !== actionId)
        : prev.selectedActions.length < 2
          ? [...prev.selectedActions, actionId]
          : prev.selectedActions;
      
      const newState = {
        ...prev,
        selectedActions: newActions
      };
      localStorage.setItem('selectedMotivation', JSON.stringify(newState));
      return newState;
    });
  };

  const updateDrivingForces = (forces: { id: string; intensity: number }[]) => {
    setMotivationState(prev => {
      const newState = {
        ...prev,
        drivingForces: forces
      };
      localStorage.setItem('selectedMotivation', JSON.stringify(newState));
      return newState;
    });
  };

  const setGeneratedMotivation = (motivation: string) => {
    setMotivationState(prev => {
      const newState = {
        ...prev,
        generatedMotivation: motivation
      };
      localStorage.setItem('selectedMotivation', JSON.stringify(newState));
      return newState;
    });
  };

  const clearMotivation = () => {
    setMotivationState({
      selectedActions: [],
      drivingForces: [],
      generatedMotivation: null
    });
    localStorage.removeItem('selectedMotivation');
  };

  return {
    motivationState,
    loading,
    selectAction,
    updateDrivingForces,
    setGeneratedMotivation,
    clearMotivation
  };
}

export default useMotivation; 