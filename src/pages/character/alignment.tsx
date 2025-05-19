import React from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaArrowRight, FaArrowLeft, FaBalanceScale } from "react-icons/fa";
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
import Page from "@/components/Page";
import BottomNavigation from "@/components/BottomNavigation";
const AlignmentPage: React.FC = () => {
  const router = useRouter();
  const { character, updateCharacter, saveCharacter, updateCharacterTrait } = useCharacter();
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const [selectedAlignment, setSelectedAlignment] = React.useState(character?.traits?.alignment || "");

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

  const handleAlignmentSelect = (alignment: string) => {
    setSelectedAlignment(alignment);
    updateCharacterTrait("alignment", alignment);
  };

  const handleBack = () => {
    router.push('/character/background');
  };

  const handleNext = async () => {
    await saveCharacter();
    router.push('/character/deity');
  };

  return (
      <Page darkMode={true}>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Background
        </BackButton>

        <HeroSection>
          <Title>Choose Your Moral Compass</Title>
          <Subtitle>
            Your alignment reflects your character&apos;s ethical and moral stance in the world
          </Subtitle>
        </HeroSection>

        <AlignmentSection>
          <AlignmentHeader>
            <AlignmentTitle>Alignment</AlignmentTitle>
          </AlignmentHeader>

          <AlignmentGrid>
            {alignments.map((alignment) => (
              <AlignmentCard 
                key={alignment.name}
                isSelected={selectedAlignment === alignment.name}
                onClick={() => handleAlignmentSelect(alignment.name)}
              >
                <AlignmentName>{alignment.name}</AlignmentName>
                <AlignmentDescription>{alignment.description}</AlignmentDescription>
                <AlignmentExample>Example: {alignment.example}</AlignmentExample>
              </AlignmentCard>
            ))}
          </AlignmentGrid>
        </AlignmentSection>

        <AlignmentInfo>
          <InfoTitle>🧭 What Is Alignment?</InfoTitle>
          <InfoText>
            Alignment is represented as a combination of an ethical axis (Lawful, Neutral, or Chaotic) 
            and a moral axis (Good, Neutral, or Evil), creating nine possible combinations that guide 
            how your character views the world and makes decisions.
          </InfoText>
          
          <InfoTitle>💡 How to Use Alignment in Play</InfoTitle>
          <InfoList>
            <InfoListItem>
              <strong>Guides Roleplaying:</strong> Helps you decide how your character might react to moral dilemmas or authority.
            </InfoListItem>
            <InfoListItem>
              <strong>Interacts with Ideals/Bonds/Flaws:</strong> Aligns (or clashes) with those traits for added depth.
            </InfoListItem>
            <InfoListItem>
              <strong>Informs Reputation:</strong> Influences how NPCs and factions perceive your character.
            </InfoListItem>
          </InfoList>
        </AlignmentInfo>

        {selectedAlignment && (
          <BottomNavigation
            onNext={handleNext}
            selectedItem={selectedAlignment}
            selectedItemLabel="Alignment"
          />
        )}
      </Page>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const alignments = [
  {
    name: "Lawful Good",
    description: "The Idealist – Acts with compassion, honor, and a sense of duty. Obeys just laws.",
    example: "paladins, noble knights"
  },
  {
    name: "Neutral Good",
    description: "The Benefactor – Does what is good without bias for or against order.",
    example: "healers, wandering sages"
  },
  {
    name: "Chaotic Good",
    description: "The Rebel – Follows their heart and values freedom and kindness over rules.",
    example: "Robin Hood"
  },
  {
    name: "Lawful Neutral",
    description: "The Judge – Respects order, tradition, and authority above all. Right and wrong are secondary.",
    example: "bureaucrats, monks"
  },
  {
    name: "True Neutral",
    description: "The Balanced – Avoids strong alignment to any extreme. Prioritizes balance.",
    example: "druids, impartial scholars"
  },
  {
    name: "Chaotic Neutral",
    description: "The Free Spirit – Acts on impulse and values personal freedom above all. Morality is fluid.",
    example: "unpredictable rogues"
  },
  {
    name: "Lawful Evil",
    description: "The Tyrant – Uses laws to enforce their will or control others. Efficient, but ruthless.",
    example: "oppressive rulers"
  },
  {
    name: "Neutral Evil",
    description: "The Opportunist – Selfish and willing to harm others to achieve goals, without chaos or law bias.",
    example: "mercenaries, assassins"
  },
  {
    name: "Chaotic Evil",
    description: "The Destroyer – Driven by violence, chaos, and selfish desires. Often sadistic or deranged.",
    example: "demons, mad warlords"
  }
];

const AlignmentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: rgba(26, 26, 46, 0.7);
  border-radius: 8px;
  border: 1px solid #bb8930;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.5s ease-in;
`;

const AlignmentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AlignmentTitle = styled.h2`
  font-size: 1.5rem;
  color: #bb8930;
  margin: 0;
`;

const AlignmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const AlignmentCard = styled.div<{ isSelected?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: ${props => props.isSelected ? 'rgba(187, 137, 48, 0.3)' : 'rgba(26, 26, 46, 0.8)'};
  border: 1px solid ${props => props.isSelected ? '#bb8930' : 'rgba(187, 137, 48, 0.3)'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(187, 137, 48, 0.2);
    border-color: #bb8930;
    transform: translateY(-2px);
  }
`;

const AlignmentName = styled.h3`
  font-size: 1.2rem;
  color: #bb8930;
  margin: 0 0 0.5rem 0;
`;

const AlignmentDescription = styled.p`
  font-size: 0.95rem;
  color: #c7bfd4;
  margin: 0 0 0.5rem 0;
`;

const AlignmentExample = styled.p`
  font-size: 0.85rem;
  color: #a99fb6;
  font-style: italic;
  margin: 0;
`;

const AlignmentInfo = styled.div`
  background-color: rgba(26, 26, 46, 0.7);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(187, 137, 48, 0.3);
`;

const InfoTitle = styled.h3`
  font-size: 1.2rem;
  color: #bb8930;
  margin: 0 0 0.75rem 0;
`;

const InfoText = styled.p`
  font-size: 0.95rem;
  color: #c7bfd4;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
`;

const InfoList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
`;

const InfoListItem = styled.li`
  font-size: 0.95rem;
  color: #c7bfd4;
  margin-bottom: 0.5rem;
  line-height: 1.5;
`;

export default AlignmentPage;
