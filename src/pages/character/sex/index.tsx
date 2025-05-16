import React from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaArrowRight, FaCrown, FaMars, FaVenus, FaGenderless, FaArrowLeft } from "react-icons/fa";
import { useSex, Sex } from "@/hooks/useSex";
import PageTransition from "@/components/PageTransition";
import { BackButton } from "@/components/styled/buttons";

const SexSelectionPage: React.FC = () => {
  const router = useRouter();
  const { selectedSex, selectSex, loading } = useSex();

  const handleBack = () => {
    router.push('/character/name');
  };

  const handleNext = () => {
    if (selectedSex) {
      router.push('/character/race');
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>
          <CrownIcon><FaCrown /></CrownIcon>
          Loading...
        </LoadingMessage>
      </Container>
    );
  }

  return (
    <PageTransition>
      <Container>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Name Selection
        </BackButton>

        <Title>Craft Your Character</Title>
        <Subtitle>Who will you be in Lord Smearington&apos;s Gallery of the Absurd?</Subtitle>
        
        <SexOptions>
          <SexOption 
            selected={selectedSex === 'male'}
            onClick={() => selectSex('male')}
          >
            <SexIcon><FaMars /></SexIcon>
            <SexLabel>Male</SexLabel>
          </SexOption>

          <SexOption 
            selected={selectedSex === 'female'}
            onClick={() => selectSex('female')}
          >
            <SexIcon><FaVenus /></SexIcon>
            <SexLabel>Female</SexLabel>
          </SexOption>

          <SexOption 
            selected={selectedSex === 'other'}
            onClick={() => selectSex('other')}
          >
            <SexIcon><FaGenderless /></SexIcon>
            <SexLabel>Other</SexLabel>
          </SexOption>
        </SexOptions>

        <Quote>
          &quot;The first step in crafting your character is choosing who they are. This choice will influence how others perceive you in the gallery.&quot;
        </Quote>

        {selectedSex && (
          <SelectionFooter>
            <SelectedSexInfo>
              <SelectedSexLabel>Selected:</SelectedSexLabel>
              <SelectedSexName>
                {selectedSex === 'male' ? 'Male' : selectedSex === 'female' ? 'Female' : 'Other'}
              </SelectedSexName>
            </SelectedSexInfo>
            <NextButton onClick={handleNext}>
              Next Step <FaArrowRight />
            </NextButton>
          </SelectionFooter>
        )}
      </Container>
    </PageTransition>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  font-family: 'Cormorant Garamond', serif;
  animation: ${fadeIn} 0.5s ease-in;
  padding-bottom: 80px;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #C7BFD4;
  margin-bottom: 1.5rem;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
`;

const SexOptions = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin: 1.5rem 0;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin: 2rem 0;
  }
`;

const SexOption = styled.div<{ selected?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: ${props => props.selected ? 'rgba(187, 137, 48, 0.3)' : 'rgba(58, 38, 6, 0.4)'};
  border: 1px solid ${props => props.selected ? '#bb8930' : 'rgba(187, 137, 48, 0.3)'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(187, 137, 48, 0.2);
    border-color: #bb8930;
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const SexIcon = styled.div`
  font-size: 2rem;
  color: #bb8930;
  margin-bottom: 0.75rem;

  @media (min-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
`;

const SexLabel = styled.span`
  font-size: 1.1rem;
  color: #C7BFD4;

  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Quote = styled.blockquote`
  font-style: italic;
  color: #bb8930;
  text-align: center;
  margin-top: 1.5rem;
  padding: 0.75rem;
  border-left: 3px solid #bb8930;
  background-color: rgba(187, 137, 48, 0.1);
  font-size: 0.9rem;

  @media (min-width: 768px) {
    margin-top: 2rem;
    padding: 1rem;
    font-size: 1rem;
  }
`;

const SelectionFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(26, 26, 46, 0.95);
  border-top: 2px solid #bb8930;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${slideUp} 0.3s ease-out;
  z-index: 100;

  @media (min-width: 768px) {
    padding: 1rem 2rem;
  }
`;

const SelectedSexInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SelectedSexLabel = styled.span`
  color: #C7BFD4;
  font-size: 0.9rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const SelectedSexName = styled.span`
  color: #bb8930;
  font-weight: bold;
  font-size: 1rem;

  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const NextButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background-color: #bb8930;
  color: #1a1625;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: #d4a959;
  }

  @media (min-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.1rem;
  color: #C7BFD4;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CrownIcon = styled.span`
  color: #bb8930;
  font-size: 1.3rem;
  animation: ${fadeIn} 1s infinite alternate;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

export default SexSelectionPage; 