import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaArrowRight, FaArrowLeft, FaPray } from "react-icons/fa";
import { useCharacter } from "@/hooks/useCharacter";
import { useRace } from "@/hooks/useRace";
import { useCharacterClass } from "@/hooks/useCharacterClass";
import { 
  Container, 
  Title, 
  Subtitle, 
  BackButton, 
  NextButton, 
  HeroSection, 
  SelectionFooter 
} from "@/components/styled/character";
import PageTransition from "@/components/PageTransition";
import { Deity, deities } from "@/data/deities";
import Page from "@/components/Page";
import BottomNavigation from "@/components/BottomNavigation";


const DeityPage: React.FC = () => {
  const router = useRouter();
  const { character, updateCharacterTrait, saveCharacter } = useCharacter();
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const [selectedDeity, setSelectedDeity] = useState<Deity | null>(null);
  const [showDeitySelection, setShowDeitySelection] = useState(true);
  const [showSkipMessage, setShowSkipMessage] = useState(false);

  // Check if deity selection is relevant for this character
  useEffect(() => {
    if (!classLoading && selectedClass) {
      // Determine if deity selection is mandatory, optional, or irrelevant
      if (selectedClass.name === "Cleric" || selectedClass.name === "Paladin") {
        setShowDeitySelection(true);
        setShowSkipMessage(false);
      } else if (["Druid", "Monk", "Warlock"].includes(selectedClass.name)) {
        // Optional for these classes
        setShowDeitySelection(true);
        setShowSkipMessage(false);
      } else {
        // For other classes, check if they already selected a deity
        if (character?.traits?.deity) {
          setShowDeitySelection(true);
          setShowSkipMessage(false);
          // Find the deity in our list
          const foundDeity = deities.find(d => d.name === character?.traits?.deity);
          if (foundDeity) {
            setSelectedDeity(foundDeity);
          }
        } else {
          // Show skip message and redirect after delay
          setShowDeitySelection(false);
          setShowSkipMessage(true);
          const timer = setTimeout(() => {
            router.push("/character/traits");
          }, 5000);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [selectedClass, classLoading, character, router]);

  // Redirect if no race or class is selected
  useEffect(() => {
    if (!raceLoading && !classLoading) {
      if (!selectedRace) {
        router.push("/character/race");
      } else if (!selectedClass) {
        router.push("/character/class");
      }
    }
  }, [selectedRace, selectedClass, raceLoading, classLoading, router, showDeitySelection]);

  const handleDeitySelect = (deity: Deity) => {
    setSelectedDeity(deity);
    updateCharacterTrait("deity", deity.name);
  };

  const handleBack = () => {
    router.push('/character/alignment');
  };

  const handleNext = async () => {
    // await saveCharacter();
    router.push('/character/traits');
  };

  if (raceLoading || classLoading) {
    return (
      <Page>
        <LoadingMessage>
          <DeityIcon><FaPray /></DeityIcon>
          Loading...
        </LoadingMessage>
      </Page>
    );
  }

  if (showSkipMessage) {
    return (
      <PageTransition>
        <Page darkMode={true}>
          <SkipMessage>
            <DeityIcon><FaPray /></DeityIcon>
            <SkipTitle>Deity Selection Not Required</SkipTitle>
            <SkipText>
              Deity selection does not apply to your selected class. Redirecting to the next step...
            </SkipText>
          </SkipMessage>
        </Page>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Page darkMode={true}>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Class Selection
        </BackButton>

        <HeroSection>
          <Title>Choose Your Deity</Title>
          <Subtitle>
            {selectedClass?.name === "Cleric" || selectedClass?.name === "Paladin" 
              ? "As a divine servant, your deity will guide your path and grant you power"
              : "A deity can provide guidance, inspiration, or special favor to your character"}
          </Subtitle>
        </HeroSection>

        <DeitySection>
          <DeityHeader>
            <DeityIcon><FaPray /></DeityIcon>
            <DeityTitle>Divine Patrons</DeityTitle>
          </DeityHeader>

          <DeityGrid>
            {deities.map((deity) => (
              <DeityCard 
                key={deity.name}
                isSelected={selectedDeity?.name === deity.name}
                onClick={() => handleDeitySelect(deity)}
                alignment={deity.alignment}
              >
                <DeityName>{deity.name}</DeityName>
                <DeitySymbol>Symbol: {deity.symbol}</DeitySymbol>
                <DeityDomains>
                  Domains: {deity.domains.join(", ")}
                </DeityDomains>
                <DeityDescription>{deity.description}</DeityDescription>
              </DeityCard>
            ))}
          </DeityGrid>
        </DeitySection>

        <Quote>
          &quot;The gods work in mysterious ways, but their influence can be felt throughout the realms. Choose wisely, for your deity may shape your destiny.&quot;
        </Quote>

        {selectedDeity && (
          <BottomNavigation
            onNext={handleNext}
            selectedItem={selectedDeity?.name}
            selectedItemLabel="Deity"
          />
        )}
      </Page>
    </PageTransition>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #C7BFD4;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const DeitySection = styled.section`
  margin: 2rem 0;
`;

const DeityHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
`;

const DeityIcon = styled.span`
  color: #bb8930;
  font-size: 1.5rem;
  animation: ${fadeIn} 1s infinite alternate;
`;

const DeityTitle = styled.h2`
  font-size: 1.8rem;
  color: #bb8930;
  margin: 0;
`;

const DeityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DeityCard = styled.div<{ isSelected: boolean; alignment: string }>`
  background-color: ${props => props.isSelected ? 'rgba(187, 137, 48, 0.2)' : 'rgba(26, 26, 46, 0.7)'};
  border: 2px solid ${props => props.isSelected ? '#bb8930' : 'rgba(187, 137, 48, 0.3)'};
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${props => {
      if (props.alignment.includes('Good')) return '#4a90e2';
      if (props.alignment.includes('Evil')) return '#e24a4a';
      return '#e2c94a';
    }};
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const DeityName = styled.h3`
  font-size: 1.5rem;
  color: #bb8930;
  margin: 0 0 0.5rem 0;
`;

const DeitySymbol = styled.p`
  font-size: 0.9rem;
  color: #C7BFD4;
  margin: 0.5rem 0;
  font-style: italic;
`;

const DeityDomains = styled.p`
  font-size: 0.9rem;
  color: #C7BFD4;
  margin: 0.5rem 0;
`;

const DeityDescription = styled.p`
  font-size: 1rem;
  color: #E0E0E0;
  margin: 1rem 0 0 0;
  line-height: 1.5;
`;

const Quote = styled.blockquote`
  font-style: italic;
  color: #bb8930;
  text-align: center;
  margin-top: 2rem;
  padding: 1rem;
  border-left: 3px solid #bb8930;
  background-color: rgba(187, 137, 48, 0.1);
`;

const SelectedDeityInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SelectedDeityLabel = styled.span`
  font-size: 1rem;
  color: #C7BFD4;
`;

const SelectedDeityName = styled.span`
  font-size: 1.2rem;
  color: #bb8930;
  font-weight: bold;
`;

const SkipButton = styled.button`
  background-color: transparent;
  color: #C7BFD4;
  border: 1px solid #C7BFD4;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(199, 191, 212, 0.1);
  }
`;

const SkipMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
  animation: ${fadeIn} 0.5s ease;
`;

const SkipTitle = styled.h2`
  color: #bb8930;
  font-size: 2rem;
  margin: 1rem 0;
`;

const SkipText = styled.p`
  color: #C7BFD4;
  font-size: 1.2rem;
  max-width: 600px;
  line-height: 1.6;
`;

export default DeityPage;
