import React, { useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaArrowLeft, FaArrowRight, FaBook } from "react-icons/fa";
import { useRace } from "@/hooks/useRace";
import { useCharacterClass } from "@/hooks/useCharacterClass";
import CharacterImage from "@/components/CharacterImage";
import CharacterDescription from "@/components/CharacterDescription";
import PageTransition from "@/components/PageTransition";
import { BackButton, NextButton } from "@/components/styled/buttons";
import {
  FormGroup,
  FormSection,
  Label,
  TextArea,
} from "@/components/styled/forms";
import { LoadingMessage } from "@/components/styled/layout";
import Page from "@/components/Page";
import { Subtitle, Title } from "@/components/styled/typography";
import CharacterCard from "@/components/CharacterCard";
import { useCharacter } from "@/hooks/useCharacter";
export default function BackstoryPage() {
  const router = useRouter();
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const { character, loading: characterLoading } = useCharacter();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if no race or class is selected
  React.useEffect(() => {
    if (!raceLoading && !selectedRace) {
      router.push("/character/race");
    } else if (!classLoading && !selectedClass) {
      router.push("/character/class");
    }
  }, [selectedRace, selectedClass, raceLoading, classLoading, router]);

  const handleNext = () => {
    router.push("/character/motivation");
  };

  const handleBack = () => {
    router.push("/character/traits");
  };

  if (raceLoading || classLoading || !selectedRace || !selectedClass) {
    return (
      <Page width="narrow">
        <LoadingMessage>
          <BookIcon>
            <FaBook />
          </BookIcon>
          Loading...
        </LoadingMessage>
      </Page>
    );
  }

  return (
    <PageTransition>
      <Page width="narrow">
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Traits
        </BackButton>

        <Title>Character Backstory</Title>
        <Subtitle>What shaped your character&apos;s past?</Subtitle>

        {/* {character && <CharacterCard character={character} />} */}

        <FormSection>
          <FormGroup>
            <Label>Background</Label>
            <TextArea
              placeholder="Describe your character's background and history..."
              rows={6}
            />
          </FormGroup>

          <FormGroup>
            <Label>Personality Traits</Label>
            <TextArea
              placeholder="What are your character's personality traits?"
              rows={4}
            />
          </FormGroup>

          <FormGroup>
            <Label>Ideals</Label>
            <TextArea
              placeholder="What ideals drive your character?"
              rows={4}
            />
          </FormGroup>

          <FormGroup>
            <Label>Bonds</Label>
            <TextArea
              placeholder="What bonds connect your character to others?"
              rows={4}
            />
          </FormGroup>

          <FormGroup>
            <Label>Flaws</Label>
            <TextArea
              placeholder="What flaws or vices does your character have?"
              rows={4}
            />
          </FormGroup>
        </FormSection>

        <Navigation>
          <BackButton onClick={handleBack}>
            <FaArrowLeft /> Back
          </BackButton>
          <NextButton onClick={handleNext}>
            Next <FaArrowRight />
          </NextButton>
        </Navigation>
      </Page>
    </PageTransition>
  );
}

const BookIcon = styled.div`
  font-size: 3rem;
  color: #4a90e2;
  animation: float 3s ease-in-out infinite;
`;

const CharacterPreview = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
`;

const Navigation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #444;
`;
