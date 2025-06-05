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
import { useCurrentCharacter } from "@/hooks/useCurrentCharacter";
import Page from "@/components/Page";
import { Container, LoadingMessage, ActionButtons, CrownIcon } from "@/components/styled/layout";
import { Title, Subtitle } from "@/components/styled/typography";
import { BackButton } from "@/components/styled/character";
import { NextButton } from "@/components/styled/buttons";
import BackstoryDisplay from "@/components/StoryDisplay";
import { useBackstory } from "@/hooks/useBackstory";
import { navigateTo } from "@/utils/navigation";

const BackstoryPage: React.FC = () => {
  const router = useRouter();
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const { character, saveCharacter } = useCurrentCharacter();
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
    navigateTo(router, "/character/motivation");
  };

  const handleNext = () => {
    navigateTo(router, "/character");
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
          onRegenerate={generateBackstory}
          showRegenerateButton={!!backstory}
        />

        <ActionButtons>
          <NextButton
            onClick={handleNext}
            disabled={!backstory || isGeneratingBackstory}
          >
            Continue <FaArrowRight />
          </NextButton>
        </ActionButtons>
      </Page>
    </PageTransition>
  );
};

export default BackstoryPage;
