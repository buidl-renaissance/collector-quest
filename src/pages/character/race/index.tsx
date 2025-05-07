import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaArrowLeft, FaCrown, FaCheck, FaRandom, FaImage, FaArrowRight } from "react-icons/fa";
import BuildCharacter, { Character } from "@/components/BuildCharacter";
import CharacterRaces from "@/components/CharacterRaces";
import { getAllRaces } from "@/db/races";
import { Race } from "@/data/races";

export const getServerSideProps: GetServerSideProps = async (context) => {

  const races = await getAllRaces();

  return {
    props: {
      races,
      metadata: {
        title: `Create Character | Lord Smearington's Absurd NFT Gallery`,
        description: "Craft your character for an immersive journey through the gallery.",
        image: "/images/character-creation-banner.jpg",
        url: `https://smearington.theethical.ai/character/create`,
      },
    },
  };
};

const CharacterCreatePage: React.FC<{ races: Race[] }> = ({ races }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [characterImage, setCharacterImage] = useState<string>("");
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  const handleCharacterCreated = async (character: Character) => {
    setLoading(true);
    setError("");
    
    try {
      // Here you would typically save the character to your backend
      const response = await fetch("/api/character", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...character,
          image: characterImage
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create character");
      }
      
      const data = await response.json();
      
      // Redirect to the explore page or character detail page
      router.push("/explore");
    } catch (err) {
      console.error("Error creating character:", err);
      setError("Failed to create your character. Please try again.");
      setLoading(false);
    }
  };

  const handleRaceSelect = (race: Race) => {
    setSelectedRace(race);
  };

  const handleNext = () => {
    if (selectedRace) {
      // Navigate to the next step or process the selected race
      router.push(`/character/class?race=${selectedRace.id}`);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>
          <CrownIcon><FaCrown /></CrownIcon>
          {characterImage ? "Saving your character..." : "Creating your character..."}
        </LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      {/* <BackLink href="/explore">
        <FaArrowLeft /> Back to Gallery
      </BackLink> */}
      
      <Title>Craft Your Character</Title>
      <Subtitle>Who will you be in Lord Smearington&apos;s Gallery of the Absurd?</Subtitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <CharacterRaces 
        races={races} 
        onSelectRace={handleRaceSelect} 
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
  padding-bottom: 80px; /* Make room for the footer */
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
