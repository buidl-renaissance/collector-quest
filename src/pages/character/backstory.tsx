import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCrown,
  FaRedo,
} from "react-icons/fa";
import PageTransition from "@/components/PageTransition";
import { useRace } from "@/hooks/useRace";
import { useCharacterClass } from "@/hooks/useCharacterClass";
import CharacterSummary from "@/components/CharacterSummary";
import { useCharacter } from "@/hooks/useCharacter";
import Page from "@/components/Page";
import { Container, LoadingMessage } from "@/components/styled/layout";
import { Title, Subtitle } from "@/components/styled/typography";
import { BackButton } from "@/components/styled/character";
import { NextButton } from "@/components/styled/buttons";
import { useTraits } from "@/hooks/useTraits";
import { useMotivation } from "@/hooks/useMotivation";

// Update the traits interface to include the new properties
interface Traits {
  personality: string[];
  ideals: string[];
  bonds: string[];
  flaws: string[];
  hauntingMemory: string;
  treasuredPossession: string;
}

// Update the character interface to include backstory
interface Character {
  name: string;
  race?: {
    name: string;
    description?: string;
  };
  class?: {
    name: string;
    description?: string;
  };
  sex?: string;
  traits?: {
    personality?: string[];
    ideals?: string[];
    bonds?: string[];
    flaws?: string[];
    hauntingMemory?: string;
    treasuredPossession?: string;
  };
  backstory?: string;
}

const BackstoryPage: React.FC = () => {
  const router = useRouter();
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const { selectedTraits, loading: traitsLoading } = useTraits();
  const { motivationState, loading: motivationLoading } = useMotivation();
  const [isGeneratingBackstory, setIsGeneratingBackstory] = useState(false);
  const [characterBackstory, setCharacterBackstory] = useState("");
  const { character, loading, updateCharacter } = useCharacter();

  // Redirect if no race or class is selected
  React.useEffect(() => {
    if (!raceLoading && !classLoading) {
      if (!selectedRace) {
        router.push("/character/race");
      } else if (!selectedClass) {
        router.push("/character/class");
      }
    }
  }, [selectedRace, selectedClass, raceLoading, classLoading, router]);

  // Load saved backstory from localStorage on initial render
  useEffect(() => {
    const savedBackstory = localStorage.getItem('characterBackstory');
    if (savedBackstory) {
      setCharacterBackstory(savedBackstory);
    }
  }, []);

  // Auto-generate backstory when all required data is loaded
  useEffect(() => {
    const generateBackstoryIfNeeded = async () => {
      if (
        !raceLoading &&
        !classLoading &&
        !traitsLoading &&
        !motivationLoading &&
        !loading &&
        selectedRace &&
        selectedClass &&
        selectedTraits &&
        motivationState.generatedMotivation &&
        character &&
        !characterBackstory // Only generate if we don't already have a backstory
      ) {
        await generateBackstory();
      }
    };

    generateBackstoryIfNeeded();
  }, [
    raceLoading,
    classLoading,
    traitsLoading,
    motivationLoading,
    loading,
    selectedRace,
    selectedClass,
    selectedTraits,
    motivationState.generatedMotivation,
    character,
    characterBackstory
  ]);

  // Generate backstory
  const generateBackstory = async () => {
    if (
      !selectedRace ||
      !selectedClass ||
      !selectedTraits ||
      !motivationState.generatedMotivation ||
      !character
    )
      return;
    if (raceLoading || classLoading || traitsLoading || motivationLoading)
      return;

    setIsGeneratingBackstory(true);
    try {
      const response = await fetch("/api/character/generate-backstory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: character.name || "Unknown",
          race: {
            name: selectedRace.name,
            description: selectedRace.description || "",
          },
          class: {
            name: selectedClass.name,
            description: selectedClass.description || "",
          },
          traits: {
            personality: selectedTraits.personality || [],
            ideals: selectedTraits.ideals || [],
            bonds: selectedTraits.bonds || [],
            flaws: selectedTraits.flaws || [],
            hauntingMemory: selectedTraits.hauntingMemory || "",
            treasuredPossession: selectedTraits.treasuredPossession || "",
          },
          motivation: motivationState.generatedMotivation,
          sex: character.sex || "unknown",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate backstory");
      }

      const data = await response.json();
      setCharacterBackstory(data.backstory);
      // Save the generated backstory to character state and localStorage
      updateCharacter({ 
        backstory: data.backstory,
        background: data.backstory 
      });
      localStorage.setItem('characterBackstory', data.backstory);
      localStorage.setItem('characterBackground', data.backstory);
    } catch (error) {
      console.error("Error generating backstory:", error);
      setCharacterBackstory("Failed to generate character backstory. Please try again.");
    } finally {
      setIsGeneratingBackstory(false);
    }
  };

  const handleBack = () => {
    router.push("/character/motivation");
  };

  const handleNext = () => {
    if (character && character.backstory) {
      router.push("/character/sheet");
    }
  };

  if (raceLoading || classLoading) {
    return (
      <Container>
        <LoadingMessage>
          <CrownIcon>
            <FaCrown />
          </CrownIcon>
          Loading...
        </LoadingMessage>
      </Container>
    );
  }

  if (!selectedRace || !selectedClass || !character) {
    return null; // Will redirect in useEffect
  }

  return (
    <PageTransition>
      <Page width="narrow">
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Motivation
        </BackButton>

        <Title>Your Character&apos;s Backstory</Title>
        <Subtitle>Discover the tale of your character&apos;s past</Subtitle>

        {/* <CharacterSummary character={character} /> */}

        <BackstorySection>
          <h2 className="text-2xl font-bold mb-4">Backstory</h2>
          {isGeneratingBackstory ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Crafting your character&apos;s tale...</p>
            </div>
          ) : characterBackstory ? (
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{characterBackstory}</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p>Loading character details...</p>
            </div>
          )}
        </BackstorySection>

        <ActionButtons>
          {/* {characterBackstory && (
            <ActionButton onClick={generateBackstory}>
              <FaRedo /> Regenerate Backstory
            </ActionButton>
          )} */}
          <NextButton
            onClick={handleNext}
            disabled={!character || !character.backstory}
          >
            Continue to Character Sheet <FaArrowRight />
          </NextButton>
        </ActionButtons>
      </Page>
    </PageTransition>
  );
};

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: rgba(187, 137, 48, 0.2);
  color: #bb8930;
  border: 1px solid #bb8930;
  border-radius: 4px;
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: rgba(187, 137, 48, 0.3);
  }
`;

const CrownIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const BackstorySection = styled.div`
  background-color: rgba(58, 51, 71, 0.2);
  border: 1px solid #bb8930;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
`;

export default BackstoryPage;
