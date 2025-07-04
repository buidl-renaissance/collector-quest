import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import {
  FaArrowLeft,
  FaRandom,
  FaPlus,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import PageTransition from "@/components/PageTransition";
import { useCharacterClass } from "@/hooks/useCharacterClass";
import { useRace } from "@/hooks/useRace";
import Page from "@/components/Page";
import { useCurrentCharacter, Traits } from "@/hooks/useCurrentCharacter";
import BottomNavigation from "@/components/BottomNavigation";
import { Title, Subtitle } from "@/components/styled/typography";
import { FormSection } from "@/components/styled/forms";
import { navigateTo } from "@/utils/navigation";
import useGeneratedTraits from "@/hooks/useGeneratedTraits";

const CharacterTraitsPage: React.FC = () => {
  const router = useRouter();
  const { character, updateCharacter, saveCharacter, updateCharacterTrait } = useCurrentCharacter();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const { selectedRace, loading: raceLoading } = useRace();
  const { generateTraits, loading: traitsLoading, error: traitsError, traits: generatedTraits } = useGeneratedTraits();
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([]);
  const [selectedIdeals, setSelectedIdeals] = useState<string[]>([]);
  const [selectedFlaws, setSelectedFlaws] = useState<string[]>([]);
  const [selectedBonds, setSelectedBonds] = useState<string[]>([]);

  // Automatically trigger trait generation when the page loads
  useEffect(() => {
    if (!generatedTraits && !traitsLoading) {
      generateTraits();
    }
  }, [generatedTraits, traitsLoading, generateTraits]);

  // Update traits when generated traits are available
  useEffect(() => {
    if (generatedTraits && character) {
      // Initialize selections with existing character traits
      setSelectedPersonality(character.traits?.personality || []);
      setSelectedIdeals(character.traits?.ideals || []);
      setSelectedFlaws(character.traits?.flaws || []);
      setSelectedBonds(character.traits?.bonds || []);
    }
  }, [generatedTraits, character]);

  // Update character with selected traits only when selections change
  useEffect(() => {
    if (character && (
      selectedPersonality.length > 0 ||
      selectedIdeals.length > 0 ||
      selectedFlaws.length > 0 ||
      selectedBonds.length > 0
    )) {
      const updatedTraits = {
        ...character.traits,
        personality: selectedPersonality,
        ideals: selectedIdeals,
        flaws: selectedFlaws,
        bonds: selectedBonds
      };

      // Only update if there are actual changes
      if (JSON.stringify(updatedTraits) !== JSON.stringify(character.traits)) {
        updateCharacter({
          ...character,
          traits: updatedTraits
        });
      }
    }
  }, [selectedPersonality, selectedIdeals, selectedFlaws, selectedBonds, character, updateCharacter]);

  const handleTraitSelection = (category: 'personality' | 'ideals' | 'flaws' | 'bonds', trait: string) => {
    let currentSelection: string[] = [];
    let setSelection: React.Dispatch<React.SetStateAction<string[]>> = () => {};
    
    switch(category) {
      case 'personality':
        currentSelection = [...selectedPersonality];
        setSelection = setSelectedPersonality;
        break;
      case 'ideals':
        currentSelection = [...selectedIdeals];
        setSelection = setSelectedIdeals;
        break;
      case 'flaws':
        currentSelection = [...selectedFlaws];
        setSelection = setSelectedFlaws;
        break;
      case 'bonds':
        currentSelection = [...selectedBonds];
        setSelection = setSelectedBonds;
        break;
    }

    // Toggle selection (add or remove)
    if (currentSelection.includes(trait)) {
      setSelection(currentSelection.filter(item => item !== trait));
    } else {
      // Only allow up to 3 selections per category
      if (currentSelection.length < 3) {
        setSelection([...currentSelection, trait]);
      }
    }
  };

  const handleBack = () => {
    navigateTo(router, "/character/image");
  };

  const handleNext = async () => {
    await saveCharacter();
    navigateTo(router, "/character/motivation");
  };

  const handleRandomSelection = () => {
    if (!generatedTraits) return;

    // Helper function to get random items from array
    const getRandomItems = (arr: string[], count: number) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    // Select 3 random traits from each category
    setSelectedPersonality(getRandomItems(generatedTraits.personality || [], 3));
    setSelectedIdeals(getRandomItems(generatedTraits.ideals || [], 3));
    setSelectedFlaws(getRandomItems(generatedTraits.flaws || [], 3));
    setSelectedBonds(getRandomItems(generatedTraits.bonds || [], 3));
  };

  const isFormComplete = () => {
    return (
      character?.name &&
      (selectedPersonality.length === 3) &&
      (selectedIdeals.length === 3) &&
      (selectedFlaws.length === 3) &&
      (selectedBonds.length === 3)
    );
  };

  return (
    <PageTransition>
      <Page width="narrow">
        {/* <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Character Image
        </BackButton> */}

        <HeroSection>
          <Title>Character Traits</Title>
          <Subtitle>
            Craft your character&apos;s personality, ideals, flaws, and bonds.
          </Subtitle>
        </HeroSection>

        <FormSection>
          {traitsLoading && (
            <LoadingContainer>
              <SpinnerIcon><FaSpinner /></SpinnerIcon>
              <LoadingMessage>Crafting your character&apos;s traits...</LoadingMessage>
              <LoadingSubtext>Analyzing your character&apos;s race, class, and background to create unique traits.</LoadingSubtext>
            </LoadingContainer>
          )}
          
          {traitsError && <ErrorMessage>{traitsError}</ErrorMessage>}

          {generatedTraits && (
            <>
              <RandomizeButton onClick={handleRandomSelection}>
                <FaRandom /> Randomize All Traits
              </RandomizeButton>

              <TraitSection>
                <TraitSectionTitle>Personality Traits (Select 3)</TraitSectionTitle>
                <TraitSelectionInfo>Selected: {selectedPersonality.length}/3</TraitSelectionInfo>
                <TraitGrid>
                  {generatedTraits.personality?.map((trait, index) => (
                    <TraitCard 
                      key={index}
                      selected={selectedPersonality.includes(trait)}
                      onClick={() => handleTraitSelection('personality', trait)}
                      disabled={selectedPersonality.length >= 3 && !selectedPersonality.includes(trait)}
                    >
                      {selectedPersonality.includes(trait) && <CheckIcon><FaCheck /></CheckIcon>}
                      {trait}
                    </TraitCard>
                  ))}
                </TraitGrid>
              </TraitSection>

              <TraitSection>
                <TraitSectionTitle>Ideals (Select 3)</TraitSectionTitle>
                <TraitSelectionInfo>Selected: {selectedIdeals.length}/3</TraitSelectionInfo>
                <TraitGrid>
                  {generatedTraits.ideals?.map((ideal, index) => (
                    <TraitCard 
                      key={index}
                      selected={selectedIdeals.includes(ideal)}
                      onClick={() => handleTraitSelection('ideals', ideal)}
                      disabled={selectedIdeals.length >= 3 && !selectedIdeals.includes(ideal)}
                    >
                      {selectedIdeals.includes(ideal) && <CheckIcon><FaCheck /></CheckIcon>}
                      {ideal}
                    </TraitCard>
                  ))}
                </TraitGrid>
              </TraitSection>

              <TraitSection>
                <TraitSectionTitle>Flaws (Select 3)</TraitSectionTitle>
                <TraitSelectionInfo>Selected: {selectedFlaws.length}/3</TraitSelectionInfo>
                <TraitGrid>
                  {generatedTraits.flaws?.map((flaw, index) => (
                    <TraitCard 
                      key={index}
                      selected={selectedFlaws.includes(flaw)}
                      onClick={() => handleTraitSelection('flaws', flaw)}
                      disabled={selectedFlaws.length >= 3 && !selectedFlaws.includes(flaw)}
                    >
                      {selectedFlaws.includes(flaw) && <CheckIcon><FaCheck /></CheckIcon>}
                      {flaw}
                    </TraitCard>
                  ))}
                </TraitGrid>
              </TraitSection>

              <TraitSection>
                <TraitSectionTitle>Bonds (Select 3)</TraitSectionTitle>
                <TraitSelectionInfo>Selected: {selectedBonds.length}/3</TraitSelectionInfo>
                <TraitGrid>
                  {generatedTraits.bonds?.map((bond, index) => (
                    <TraitCard 
                      key={index}
                      selected={selectedBonds.includes(bond)}
                      onClick={() => handleTraitSelection('bonds', bond)}
                      disabled={selectedBonds.length >= 3 && !selectedBonds.includes(bond)}
                    >
                      {selectedBonds.includes(bond) && <CheckIcon><FaCheck /></CheckIcon>}
                      {bond}
                    </TraitCard>
                  ))}
                </TraitGrid>
              </TraitSection>
            </>
          )}
        </FormSection>

        <BottomNavigation
          selectedItem={character?.name}
          selectedItemLabel="Character Name"
          onNext={handleNext}
          disabled={!isFormComplete()}
        />
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

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const RandomizeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto 2rem;
  padding: 0.75rem 1.5rem;
  background-color: rgba(187, 137, 48, 0.2);
  color: #bb8930;
  border: 1px solid #bb8930;
  border-radius: 4px;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: rgba(187, 137, 48, 0.3);
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    animation: ${spin} 2s linear infinite;
    animation-play-state: paused;
  }

  &:hover svg {
    animation-play-state: running;
  }
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.5s ease-out;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
`;

const SpinnerIcon = styled.div`
  font-size: 2rem;
  color: #bb8930;
  margin-bottom: 1rem;
  animation: ${spin} 1.5s linear infinite;
`;

const LoadingMessage = styled.div`
  font-family: "Cormorant Garamond", serif;
  font-size: 1.5rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
`;

const LoadingSubtext = styled.div`
  font-size: 0.9rem;
  color: #aaa;
  max-width: 400px;
`;

const TraitSection = styled.div`
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.5s ease-out;
`;

const TraitSectionTitle = styled.h3`
  font-family: "Cormorant Garamond", serif;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #bb8930;
`;

const TraitSelectionInfo = styled.div`
  font-size: 0.9rem;
  margin-bottom: 1rem;
  color: #aaa;
`;

const TraitGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const TraitCard = styled.div<{ selected: boolean; disabled: boolean }>`
  position: relative;
  padding: 1rem;
  background-color: ${props => props.selected ? 'rgba(187, 137, 48, 0.2)' : 'rgba(30, 30, 30, 0.3)'};
  border: 1px solid ${props => props.selected ? '#bb8930' : '#333'};
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:hover {
    background-color: ${props => props.disabled ? 'rgba(30, 30, 30, 0.3)' : props.selected ? 'rgba(187, 137, 48, 0.3)' : 'rgba(50, 50, 50, 0.3)'};
  }
`;

const CheckIcon = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: #bb8930;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: rgba(231, 76, 60, 0.1);
`;

export default CharacterTraitsPage;