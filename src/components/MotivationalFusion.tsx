import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { FaRedo, FaDice, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Types
interface Action {
  id: string;
  label: string;
}

interface DrivingForce {
  id: string;
  label: string;
}

const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #e6e6e6;
  text-align: center;
`;

const StepContainer = styled.div`
  margin-bottom: 2rem;
`;

const StepTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #e6e6e6;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const OptionButton = styled.button<{ selected: boolean }>`
  padding: 0.75rem;
  background-color: ${props => props.selected ? '#4a4ae4' : '#2d2d42'};
  border: 2px solid ${props => props.selected ? '#8080ff' : 'transparent'};
  border-radius: 8px;
  color: #ffffff;
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.selected ? '#5a5af0' : '#3d3d5c'};
    transform: translateY(-2px);
  }
`;

const CustomInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  background-color: #2d2d42;
  border: 1px solid #4a4ae4;
  border-radius: 8px;
  color: #ffffff;
  margin-top: 1rem;
  
  &::placeholder {
    color: #a0a0a0;
  }
`;

const OutputContainer = styled.div`
  background-color: #2d2d42;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
  position: relative;
`;

const OutputTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #e6e6e6;
`;

const OutputText = styled.p`
  font-size: 1.3rem;
  line-height: 1.6;
  color: #ffffff;
  font-style: italic;
  margin-bottom: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background-color: ${props => props.disabled ? '#2d2d42' : '#4a4ae4'};
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-weight: bold;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? 0.7 : 1};
  
  &:hover {
    background-color: ${props => props.disabled ? '#2d2d42' : '#5a5af0'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }
`;

const AdvancedModeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: transparent;
  border: 1px solid #4a4ae4;
  border-radius: 8px;
  color: #e6e6e6;
  margin-top: 2rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(74, 74, 228, 0.1);
  }
`;

const AdvancedModeContainer = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #3d3d5c;
`;

const SliderContainer = styled.div`
  margin-bottom: 1rem;
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const Slider = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 8px;
  border-radius: 4px;
  background: #2d2d42;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #4a4ae4;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #4a4ae4;
    cursor: pointer;
  }
`;

const ArchetypeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const ArchetypeButton = styled.button<{ selected: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${props => props.selected ? '#4a4ae4' : 'transparent'};
  border: 1px solid #4a4ae4;
  border-radius: 20px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.selected ? '#5a5af0' : 'rgba(74, 74, 228, 0.1)'};
  }
`;

interface MotivationalFusionProps {
  onMotivationGenerated: (motivation: string) => void;
}

const MotivationalFusion: React.FC<MotivationalFusionProps> = ({ onMotivationGenerated }) => {
  // Predefined options
  const actions: Action[] = [
    { id: 'kill', label: 'Kill' },
    { id: 'protect', label: 'Protect' },
    { id: 'steal', label: 'Steal' },
    { id: 'escape', label: 'Escape' },
    { id: 'inspire', label: 'Inspire' },
    { id: 'lead', label: 'Lead' },
    { id: 'corruption', label: 'Corruption' },
    { id: 'discovery', label: 'Discovery' },
    { id: 'nomad-life', label: 'Nomad Life' },
    { id: 'rule', label: 'Rule' }
  ];
  
  const drivingForces: DrivingForce[] = useMemo(() => [
    { id: 'romance', label: 'Romance' },
    { id: 'gold', label: 'Gold' },
    { id: 'revenge', label: 'Revenge' },
    { id: 'fear', label: 'Fear' },
    { id: 'guilt', label: 'Guilt' },
    { id: 'loyalty', label: 'Loyalty' },
    { id: 'justice', label: 'Justice' },
    { id: 'hatred', label: 'Hatred' },
		{ id: 'glory', label: 'Glory' },
    { id: 'pure-evil', label: 'Pure Evil' },
	],
	[],
);

  const archetypes = [
    { id: 'heroic', label: 'Heroic' },
    { id: 'antihero', label: 'Anti-Hero' },
    { id: 'villain', label: 'Villain' },
    { id: 'tragic', label: 'Tragic Figure' }
  ];
  
  // State
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedForces, setSelectedForces] = useState<{ id: string; intensity: number }[]>([]);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [generatedMotivation, setGeneratedMotivation] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSex, setSelectedSex] = useState<string | null>(null);

  // Load saved state from localStorage
  useEffect(() => {
    const savedActions = localStorage.getItem('motivationalFusion_selectedActions');
    if (savedActions) setSelectedActions(JSON.parse(savedActions));
    
    const savedForces = localStorage.getItem('motivationalFusion_selectedForces');
    if (savedForces) setSelectedForces(JSON.parse(savedForces));
    
    const savedMotive = localStorage.getItem('motivationalFusion_generatedMotive');
    if (savedMotive) setGeneratedMotivation(savedMotive);
    
    const savedAdvancedMode = localStorage.getItem('motivationalFusion_showAdvancedMode');
    if (savedAdvancedMode) setIsAdvancedMode(JSON.parse(savedAdvancedMode));
    
    const savedArchetype = localStorage.getItem('motivationalFusion_selectedArchetype');
    if (savedArchetype) setSelectedArchetype(savedArchetype);

    const savedSex = localStorage.getItem('selectedSex');
    if (savedSex) setSelectedSex(savedSex);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('motivationalFusion_selectedActions', JSON.stringify(selectedActions));
    localStorage.setItem('motivationalFusion_selectedForces', JSON.stringify(selectedForces));
    localStorage.setItem('motivationalFusion_generatedMotive', generatedMotivation || '');
    localStorage.setItem('motivationalFusion_showAdvancedMode', JSON.stringify(isAdvancedMode));
    localStorage.setItem('motivationalFusion_selectedArchetype', selectedArchetype || '');
  }, [selectedActions, selectedForces, generatedMotivation, isAdvancedMode, selectedArchetype]);
  
  // Handle action selection
  const handleActionSelect = (actionId: string) => {
    setSelectedActions(prev => {
      if (prev.includes(actionId)) {
        return prev.filter(id => id !== actionId);
      }
      if (prev.length >= 2) {
        // Remove the last selected action and add the new one
        return [prev[0], actionId];
      }
      return [...prev, actionId];
    });
  };
  
  // Handle driving force selection
  const handleForceSelect = (forceId: string) => {
    setSelectedForces(prev => {
      const exists = prev.find(f => f.id === forceId);
      if (exists) {
        return prev.filter(f => f.id !== forceId);
      }
      if (prev.length >= 2) {
        // Remove the last selected force and add the new one
        return [prev[0], { id: forceId, intensity: 50 }];
      }
      return [...prev, { id: forceId, intensity: 50 }];
    });
  };
  
  // Handle archetype selection
  const handleArchetypeSelect = (archetypeId: string) => {
    setSelectedArchetype(archetypeId);
  };
  
  // Handle intensity change
  const handleIntensityChange = (forceId: string, value: number) => {
    setSelectedForces(prev => 
      prev.map(f => f.id === forceId ? { ...f, intensity: value } : f)
    );
  };
  
  // Generate motive
  const generateMotive = async () => {
    if (selectedActions.length === 0 || selectedForces.length === 0) return;

    setIsGenerating(true);
    const actionLabels = selectedActions.map(actionId => 
      actions.find(a => a.id === actionId)?.label
    ).filter(Boolean);
    
    const forceLabels = selectedForces.map(force => 
      drivingForces.find(f => f.id === force.id)?.label
    ).filter(Boolean);

    // Create a mapping of force intensities
    const forceIntensities = selectedForces.reduce((acc, force) => {
      acc[force.id] = Math.round(force.intensity / 20); // Convert 0-100 to 0-5 scale
      return acc;
    }, {} as Record<string, number>);

    try {
      const response = await fetch('/api/character/generate-motivation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actions: actionLabels,
          forces: forceLabels,
          forceIntensities,
          archetype: selectedArchetype,
          sex: selectedSex
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate motivation');
      }

      const data = await response.json();
      setGeneratedMotivation(data.motivation);
      onMotivationGenerated(data.motivation);
    } catch (error) {
      console.error('Error generating motivation:', error);
      // Fallback to simple motivation if API call fails
      const motivation = `Driven by ${forceLabels.join(' and ')}, they seek to ${actionLabels.join(' and ')}`;
      setGeneratedMotivation(motivation);
      onMotivationGenerated(motivation);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div>
      <Title>Create Your Character&apos;s Motivation</Title>

      <StepContainer>
        <StepTitle>What are their primary actions? (Select up to 2)</StepTitle>
        <OptionsGrid>
          {actions.map(action => (
            <OptionButton
              key={action.id}
              selected={selectedActions.includes(action.id)}
              onClick={() => handleActionSelect(action.id)}
            >
              {action.label}
            </OptionButton>
          ))}
        </OptionsGrid>
      </StepContainer>

      <StepContainer>
        <StepTitle>What drives them? (Select up to 2)</StepTitle>
        <OptionsGrid>
          {drivingForces.map(force => (
            <OptionButton
              key={force.id}
              selected={selectedForces.some(f => f.id === force.id)}
              onClick={() => handleForceSelect(force.id)}
            >
              {force.label}
            </OptionButton>
          ))}
        </OptionsGrid>
      </StepContainer>

      {selectedForces.length > 0 && (
        <AdvancedModeContainer>
          <AdvancedModeToggle onClick={() => setIsAdvancedMode(!isAdvancedMode)}>
            {isAdvancedMode ? <FaChevronUp /> : <FaChevronDown />}
            Advanced Options
          </AdvancedModeToggle>

          {isAdvancedMode && (
            <>
              {selectedForces.map(force => (
                <SliderContainer key={force.id}>
                  <SliderLabel>
                    <span>{force.label}</span>
                    <span>{selectedForces.find(f => f.id === force.id)?.intensity || 50}%</span>
                  </SliderLabel>
                  <Slider
                    type="range"
                    min="0"
                    max="100"
                    value={selectedForces.find(f => f.id === force.id)?.intensity || 50}
                    onChange={(e) => handleIntensityChange(force.id, parseInt(e.target.value))}
                  />
                </SliderContainer>
              ))}

              <StepTitle>Character Archetype</StepTitle>
              <ArchetypeContainer>
                {archetypes.map(archetype => (
                  <ArchetypeButton
                    key={archetype.id}
                    selected={selectedArchetype === archetype.id}
                    onClick={() => handleArchetypeSelect(archetype.id)}
                  >
                    {archetype.label}
                  </ArchetypeButton>
                ))}
              </ArchetypeContainer>
            </>
          )}
        </AdvancedModeContainer>
      )}

      {selectedActions.length > 0 && selectedForces.length > 0 && (
        <ButtonGroup>
          <ActionButton onClick={generateMotive} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <FaDice /> Generate Motivation
              </>
            )}
          </ActionButton>
          <ActionButton 
            onClick={() => {
              setSelectedActions([]);
              setSelectedForces([]);
              setSelectedArchetype(null);
              setGeneratedMotivation(null);
            }}
            disabled={isGenerating}
          >
            <FaRedo /> Reset
          </ActionButton>
        </ButtonGroup>
      )}

      {generatedMotivation && (
        <OutputContainer>
          <OutputTitle>Generated Motivation</OutputTitle>
          <OutputText>{generatedMotivation}</OutputText>
        </OutputContainer>
      )}
    </div>
  );
};

export default MotivationalFusion;
