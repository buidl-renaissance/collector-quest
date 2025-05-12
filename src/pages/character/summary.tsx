import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaArrowLeft, FaArrowRight, FaCrown, FaCopy, FaRedo } from "react-icons/fa";
import PageTransition from "@/components/PageTransition";
import { useRace } from "@/hooks/useRace";
import { useCharacterClass } from "@/hooks/useCharacterClass";
import CharacterSummary from "@/components/CharacterSummary";
import { useCharacter } from "@/hooks/useCharacter";
import Page from "@/components/Page";
import { Container, LoadingMessage } from "@/components/styled/layout";
import { Title, Subtitle } from "@/components/styled/typography";
import { BackButton, NextButton } from "@/components/styled/buttons";
import { useTraits } from "@/hooks/useTraits";
import { useMotivation } from "@/hooks/useMotivation";

const SummaryPage: React.FC = () => {
  const router = useRouter();
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const { selectedTraits, loading: traitsLoading } = useTraits();
  const { motivationState, loading: motivationLoading } = useMotivation();
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [characterBio, setCharacterBio] = useState("");
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

  // Generate bio when button is clicked
  const generateBio = async () => {
    console.log("Generating bio");
    console.log('selectedRace', selectedRace);
    console.log('selectedClass', selectedClass);
    console.log('selectedTraits', selectedTraits);
    console.log('motivationState', motivationState);
    console.log('character', character);
    console.log('loading', loading);
    console.log('raceLoading', raceLoading);
    console.log('classLoading', classLoading);
    console.log('traitsLoading', traitsLoading);
    console.log('motivationLoading', motivationLoading);
    if (!selectedRace || !selectedClass || !selectedTraits || !motivationState.generatedMotivation || !character) return;
    if (raceLoading || classLoading || traitsLoading || motivationLoading) return;

    setIsGeneratingBio(true);
    try {
      const response = await fetch('/api/character/generate-bio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: character.name || 'Unknown',
          race: selectedRace.name,
          class: selectedClass.name,
          background: selectedClass.description || '',
          traits: {
            personality: selectedTraits.personality?.join(', ') || '',
            fear: selectedTraits.flaws?.join(', ') || '',
            memory: selectedTraits.bonds?.[0] || '',
            possession: character.traits?.possession || '',
            ideals: selectedTraits.ideals?.join(', ') || '',
            bonds: selectedTraits.bonds?.join(', ') || '',
            flaws: selectedTraits.flaws?.join(', ') || ''
          },
          motivation: motivationState.generatedMotivation,
          sex: character.sex || 'unknown'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate bio');
      }

      const data = await response.json();
      setCharacterBio(data.bio);
      // Save the generated bio to character state
      updateCharacter({ bio: data.bio });
    } catch (error) {
      console.error('Error generating bio:', error);
      setCharacterBio("Failed to generate character bio. Please try again.");
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleBack = () => {
    router.push("/character/motivation");
  };

  const handleNext = () => {
    if (character && character.bio) {
      router.push('/character/sheet');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(characterBio);
    // Could add a toast notification here
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

        <Title>Your Character Summary</Title>
        <Subtitle>Review and finalize your character&apos;s story</Subtitle>

        <CharacterSummary character={character} />

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Character Biography</h2>
          {isGeneratingBio ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Generating your character&apos;s story...</p>
            </div>
          ) : characterBio ? (
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{characterBio}</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <button
                onClick={generateBio}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Biography
              </button>
            </div>
          )}
        </div>

        <ActionButtons>
          {characterBio && (
            <ActionButton onClick={copyToClipboard}>
              <FaCopy /> Copy to Clipboard
            </ActionButton>
          )}
          {characterBio && (
            <ActionButton onClick={generateBio}>
              <FaRedo /> Regenerate
            </ActionButton>
          )}
        </ActionButtons>

        <NextButton onClick={handleNext} disabled={!character || !character.bio}>
          Continue to Character Sheet <FaArrowRight />
        </NextButton>
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

export default SummaryPage;
