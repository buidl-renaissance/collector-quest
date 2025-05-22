import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useStoryGenerator } from "@/hooks/useStoryGenerator";
import { Character, useCharacter } from "@/hooks/useCharacter";
import Head from "next/head";
import { Title, Subtitle, NextButton } from "@/components/styled/character";
import PageTransition from "@/components/PageTransition";
import { FaArrowRight, FaSpinner } from "react-icons/fa";
import BottomNavigation from "@/components/BottomNavigation";
import { navigateTo } from "@/utils/navigation";
import Image from "next/image";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
  animation: ${fadeIn} 0.5s ease-in;
  padding-bottom: 100px;
`;

const Section = styled.div`
  background-color: rgba(26, 26, 46, 0.7);
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid #bb8930;
  animation: ${slideUp} 0.5s ease-out;
`;

const SectionTitle = styled.h2`
  color: #bb8930;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-family: "Cormorant Garamond", serif;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

const SpinnerIcon = styled.div`
  color: #bb8930;
  font-size: 2rem;
  margin-bottom: 1rem;
  animation: ${spin} 1.5s linear infinite;
`;

export default function CharacterStoryPage() {
  const router = useRouter();
  const { character } = useCharacter();
//   const [characterImage, setCharacterImage] = useState<string | null>(character?.image_url || character?.race?.image || null);
  const {
    generateStory,
    isLoading,
    backstory,
    motivation,
    step,
    error: storyError,
  } = useStoryGenerator();

  useEffect(() => {
    if (character && !isLoading && !backstory && !motivation) {
      generateStory();
    }
  }, [character, isLoading, backstory, motivation, generateStory]);

  const handleNext = () => {
    navigateTo(router, "/character");
  };

  if (!character) {
    return <Container>Character not found</Container>;
  }

  return (
    <PageTransition>
      <Container>
        <Head>
          <title>{character.name}&apos;s Story</title>
        </Head>

        <Title>{character.name}&apos;s Story</Title>

        {/* {characterImage && (
          <Image src={characterImage} alt={character.name} width={300} height={300} />
        )} */}
        
        {step === "generate-motivation" && (
          <LoadingContainer>
            <SpinnerIcon><FaSpinner /></SpinnerIcon>
            <SectionTitle>Generating motivation...</SectionTitle>
          </LoadingContainer>
        )}

        {motivation && (
          <Section>
            <SectionTitle>Motivation</SectionTitle>
            {character.motivation || motivation || "No motivation provided"}
          </Section>
        )}

        {step === "generate-backstory" && (
          <LoadingContainer>
            <SpinnerIcon><FaSpinner /></SpinnerIcon>
            <SectionTitle>Generating backstory...</SectionTitle>
          </LoadingContainer>
        )}

        {backstory && (
          <Section>
            <SectionTitle>Backstory</SectionTitle>
            {character.backstory || backstory || "No backstory provided"}
          </Section>
        )}

        {motivation && backstory && (
          <BottomNavigation
            selectedItemLabel={""}
            selectedItem={"Story"}
            onNext={handleNext}
            disabled={
                !motivation ||
                !backstory
            }
          />
        )}
      </Container>
    </PageTransition>
  );
}
