import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaArrowLeft, FaCrown, FaEdit, FaTrash, FaPlus, FaImage } from "react-icons/fa";
import { coreRaces, expandedRaces, Race } from "@/data/races";
import { getAllRaces } from "@/db/races";
import { saveRace } from "@/lib/character";
import { generateImage, uploadImage } from "@/lib/image";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch races from API or database
  const races = await getAllRaces();

  const otherRaces = [...coreRaces, ...expandedRaces];
  // Identify duplicate races (same ID) between database and predefined races
  const duplicateRaces = races.filter(dbRace => 
    otherRaces.some(predefinedRace => predefinedRace.id === dbRace.id)
  );

  // Log duplicates for debugging
  if (duplicateRaces.length > 0) {
    console.log(`Found ${duplicateRaces.length} duplicate races:`, 
      duplicateRaces.map(race => race.id)
    );
  }

  // Merge races, prioritizing database versions over predefined ones
  const allRaces = [
    ...races,
    ...otherRaces.filter(predefinedRace => 
      !races.some(dbRace => dbRace.id === predefinedRace.id)
    )
  ];
  
  return {
    props: {
      races: allRaces,
      metadata: {
        title: `Race Administration | Lord Smearington's Absurd NFT Gallery`,
        description: "Admin panel for managing character races.",
        image: "/images/admin-panel-banner.jpg",
        url: `https://smearington.theethical.ai/character/race/admin`,
      },
    },
  };
};

interface AdminPageProps {
  races: Race[];
}

const AdminPage: React.FC<AdminPageProps> = ({ races: initialRaces }) => {
  const router = useRouter();
  const [races, setRaces] = useState<Race[]>(initialRaces);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEditRace = (raceId: string) => {
    router.push(`/character/race/${raceId}/modify`);
  };

  const handleGenerateImages = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Process races in sequence to avoid overwhelming the API
      for (const race of races) {
        if (!race.image) {
          console.log(`Generating image for ${race.name}...`);
          
          // Generate the image
          const image = await generateImage(`${race.name}, a ${race.description}`, race.image);
          if (!image) {
            throw new Error(`Failed to generate image for ${race.name}`);
          }
          
          // Upload the generated image
          const imageData = await uploadImage(image);
          
          // Update race with new image URL
          const updatedRace = { ...race, image: imageData.url };
          
          // Save the race to the database
          await saveRace(updatedRace);
          
          // Update the race in the local state
          setRaces(prevRaces => 
            prevRaces.map(r => r.id === race.id ? updatedRace : r)
          );
        }
      }
      
      console.log("All images generated successfully");
    } catch (err) {
      console.error("Error generating images:", err);
      setError("Failed to generate images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRace = async (raceId: string) => {
    if (!confirm("Are you sure you want to delete this race?")) {
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/races/${raceId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete race");
      }
      
      // Remove the deleted race from the state
      setRaces(races.filter(race => race.id !== raceId));
    } catch (err) {
      console.error("Error deleting race:", err);
      setError("Failed to delete race. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRace = () => {
    router.push("/character/race/new");
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>
          <CrownIcon><FaCrown /></CrownIcon>
          Processing...
        </LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <BackLink href="/admin">
        <FaArrowLeft /> Back to Admin Panel
      </BackLink>
      
      <Title>Race Administration</Title>
      <Subtitle>Manage character races for Lord Smearington&apos;s Gallery</Subtitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <ActionButton onClick={handleCreateRace}>
        <FaPlus /> Create New Race
      </ActionButton>

      <ActionButton onClick={handleGenerateImages}>
        <FaImage /> Generate Images
      </ActionButton>
      
      <RacesList>
        {races.length === 0 ? (
          <EmptyState>No races found. Create your first race!</EmptyState>
        ) : (
          races.map(race => (
            <RaceItem key={race.id}>
              <RaceInfo>
                {race.image && (
                  <RaceImageContainer>
                    <RaceImage src={race.image} alt={race.name} />
                  </RaceImageContainer>
                )}
                <RaceDetails>
                  <RaceName>{race.name}</RaceName>
                  <RaceSource>{race.source}</RaceSource>
                  <RaceDescription>{race.description?.substring(0, 100) || ''}...</RaceDescription>
                </RaceDetails>
              </RaceInfo>
              <RaceActions>
                <ActionButton onClick={() => handleEditRace(race.id)}>
                  <FaEdit /> Edit
                </ActionButton>
                {race.isGeneratingImage && (
                  <ActionButton>
                    <FaImage /> Generating Image
                  </ActionButton>
                )}
                <DeleteButton onClick={() => handleDeleteRace(race.id)}>
                  <FaTrash /> Delete
                </DeleteButton>
              </RaceActions>
            </RaceItem>
          ))
        )}
      </RacesList>
    </Container>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Cormorant Garamond', serif;
  animation: ${fadeIn} 0.5s ease-in;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-bottom: 2rem;
  color: #bb8930;
  text-decoration: none;
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

const RacesList = styled.div`
  margin-top: 2rem;
`;

const RaceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: rgba(58, 51, 71, 0.3);
  border: 1px solid #3a3347;
  border-radius: 4px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const RaceInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
`;

const RaceImageContainer = styled.div`
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid #bb8930;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 120px;
    margin-bottom: 1rem;
  }
`;

const RaceImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RaceDetails = styled.div`
  flex: 1;
`;

const RaceName = styled.h3`
  font-size: 1.3rem;
  color: #d4a959;
  margin-bottom: 0.3rem;
`;

const RaceSource = styled.p`
  font-size: 0.9rem;
  color: #9a8fb0;
  margin-bottom: 0.5rem;
`;

const RaceDescription = styled.p`
  font-size: 1rem;
  color: #E0DDE5;
`;

const RaceActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
  
  @media (max-width: 768px) {
    margin-top: 1rem;
    align-self: flex-end;
  }
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #3a3347;
  color: #E0DDE5;
  border: 1px solid #bb8930;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: #4a4357;
  }
`;

const DeleteButton = styled(ActionButton)`
  border-color: #dc3545;
  
  &:hover {
    background-color: rgba(220, 53, 69, 0.2);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #9a8fb0;
  font-style: italic;
`;

export default AdminPage;
