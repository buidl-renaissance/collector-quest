import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaArrowLeft, FaArrowRight, FaCrown, FaCopy } from "react-icons/fa";
import PageTransition from "@/components/PageTransition";
import { useRace } from "@/hooks/useRace";
import { useCharacterClass } from "@/hooks/useCharacterClass";
import CharacterSummary from "@/components/CharacterSummary";
import { useCharacter } from "@/hooks/useCharacter";
import Page from "@/components/Page";
import { Container, LoadingMessage } from "@/components/styled/layout";
import { Title, Subtitle } from "@/components/styled/typography";
import { BackButton, NextButton } from "@/components/styled/buttons";

const SummaryPage: React.FC = () => {
  const router = useRouter();
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const [isFirstPerson, setIsFirstPerson] = useState(false);
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

  const handleBack = () => {
    router.push("/character/motivation");
  };

  const handleNext = () => {
    if (selectedRace && selectedClass) {
      router.push("/character/complete");
    }
  };

  const generateBio = () => {
    if (!selectedRace || !selectedClass) return;

    const personalityText = "mysterious"; // This would come from your form data
    const motivationText = "survival"; // This would come from your form data
    const fearText = "the unknown"; // This would come from your form data
    const hauntingMemory = "a forgotten past"; // This would come from your form data
    const treasuredPossession = "a family heirloom"; // This would come from your form data

    const firstPersonBio = `I am a ${personalityText} ${selectedRace.name} ${selectedClass.name}. My quest for ${motivationText} drives me forward, though I am haunted by ${hauntingMemory}. Above all, I fear ${fearText}, yet I find comfort in my most treasured possession: ${treasuredPossession}.`;

    const thirdPersonBio = `A ${personalityText} ${selectedRace.name} ${selectedClass.name}. Driven by a desire for ${motivationText}, they push forward despite being haunted by ${hauntingMemory}. Though they deeply fear ${fearText}, they find solace in their most treasured possession: ${treasuredPossession}.`;

    setCharacterBio(isFirstPerson ? firstPersonBio : thirdPersonBio);
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

        <BioSection>
          <BioHeader>
            <BioTitle>Character Biography</BioTitle>
            <ViewToggle>
              <ToggleLabel>
                <input
                  type="checkbox"
                  checked={isFirstPerson}
                  onChange={() => {
                    setIsFirstPerson(!isFirstPerson);
                    if (characterBio) generateBio();
                  }}
                />
                {isFirstPerson ? "First Person" : "Third Person"}
              </ToggleLabel>
            </ViewToggle>
          </BioHeader>

          {!characterBio ? (
            <GenerateButton onClick={generateBio}>
              Generate Biography
            </GenerateButton>
          ) : (
            <>
              <BioContent>{characterBio}</BioContent>
              <ActionButtons>
                <ActionButton onClick={copyToClipboard}>
                  <FaCopy /> Copy to Clipboard
                </ActionButton>
              </ActionButtons>
            </>
          )}
        </BioSection>

        <NextButton onClick={handleNext}>
          Complete Character <FaArrowRight />
        </NextButton>
      </Page>
    </PageTransition>
  );
};

// Animations

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const BioSection = styled.div`
  background-color: rgba(187, 137, 48, 0.1);
  border: 1px solid #bb8930;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.5s ease-out;
`;

const BioHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const BioTitle = styled.h2`
  font-size: 1.8rem;
  color: #bb8930;
  margin: 0;
`;

const ViewToggle = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #bb8930;

  input {
    margin: 0;
  }
`;

const GenerateButton = styled.button`
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: #bb8930;
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #d4a959;
  }
`;

const BioContent = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #c7bfd4;
  margin-bottom: 1.5rem;
  font-style: italic;
`;

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
