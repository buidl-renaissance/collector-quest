  import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { FaArrowLeft, FaCrown } from "react-icons/fa";
import PageTransition from "@/components/PageTransition";
import { useRace } from "@/hooks/useRace";
import { useCharacterClass } from "@/hooks/useCharacterClass";
import MotivationalFusion from "@/components/MotivationalFusion";
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

const MotivationPage: React.FC = () => {
  const router = useRouter();
  const { saveCharacter } = useCharacter();
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const {
    motivationState: { generatedMotivation },
    loading: motivationLoading,
    setGeneratedMotivation,
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

  const handleNext = async () => {
    if (selectedRace && selectedClass) {
      router.push("/character/backstory");
    }
  };

  const handleBack = () => {
    router.push("/character/traits");
  };

  const handleMotivationGenerated = async (motivation: string) => {
    setGeneratedMotivation(motivation);
    await saveCharacter();
  };

  if (raceLoading || classLoading || motivationLoading) {
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

        <MotivationalFusion onMotivationGenerated={handleMotivationGenerated} />

        <BottomNavigation
          selectedItemLabel={""}
          selectedItem={"Motivation Generated"}
          onNext={handleNext}
          disabled={!generatedMotivation}
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

export default MotivationPage;
