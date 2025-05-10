import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaArrowLeft, FaArrowRight, FaCrown } from "react-icons/fa";
import PageTransition from "@/components/PageTransition";
import { useRace } from "@/hooks/useRace";
import { useCharacterClass } from "@/hooks/useCharacterClass";
import CharacterImage from "@/components/CharacterImage";
import CharacterDescription from "@/components/CharacterDescription";
import MotivationalFusion from "@/components/MotivationalFusion";
import Page from "@/components/Page";

const MotivationPage: React.FC = () => {
  const router = useRouter();
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const [generatedMotivation, setGeneratedMotivation] = useState("");

  // Load saved motivation from localStorage if it exists
  useEffect(() => {
    const savedMotivation = localStorage.getItem("characterMotivation");
    if (savedMotivation) {
      setGeneratedMotivation(savedMotivation);
    }
  }, []);

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

  const handleNext = () => {
    if (selectedRace && selectedClass) {
      // Save the generated motivation to localStorage before navigating
      if (generatedMotivation) {
        localStorage.setItem("characterMotivation", generatedMotivation);
      }
      router.push("/character/summary");
    }
  };

  const handleBack = () => {
    router.push("/character/traits");
  };

  const handleMotivationGenerated = (motivation: string) => {
    setGeneratedMotivation(motivation);
    // Ensure the motivation is saved immediately when generated
    localStorage.setItem("characterMotivation", motivation);
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

  if (!selectedRace || !selectedClass) {
    return null; // Will redirect in useEffect
  }

  return (
    <PageTransition>
      <Page>
        <Container>
          <BackButton onClick={handleBack}>
            <FaArrowLeft /> Back to Traits
          </BackButton>

          <Title>What Drives Your Character?</Title>
          <Subtitle>
            Craft the perfect motivation for your character&apos;s journey
          </Subtitle>

          {/* <CharacterPreview>
            <CharacterImage
              race={selectedRace}
              characterClass={selectedClass}
              size="large"
            />
            <CharacterDescription
              race={selectedRace}
              characterClass={selectedClass}
              size="large"
            />
          </CharacterPreview> */}

          <MotivationalFusion
            onMotivationGenerated={handleMotivationGenerated}
          />

          <NavigationFooter>
            <NextButton onClick={handleNext} disabled={!generatedMotivation}>
              Next Step <FaArrowRight />
            </NextButton>
          </NavigationFooter>
        </Container>
      </Page>
    </PageTransition>
  );
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
  animation: ${fadeIn} 0.5s ease-in;
  padding-bottom: 80px;
  color: #e0e0e0;
  background-color: #1a1a2e;
  min-height: 100vh;
  transition: background-color 0.3s, color 0.3s;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #bb8930;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.3s;

  &:hover {
    color: #d4a959;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #c7bfd4;
  margin-bottom: 2rem;
`;

const CharacterPreview = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const NavigationFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const NextButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: #bb8930;
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  font-family: "Cormorant Garamond", serif;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

  &:hover {
    background-color: #d4a959;
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #e0e0e0;
`;

const CrownIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #bb8930;
`;

export default MotivationPage;
