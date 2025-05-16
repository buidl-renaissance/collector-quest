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
import { useCharacter } from "@/hooks/useCharacter";
import { navigateTo } from "@/utils/navigation";

const MotivationPage: React.FC = () => {
  const router = useRouter();
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const { character, saveCharacter } = useCharacter();
  
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

  const handleNext = () => {
    navigateTo(router, "/character/story");
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
