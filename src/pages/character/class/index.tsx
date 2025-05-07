import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaArrowLeft, FaArrowRight, FaCrown } from "react-icons/fa";
import { GetServerSideProps } from "next";
import { Race, coreRaces, expandedRaces } from "@/data/races";
import { getRaceById } from "@/db/races";

// Define character classes
interface CharacterClass {
  id: string;
  name: string;
  description: string;
  abilities: string[];
  image: string;
}

const characterClasses: CharacterClass[] = [
  {
    id: "warrior",
    name: "Warrior",
    description: "Masters of combat who rely on strength and skill with weapons.",
    abilities: ["Weapon Mastery", "Heavy Armor Proficiency", "Battle Tactics"],
    image: "/images/classes/warrior.jpg"
  },
  {
    id: "mage",
    name: "Mage",
    description: "Scholars of the arcane who wield powerful spells and magical knowledge.",
    abilities: ["Spellcasting", "Arcane Recovery", "Magical Insight"],
    image: "/images/classes/mage.jpg"
  },
  {
    id: "rogue",
    name: "Rogue",
    description: "Stealthy operatives who excel at deception and precision strikes.",
    abilities: ["Sneak Attack", "Thieves' Tools", "Evasion"],
    image: "/images/classes/rogue.jpg"
  },
  {
    id: "cleric",
    name: "Cleric",
    description: "Divine servants who channel the power of their deity to heal and protect.",
    abilities: ["Divine Magic", "Channel Divinity", "Healing Touch"],
    image: "/images/classes/cleric.jpg"
  }
];

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { race } = context.query;
  
  let raceData = null;
  if (race) {
    raceData = await getRaceById(race as string);
    
    if (!raceData) {
      raceData = coreRaces.find((r) => r.id === race) || 
                expandedRaces.find((r) => r.id === race);
    }
  }

  return {
    props: {
      selectedRace: raceData || null,
      classes: characterClasses,
      metadata: {
        title: `Choose Your Class | Collector Quest`,
        description: "Select a class for your character's journey.",
        image: "/images/character-class-selection.jpg",
        url: `https://collectorquest.theethical.ai/character/class`,
      },
    },
  };
};

interface ClassSelectionPageProps {
  selectedRace: Race | null;
  classes: CharacterClass[];
}

const ClassSelectionPage: React.FC<ClassSelectionPageProps> = ({ selectedRace, classes }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);

  useEffect(() => {
    if (!router.query.race) {
      router.push("/character/race");
    }
  }, [router]);

  const handleClassSelect = (characterClass: CharacterClass) => {
    setSelectedClass(characterClass);
  };

  const handleNext = () => {
    if (selectedClass) {
      router.push(`/character/details?race=${router.query.race}&class=${selectedClass.id}`);
    }
  };

  const handleBack = () => {
    router.push("/character/race");
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>
          <CrownIcon><FaCrown /></CrownIcon>
          Loading class selection...
        </LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={handleBack}>
        <FaArrowLeft /> Back to Race Selection
      </BackButton>
      
      <Title>Choose Your Class</Title>
      <Subtitle>What skills will you bring to Lord Smearington's Gallery?</Subtitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {selectedRace && (
        <SelectedRaceBanner>
          <RaceImage src={selectedRace.image || "/images/races/default.jpg"} alt={selectedRace.name} />
          <RaceInfo>
            <RaceName>Selected Race: {selectedRace.name}</RaceName>
            <RaceDescription>{selectedRace.description}</RaceDescription>
          </RaceInfo>
        </SelectedRaceBanner>
      )}
      
      <ClassesGrid>
        {classes.map((characterClass) => (
          <ClassCard 
            key={characterClass.id}
            selected={selectedClass?.id === characterClass.id}
            onClick={() => handleClassSelect(characterClass)}
          >
            <ClassImage 
              src={characterClass.image} 
              alt={characterClass.name} 
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/classes/default.jpg";
              }}
            />
            <ClassInfo>
              <ClassName>{characterClass.name}</ClassName>
              <ClassDescription>{characterClass.description}</ClassDescription>
              <AbilitiesList>
                {characterClass.abilities.map((ability, index) => (
                  <AbilityItem key={index}>{ability}</AbilityItem>
                ))}
              </AbilitiesList>
            </ClassInfo>
          </ClassCard>
        ))}
      </ClassesGrid>
      
      <Quote>
        &quot;Your class defines how you interact with the gallery's mysteries. Choose wisely, for each path offers unique opportunities and challenges.&quot;
      </Quote>

      {selectedClass && (
        <SelectionFooter>
          <SelectedClassInfo>
            <SelectedClassLabel>Selected Class:</SelectedClassLabel>
            <SelectedClassName>{selectedClass.name}</SelectedClassName>
          </SelectedClassInfo>
          <NextButton onClick={handleNext}>
            Next Step <FaArrowRight />
          </NextButton>
        </SelectionFooter>
      )}
    </Container>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Cormorant Garamond', serif;
  animation: ${fadeIn} 0.5s ease-in;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  margin-bottom: 2rem;
  color: #bb8930;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.3s;
  
  &:hover {
    color: #e6a93b;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
  text-align: center;
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 2rem;
`;

const SelectedRaceBanner = styled.div`
  display: flex;
  align-items: center;
  background: #f5f0e6;
  border: 1px solid #e6d5b8;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
`;

const RaceImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
`;

const RaceInfo = styled.div`
  flex: 1;
`;

const RaceName = styled.h3`
  margin: 0 0 0.5rem;
  color: #6d4c41;
`;

const RaceDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #6d4c41;
`;

const ClassesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ClassCard = styled.div<{ selected: boolean }>`
  border: 2px solid ${props => props.selected ? '#bb8930' : '#e6d5b8'};
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  background: ${props => props.selected ? '#faf6eb' : '#fff'};
  box-shadow: ${props => props.selected ? '0 4px 12px rgba(187, 137, 48, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.1)'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const ClassImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;

const ClassInfo = styled.div`
  padding: 1rem;
`;

const ClassName = styled.h3`
  margin: 0 0 0.5rem;
  color: #6d4c41;
`;

const ClassDescription = styled.p`
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: #6d4c41;
`;

const AbilitiesList = styled.ul`
  margin: 0;
  padding: 0 0 0 1.2rem;
`;

const AbilityItem = styled.li`
  font-size: 0.85rem;
  color: #8d6e63;
  margin-bottom: 0.3rem;
`;

const Quote = styled.blockquote`
  font-style: italic;
  color: #8d6e63;
  border-left: 3px solid #bb8930;
  padding-left: 1rem;
  margin: 2rem 0;
`;

const SelectionFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f0e6;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 2rem;
`;

const SelectedClassInfo = styled.div``;

const SelectedClassLabel = styled.span`
  font-size: 0.9rem;
  color: #8d6e63;
`;

const SelectedClassName = styled.span`
  font-weight: bold;
  color: #6d4c41;
  margin-left: 0.5rem;
`;

const NextButton = styled.button`
  display: flex;
  align-items: center;
  background: #bb8930;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  
  svg {
    margin-left: 0.5rem;
  }
  
  &:hover {
    background: #e6a93b;
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  font-size: 1.5rem;
  color: #bb8930;
`;

const CrownIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: ${keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  `} 2s infinite;
`;

export default ClassSelectionPage;
