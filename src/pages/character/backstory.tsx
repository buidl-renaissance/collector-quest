import React, { useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaArrowLeft, FaArrowRight, FaBook } from "react-icons/fa";
import { useRace } from '@/hooks/useRace';
import { useCharacterClass } from '@/hooks/useCharacterClass';
import CharacterImage from "@/components/CharacterImage";
import CharacterDescription from "@/components/CharacterDescription";
import PageTransition from "@/components/PageTransition";

const BackstoryPage: React.FC = () => {
  const router = useRouter();
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if no race or class is selected
  React.useEffect(() => {
    if (!raceLoading && !selectedRace) {
      router.push('/character/race');
    } else if (!classLoading && !selectedClass) {
      router.push('/character/class');
    }
  }, [selectedRace, selectedClass, raceLoading, classLoading, router]);

  const handleNext = () => {
    router.push('/character/motivation');
  };

  const handleBack = () => {
    router.push('/character/traits');
  };

  if (raceLoading || classLoading || !selectedRace || !selectedClass) {
    return (
      <Container>
        <LoadingMessage>
          <BookIcon><FaBook /></BookIcon>
          Loading...
        </LoadingMessage>
      </Container>
    );
  }

  return (
    <PageTransition>
      <Container>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Traits
        </BackButton>

        <Title>Character Backstory</Title>
        <Subtitle>What shaped your character&apos;s past?</Subtitle>

        <CharacterPreview>
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
        </CharacterPreview>

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
      </Container>
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

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const unfurl = keyframes`
  from { height: 0; opacity: 0; }
  to { height: 200px; opacity: 1; }
`;

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
  animation: ${fadeIn} 0.5s ease-in;
  padding-bottom: 80px;
  color: #333;
  background-color: #f5f5f7;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.5s ease-out;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.8;
  margin-bottom: 1.5rem;
`;

const RandomizeButton = styled.button`
  background-color: #4a4a6a;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5d5d8a;
  }
`;

const FormSection = styled.div`
  margin-top: 2rem;
  animation: ${slideUp} 0.5s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border-radius: 4px;
  border: 1px solid rgba(100, 100, 150, 0.3);
  background-color: rgba(30, 30, 40, 0.7);
  color: #e0e0ff;
  font-family: inherit;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #6a6aff;
    box-shadow: 0 0 0 2px rgba(106, 106, 255, 0.2);
  }

  &::placeholder {
    color: rgba(200, 200, 220, 0.5);
  }
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
  background-color: #6a6aff;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #5a5aee;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #4a4a6a;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResultSection = styled.div`
  margin-top: 2rem;
  animation: ${slideUp} 0.5s ease-out;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
`;

const ScrollAnimation = styled.div`
  width: 60px;
  height: 80px;
  border: 3px solid #6a6aff;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  margin-bottom: 1rem;
  animation: ${pulse} 2s infinite ease-in-out;

  &:before {
    content: "";
    position: absolute;
    width: 40px;
    height: 40px;
    background: rgba(106, 106, 255, 0.8);
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
    animation: ${float} 2s infinite ease-in-out;
  }
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #6a6aff;
`;

const BackstoryScroll = styled.div`
  background-color: rgba(30, 30, 40, 0.7);
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(100, 100, 150, 0.3);
  max-height: 500px;
  overflow-y: auto;
  animation: ${unfurl} 1s ease-out;
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(30, 30, 40, 0.5);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(106, 106, 255, 0.5);
    border-radius: 4px;
  }
`;

const BackstoryContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  white-space: pre-line;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #4a4a6a;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5d5d8a;
  }
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
  
  input {
    margin: 0;
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  height: 100vh;
  font-size: 1.5rem;
  color: #fff;
`;

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
