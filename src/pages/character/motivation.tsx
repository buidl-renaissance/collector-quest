import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { FaArrowLeft, FaCrown, FaDice } from "react-icons/fa";
import PageTransition from "@/components/PageTransition";
import { useRace } from "@/hooks/useRace";
import { useCharacterClass } from "@/hooks/useCharacterClass";
import StoryDisplay from "@/components/StoryDisplay";
import Page from "@/components/Page";
import { BackButton } from "@/components/styled/character";
import {
  Container as PageContainer,
  LoadingMessage,
} from "@/components/styled/layout";
import { Title, Subtitle } from "@/components/styled/typography";
import { useMotivation } from "@/hooks/useMotivation";
import BottomNavigation from "@/components/BottomNavigation";
import { useCurrentCharacter } from "@/hooks/useCurrentCharacter";
import { navigateTo } from "@/utils/navigation";
import { keyframes } from "@emotion/react";

const MotivationPage: React.FC = () => {
  const router = useRouter();
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const { character, saveCharacter } = useCurrentCharacter();
  
  // Predefined options
  const actions = [
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

  const drivingForces = useMemo(
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
  
  // Redirect if no race or class is selected
  useEffect(() => {
    if (!raceLoading && !classLoading) {
      if (!selectedRace) {
        router.push("/character/race");
      } else if (!selectedClass) {
        router.push("/character/class");
      }
    }
  }, [selectedRace, selectedClass, raceLoading, classLoading, router]);

  const handleBack = () => {
    navigateTo(router, "/character/traits");
  };

  const handleNext = async () => {
    await saveCharacter();
    navigateTo(router, "/character/story");
  };

  const handleRandomSelection = () => {
    // Helper function to get random items from array
    const getRandomItems = (arr: string[], count: number) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    // Select 2 random actions
    const randomActions = getRandomItems(actions, 2);
    setSelectedActions(randomActions);

    // Select 2 random driving forces
    const randomForces = getRandomItems(drivingForces, 2);
    setSelectedForces(randomForces);

    // Select 1 random archetype
    const randomArchetype = archetypes[Math.floor(Math.random() * archetypes.length)].id;
    setSelectedArchetype(randomArchetype);

    // Generate motivation with new selections
    generateMotivation();
  };

  if (raceLoading || classLoading) {
    return (
      <PageContainer>
        <LoadingMessage>
          <CrownIcon>
            <FaCrown />
          </CrownIcon>
          Loading...
        </LoadingMessage>
      </PageContainer>
    );
  }

  if (!selectedRace || !selectedClass) {
    return null; // Will redirect in useEffect
  }

  return (
    <PageTransition>
      <Page width="narrow">
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Traits
        </BackButton>

        <Title>What Drives Your Character?</Title>
        <Subtitle>
          Craft the perfect motivation for your character&apos;s journey
        </Subtitle>

        <div>
          <RandomizeButton onClick={handleRandomSelection}>
            <FaDice /> Roll Random Motivation
          </RandomizeButton>

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

        <BottomNavigation
          selectedItemLabel={""}
          selectedItem={"Motivation"}
          onNext={handleNext}
          disabled={!selectedActions.length || !selectedForces.length || !selectedArchetype}
        />
      </Page>
    </PageTransition>
  );
};

const CrownIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #bb8930;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const RandomizeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #2d2d42;
  color: #ffffff;
  border: 2px solid #4a4ae4;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #3d3d5c;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    animation: ${spin} 2s linear infinite;
    animation-play-state: paused;
  }

  &:hover svg {
    animation-play-state: running;
  }
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

export default MotivationPage;
