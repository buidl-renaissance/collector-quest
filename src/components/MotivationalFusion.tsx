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
  background-color: #4a4ae4;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #5a5af0;
    transform: translateY(-2px);
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
  const [customAction, setCustomAction] = useState('');
  const [selectedForces, setSelectedForces] = useState<string[]>([]);
  const [customForce, setCustomForce] = useState('');
  const [generatedMotive, setGeneratedMotive] = useState('');
  const [showAdvancedMode, setShowAdvancedMode] = useState(false);
  const [forceIntensities, setForceIntensities] = useState<Record<string, number>>({});
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  
  // Load saved state from localStorage
  useEffect(() => {
      const savedActions = localStorage.getItem('motivationalFusion_selectedActions');
      if (savedActions) setSelectedActions(JSON.parse(savedActions));
      
      const savedCustomAction = localStorage.getItem('motivationalFusion_customAction');
      if (savedCustomAction) setCustomAction(savedCustomAction);
      
      const savedForces = localStorage.getItem('motivationalFusion_selectedForces');
      if (savedForces) setSelectedForces(JSON.parse(savedForces));
      
      const savedCustomForce = localStorage.getItem('motivationalFusion_customForce');
      if (savedCustomForce) setCustomForce(savedCustomForce);
      
      const savedMotive = localStorage.getItem('motivationalFusion_generatedMotive');
      if (savedMotive) setGeneratedMotive(savedMotive);
      
      const savedAdvancedMode = localStorage.getItem('motivationalFusion_showAdvancedMode');
      if (savedAdvancedMode) setShowAdvancedMode(JSON.parse(savedAdvancedMode));
      
      const savedIntensities = localStorage.getItem('motivationalFusion_forceIntensities');
      if (savedIntensities) setForceIntensities(JSON.parse(savedIntensities));
      
      const savedArchetype = localStorage.getItem('motivationalFusion_selectedArchetype');
      if (savedArchetype) setSelectedArchetype(savedArchetype);
  }, []);
  
  // Initialize force intensities
  useEffect(() => {
    if (Object.keys(forceIntensities).length === 0) {
      const intensities: Record<string, number> = {};
      drivingForces.forEach(force => {
        intensities[force.id] = 3;
      });
      setForceIntensities(intensities);
    }
  }, [forceIntensities, drivingForces]);
  
  // Save state to localStorage when it changes
  useEffect(() => {
      localStorage.setItem('motivationalFusion_selectedActions', JSON.stringify(selectedActions));
      localStorage.setItem('motivationalFusion_customAction', customAction);
      localStorage.setItem('motivationalFusion_selectedForces', JSON.stringify(selectedForces));
      localStorage.setItem('motivationalFusion_customForce', customForce);
      localStorage.setItem('motivationalFusion_generatedMotive', generatedMotive);
      localStorage.setItem('motivationalFusion_showAdvancedMode', JSON.stringify(showAdvancedMode));
      localStorage.setItem('motivationalFusion_forceIntensities', JSON.stringify(forceIntensities));
      localStorage.setItem('motivationalFusion_selectedArchetype', selectedArchetype || '');
  }, [selectedActions, customAction, selectedForces, customForce, generatedMotive, showAdvancedMode, forceIntensities, selectedArchetype]);
  
  // Handle action selection
  const handleActionSelect = (actionId: string) => {
    setSelectedActions(prev => {
      if (prev.includes(actionId)) {
        return prev.filter(id => id !== actionId);
      }
      if (prev.length >= 2) {
        return [prev[1], actionId];
      }
      return [...prev, actionId];
    });
  };
  
  // Handle driving force selection
  const handleForceSelect = (forceId: string) => {
    setSelectedForces(prev => {
      if (prev.includes(forceId)) {
        return prev.filter(id => id !== forceId);
      }
      if (prev.length >= 2) {
        return [prev[1], forceId];
      }
      return [...prev, forceId];
    });
  };
  
  // Handle archetype selection
  const handleArchetypeSelect = (archetypeId: string) => {
    setSelectedArchetype(archetypeId === selectedArchetype ? null : archetypeId);
  };
  
  // Handle intensity change
  const handleIntensityChange = (forceId: string, value: number) => {
    setForceIntensities(prev => ({
      ...prev,
      [forceId]: value
    }));
  };
  
  // Generate motive
  const generateMotive = async () => {
    if (selectedActions.length === 0 || selectedForces.length === 0) return;

    try {
      const response = await fetch('/api/character/generate-motivation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actions: selectedActions.map(actionId => {
            const action = actions.find(a => a.id === actionId);
            return action ? action.label : customAction;
          }),
          forces: selectedForces.map(forceId => {
            const force = drivingForces.find(f => f.id === forceId);
            return force ? force.label : customForce;
          }),
          forceIntensities,
          archetype: selectedArchetype
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate motivation');
      }

      const data = await response.json();
      setGeneratedMotive(data.motivation);
      onMotivationGenerated(data.motivation);
    } catch (error) {
      console.error('Error generating motivation:', error);
      // Fallback to basic motivation if AI generation fails
      const actionLabels = selectedActions.map(actionId => {
        const action = actions.find(a => a.id === actionId);
        return action ? action.label : customAction;
      });

      const forceLabels = selectedForces.map(forceId => {
        const force = drivingForces.find(f => f.id === forceId);
        return force ? force.label : customForce;
      });

      const motive = `A character driven to ${actionLabels.join(' and ')} by ${forceLabels.join(' and ')}.`;
      setGeneratedMotive(motive);
      onMotivationGenerated(motive);
    }
  };
  
  return (
    <>
      <Title>Motivational Fusion Tool</Title>
      
      <StepContainer>
        <StepTitle>Select up to two actions that define your character&apos;s goals</StepTitle>
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
        <CustomInput
          type="text"
          placeholder="Or enter a custom action..."
          value={customAction}
          onChange={(e) => setCustomAction(e.target.value)}
        />
      </StepContainer>
      
      <StepContainer>
        <StepTitle>Select up to two driving forces behind your character&apos;s actions</StepTitle>
        <OptionsGrid>
          {drivingForces.map(force => (
            <OptionButton
              key={force.id}
              selected={selectedForces.includes(force.id)}
              onClick={() => handleForceSelect(force.id)}
            >
              {force.label}
            </OptionButton>
          ))}
        </OptionsGrid>
        <CustomInput
          type="text"
          placeholder="Or enter a custom driving force..."
          value={customForce}
          onChange={(e) => setCustomForce(e.target.value)}
        />
      </StepContainer>
      
      <StepContainer>
        <StepTitle>Step 3: Generate Motive</StepTitle>
        <ActionButton onClick={generateMotive}>
          Generate Motivation
        </ActionButton>
        
        {generatedMotive && (
          <OutputContainer>
            <OutputTitle>🧠 Output:</OutputTitle>
            <OutputText>{`"${generatedMotive}"`}</OutputText>
            <ButtonGroup>
              <ActionButton onClick={generateMotive}>
                <FaRedo /> Regenerate
              </ActionButton>
            </ButtonGroup>
          </OutputContainer>
        )}
      </StepContainer>
      
      <AdvancedModeToggle onClick={() => setShowAdvancedMode(!showAdvancedMode)}>
        {showAdvancedMode ? 'Hide Advanced Mode' : 'Show Advanced Mode'} 
        {showAdvancedMode ? <FaChevronUp /> : <FaChevronDown />}
      </AdvancedModeToggle>
      
      {showAdvancedMode && (
        <AdvancedModeContainer>
          <StepTitle>Advanced Options</StepTitle>
          
          {selectedForces.length > 0 && (
            <>
              <StepTitle>Intensity Sliders</StepTitle>
              {selectedForces.map(forceId => {
                const force = drivingForces.find(f => f.id === forceId);
                if (!force) return null;
                
                return (
                  <SliderContainer key={force.id}>
                    <SliderLabel>
                      <span>{force.label}</span>
                      <span>{forceIntensities[force.id]}/5</span>
                    </SliderLabel>
                    <Slider 
                      type="range" 
                      min="1" 
                      max="5" 
                      value={forceIntensities[force.id]} 
                      onChange={(e) => handleIntensityChange(force.id, parseInt(e.target.value))}
                    />
                  </SliderContainer>
                );
              })}
            </>
          )}
          
          <StepTitle>Archetype Filter</StepTitle>
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
        </AdvancedModeContainer>
      )}
    </>
  );
};

export default MotivationalFusion;
