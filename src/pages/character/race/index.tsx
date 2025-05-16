import React from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaCrown, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import CharacterRaces from "@/components/CharacterRaces";
import { useRace } from "@/hooks/useRace";
import { useSex } from "@/hooks/useSex";
import { coreRaces, expandedRaces, Race } from "@/data/races";
import { getAllRaces } from "@/db/races";
import { GetServerSideProps } from "next";
import { BackButton } from "@/components/styled/character";
import { useCharacter } from "@/hooks/useCharacter";

interface CharacterCreatePageProps {
  races: Race[];
}

export const getServerSideProps: GetServerSideProps<CharacterCreatePageProps> = async () => {
  const races = await getAllRaces();
  return {
    props: {
      races,
    },
  };
};

const CharacterCreatePage: React.FC<CharacterCreatePageProps> = ({
  races
}) => {
  const router = useRouter();
  const { saveCharacter } = useCharacter();
  const { selectedRace, selectRace, loading: raceLoading } = useRace();
  const { selectedSex, loading: sexLoading } = useSex();
  const [error, setError] = React.useState("");

  // Redirect if no sex is selected
  React.useEffect(() => {
    if (!sexLoading && !selectedSex) {
      router.push('/character/sex');
    }
  }, [selectedSex, sexLoading, router]);

  const handleNext = () => {
    if (selectedRace) {
      router.push('/character/class');
    }
  };

  const handleBack = () => {
    router.push('/character/sex');
  };

  if (raceLoading || sexLoading) {
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
    <Container>
      <BackButton onClick={handleBack}>
        <FaArrowLeft /> Back to Sex Selection
      </BackButton>

      <Title>Craft Your Character</Title>
      <Subtitle>Who will you be in Lord Smearington&apos;s Gallery of the Absurd?</Subtitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <CharacterRaces 
        races={races} 
        onSelectRace={selectRace} 
        selectedRace={selectedRace?.name}
      />
      
      <Quote>
        &quot;The character you create will shape your journey through the twisted corridors and magnificent exhibits of this interdimensional gallery.&quot;
      </Quote>

      {selectedRace && (
        <SelectionFooter>
          <SelectedRaceInfo>
            <SelectedRaceLabel>Selected Race:</SelectedRaceLabel>
            <SelectedRaceName>{selectedRace.name}</SelectedRaceName>
          </SelectedRaceInfo>
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
  padding-bottom: 120px; /* Make room for the footer */
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

const SelectedRaceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SelectedRaceLabel = styled.span`
  color: #C7BFD4;
`;

const SelectedRaceName = styled.span`
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

export default CharacterCreatePage;
