import React from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCrown,
} from "react-icons/fa";
import PageTransition from "@/components/PageTransition";
import { useRace } from "@/hooks/useRace";
import { useCharacterClass } from "@/hooks/useCharacterClass";
import { useCharacter } from "@/hooks/useCharacter";
import Page from "@/components/Page";
import { Container, LoadingMessage } from "@/components/styled/layout";
import { Title, Subtitle } from "@/components/styled/typography";
import { BackButton } from "@/components/styled/character";
import { NextButton } from "@/components/styled/buttons";
import BackstoryDisplay from "@/components/StoryDisplay";
import { useBackstory } from "@/hooks/useBackstory";

const BackstoryPage: React.FC = () => {
  const router = useRouter();
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const { character } = useCharacter();
  const { 
    backstory, 
    isGeneratingBackstory, 
    generateBackstory,
    loading: backstoryLoading 
  } = useBackstory();

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
    if (character && character.backstory) {
      router.push("/character/sheet");
    }
  };

  if (raceLoading || classLoading || backstoryLoading) {
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

        <BackstoryDisplay
          title="Backstory"
          text={backstory ?? ""}
          isGenerating={isGeneratingBackstory}
          onRegenerate={() => generateBackstory(character)}
          showRegenerateButton={!!backstory}
        />

        <ActionButtons>
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

const CrownIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

export default BackstoryPage;
