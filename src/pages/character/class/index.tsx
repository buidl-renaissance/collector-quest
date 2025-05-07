import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaArrowLeft, FaArrowRight, FaCrown } from "react-icons/fa";
import { GetServerSideProps } from "next";
import { characterClasses, CharacterClass } from "@/data/classes";
import { Race, coreRaces, expandedRaces } from "@/data/races";
import { getRaceById } from "@/db/races";
import { getAllClasses } from "@/db/classes";
import PageTransition from "@/components/PageTransition";

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

  // Fetch classes from database
  let classes: CharacterClass[] = [];
  try {
    const dbClasses = await getAllClasses();
    
    // Combine database classes with predefined classes
    classes = [...characterClasses];
    
    // Add any additional classes from database
    dbClasses.forEach(dbClass => {
      const existingIndex = classes.findIndex(c => c.id === dbClass.id);
      if (existingIndex >= 0) {
        classes[existingIndex] = dbClass;
      } else {
        classes.push(dbClass);
      }
    });
  } catch (error) {
    console.error("Failed to fetch classes:", error);
    classes = characterClasses;
  }

  return {
    props: {
      selectedRace: raceData || null,
      classes: classes,
      metadata: {
        title: `Choose Your Class | Lord Smearington's Absurd NFT Gallery`,
        description: "Select a class for your character's journey through the gallery.",
        image: "/images/character-class-selection.jpg",
        url: `https://smearington.theethical.ai/character/class`,
      },
    },
  };
};

interface ClassSelectionPageProps {
  selectedRace: Race | null;
  classes: CharacterClass[];
  metadata: {
    title: string;
    description: string;
    image: string;
    url: string;
  };
}

const ClassSelectionPage: React.FC<ClassSelectionPageProps> = ({ selectedRace, classes, metadata }) => {
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
      router.push(`/character/bio?race=${router.query.race}&class=${selectedClass.id}`);
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
    <PageTransition>
      <Container>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Race Selection
        </BackButton>
        
        <Title>Choose Your Class</Title>
        <Subtitle>What skills will you bring to Lord Smearington&apos;s Gallery?</Subtitle>
        
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
                    <AbilityItem key={index}>{typeof ability === 'string' ? ability : ability.name}</AbilityItem>
                  ))}
                </AbilitiesList>
              </ClassInfo>
            </ClassCard>
          ))}
        </ClassesGrid>
        
        <Quote>
          &quot;Your class defines how you interact with the gallery&apos;s mysteries. Choose wisely, for each path offers unique opportunities and challenges.&quot;
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
  padding: 2rem;
  font-family: 'Cormorant Garamond', serif;
  animation: ${fadeIn} 0.5s ease-in;
  padding-bottom: 80px; /* Make room for the footer */
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
    color: #d4a959;
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
  color: #C7BFD4;
  margin-bottom: 2rem;
  text-align: center;
`;

const ErrorMessage = styled.div`
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SelectedRaceBanner = styled.div`
  display: flex;
  align-items: center;
  background: rgba(187, 137, 48, 0.1);
  border: 1px solid #bb8930;
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
  border: 2px solid #bb8930;
`;

const RaceInfo = styled.div`
  flex: 1;
`;

const RaceName = styled.h3`
  margin: 0 0 0.5rem;
  color: #bb8930;
`;

const RaceDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #C7BFD4;
`;

const ClassesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ClassCard = styled.div<{ selected: boolean }>`
  border: 2px solid ${props => props.selected ? '#d4a959' : '#bb8930'};
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  background: ${props => props.selected ? 'rgba(187, 137, 48, 0.1)' : 'rgba(26, 26, 46, 0.3)'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(187, 137, 48, 0.3);
    border-color: #d4a959;
  }
`;

const ClassImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-bottom: 1px solid #bb8930;
`;

const ClassInfo = styled.div`
  padding: 1rem;
`;

const ClassName = styled.h3`
  margin: 0 0 0.5rem;
  color: #bb8930;
`;

const ClassDescription = styled.p`
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: #C7BFD4;
  line-height: 1.4;
`;

const AbilitiesList = styled.ul`
  margin: 0;
  padding: 0 0 0 1.2rem;
`;

const AbilityItem = styled.li`
  font-size: 0.85rem;
  color: #C7BFD4;
  margin-bottom: 0.3rem;
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

const SelectionFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(26, 26, 46, 0.95);
  border-top: 2px solid #bb8930;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${slideUp} 0.3s ease-out;
  z-index: 100;
`;

const SelectedClassInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SelectedClassLabel = styled.span`
  color: #C7BFD4;
`;

const SelectedClassName = styled.span`
  color: #bb8930;
  font-weight: bold;
  font-size: 1.1rem;
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
  font-family: 'Cormorant Garamond', serif;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #d4a959;
  }
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

const CrownIcon = styled.span`
  color: #bb8930;
  font-size: 1.5rem;
  animation: ${fadeIn} 1s infinite alternate;
`;

export default ClassSelectionPage;
