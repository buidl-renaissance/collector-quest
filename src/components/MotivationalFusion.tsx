import React, { useMemo } from "react";
import styled from "@emotion/styled";
import { FaDice } from "react-icons/fa";
import StoryDisplay from "./StoryDisplay";
import { useMotivation } from "@/hooks/useMotivation";

// Types
type Action = string;
type DrivingForce = string;

const MotivationalFusion: React.FC = () => {
  // Predefined options
  const actions: Action[] = [
    "Kill",
    "Protect",
    "Steal",
    "Escape",
    "Inspire",
    "Lead",
    "Corruption",
    "Discovery",
    "Nomad Life",
    "Rule",
  ];

  const drivingForces: DrivingForce[] = useMemo(
    () => [
      "Romance",
      "Gold",
      "Revenge",
      "Fear",
      "Guilt",
      "Loyalty",
      "Justice",
      "Hatred",
      "Glory",
      "Pure Evil",
    ],
    []
  );

  const archetypes = [
    { id: "heroic", label: "Heroic" },
    { id: "antihero", label: "Anti-Hero" },
    { id: "villain", label: "Villain" },
    { id: "tragic", label: "Tragic Figure" },
  ];

  const {
    actions: selectedActions,
    forces: selectedForces,
    archetype: selectedArchetype,
    motivation: generatedMotivation,
    generateMotivation,
    setSelectedActions,
    setSelectedForces,
    setSelectedArchetype,
    setGeneratedMotivation,
    addSelectedAction,
    addSelectedForce,
    loading: isGenerating,
  } = useMotivation();

  return (
    <div>
      <StepContainer>
        <StepTitle>What are their primary actions? (Select up to 2)</StepTitle>
        <OptionsGrid>
          {actions.map((action) => (
            <OptionButton
              key={action}
              selected={selectedActions.includes(action)}
              onClick={() => {
                addSelectedAction(action);
              }}
            >
              {action}
            </OptionButton>
          ))}
        </OptionsGrid>
      </StepContainer>

      <StepContainer>
        <StepTitle>What drives them? (Select up to 2)</StepTitle>
        <OptionsGrid>
          {drivingForces.map((force) => (
            <OptionButton
              key={force}
              selected={selectedForces.includes(force)}
              onClick={() => {
                addSelectedForce(force);
              }}
            >
              {force}
            </OptionButton>
          ))}
        </OptionsGrid>
      </StepContainer>

      <StepContainer>
        <StepTitle>What archetype best fits them?</StepTitle>
        <ArchetypeContainer>
          {archetypes.map((archetype) => (
            <ArchetypeButton
              key={archetype.id}
              selected={selectedArchetype === archetype.id}
              onClick={() => setSelectedArchetype(archetype.id)}
            >
              {archetype.label}
            </ArchetypeButton>
          ))}
        </ArchetypeContainer>
      </StepContainer>

      {/* {selectedActions.length > 0 && selectedForces.length > 0 && (
        <ButtonGroup>
          <ActionButton onClick={generateMotivation} disabled={isGenerating}>
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
        </ButtonGroup>
      )} */}

      {generatedMotivation && (
        <StoryDisplay
          title="Motivation"
          text={generatedMotivation}
          isGenerating={isGenerating}
          onRegenerate={generateMotivation}
          showRegenerateButton={true}
        />
      )}
    </div>
  );
};

export default MotivationalFusion;

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
  background-color: ${(props) => (props.selected ? "#4a4ae4" : "#2d2d42")};
  border: 2px solid ${(props) => (props.selected ? "#8080ff" : "transparent")};
  border-radius: 8px;
  color: #ffffff;
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.selected ? "#5a5af0" : "#3d3d5c")};
    transform: translateY(-2px);
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
  font-size: 1.2rem;
  line-height: 1.6;
  color: #ffffff;
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
  background-color: ${(props) => (props.disabled ? "#2d2d42" : "#4a4ae4")};
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-weight: bold;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};

  &:hover {
    background-color: ${(props) => (props.disabled ? "#2d2d42" : "#5a5af0")};
    transform: ${(props) => (props.disabled ? "none" : "translateY(-2px)")};
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
  background-color: ${(props) => (props.selected ? "#4a4ae4" : "transparent")};
  border: 1px solid #4a4ae4;
  border-radius: 20px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.selected ? "#5a5af0" : "rgba(74, 74, 228, 0.1)"};
  }
`;
