import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { FaEdit, FaDownload, FaShare } from "react-icons/fa";
import { Submission } from "@/data/submissions";
import CharacterImage from "./CharacterImage";
import { Character } from "@/hooks/useCharacter";

interface CharacterSummaryProps {
  character: Character | null;
  artwork?: Submission;
}

const CharacterSummary: React.FC<CharacterSummaryProps> = ({
  character,
  artwork,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading character data
    if (character) {
      setIsLoading(false);
    }
  }, [character]);

  const handleEditSection = (section: string) => {
    switch (section) {
      case "race":
        router.push("/character/race");
        break;
      case "class":
        router.push("/character/class");
        break;
      case "traits":
        router.push("/character/traits");
        break;
      case "motivation":
        router.push("/character/motivation");
        break;
      default:
        break;
    }
  };

  const handleDownloadCharacterSheet = () => {
    // Implementation for downloading character sheet as PDF or image
    alert("Character sheet download functionality will be implemented here");
  };

  const handleShareCharacter = () => {
    // Implementation for sharing character on social media or generating a link
    alert("Character sharing functionality will be implemented here");
  };

  if (isLoading || !character) {
    return <LoadingContainer>Loading character summary...</LoadingContainer>;
  }

  return (
    <Container>
      <Header>
        <Title>{character.name || "Unnamed Character"}</Title>
        <Subtitle>
          {character.race?.name} {character.class?.name}
        </Subtitle>
      </Header>

      <ContentGrid>
        {character.race && character.class && (
          <CharacterImage
            race={character.race}
            characterClass={character.class}
            size="large"
          />
        )}

        <CharacterInfoSection>
          {/* <SectionCard>
            <SectionHeader>
              <SectionTitle>Background</SectionTitle>
              <EditButton onClick={() => handleEditSection("traits")}>
                <FaEdit /> Edit
              </EditButton>
            </SectionHeader>
            <SectionContent>
              {character.background || "No background information available."}
            </SectionContent>
          </SectionCard> */}

          <SectionCard>
            <SectionHeader>
              <SectionTitle>Motivation</SectionTitle>
              <EditButton onClick={() => handleEditSection("motivation")}>
                <FaEdit /> Edit
              </EditButton>
            </SectionHeader>
            <SectionContent>
              {character.motivation || "No motivation information available."}
            </SectionContent>
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <SectionTitle>Traits</SectionTitle>
              <EditButton onClick={() => handleEditSection("traits")}>
                <FaEdit /> Edit
              </EditButton>
            </SectionHeader>
            <SectionContent>
              <TraitsList>
                <TraitItem>
                  <TraitLabel>Personality:</TraitLabel> {character.traits?.personality.join(", ") || "Unknown"}
                </TraitItem>
                <TraitItem>
                  <TraitLabel>Fear:</TraitLabel> {character.traits?.fear.join(", ") || "Unknown"}
                </TraitItem>
                <TraitItem>
                  <TraitLabel>Memory:</TraitLabel> {character.traits?.memory || "Unknown"}
                </TraitItem>
                <TraitItem>
                  <TraitLabel>Possession:</TraitLabel> {character.traits?.possession || "Unknown"}
                </TraitItem>
              </TraitsList>
            </SectionContent>
          </SectionCard>
        </CharacterInfoSection>
      </ContentGrid>

      <ActionButtons>
        <ActionButton onClick={handleDownloadCharacterSheet}>
          <FaDownload /> Download Character Sheet
        </ActionButton>
        <ActionButton onClick={handleShareCharacter}>
          <FaShare /> Share Character
        </ActionButton>
      </ActionButtons>
    </Container>
  );
};

export default CharacterSummary;

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #bb8930;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: #c7bfd4;
  font-weight: normal;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const CharacterInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const SectionCard = styled.div`
  background-color: rgba(26, 26, 46, 0.7);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid #444;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #444;
  padding-bottom: 0.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: #bb8930;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const SectionContent = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #c7bfd4;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const TraitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TraitItem = styled.li`
  margin-bottom: 0.5rem;
`;

const TraitLabel = styled.span`
  font-weight: bold;
  color: #bb8930;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: #bb8930;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  &:hover {
    color: #d4a959;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #bb8930;
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #d4a959;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 0.7rem 1rem;
    font-size: 0.95rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.2rem;
  color: #c7bfd4;
  
  @media (max-width: 768px) {
    height: 300px;
    font-size: 1.1rem;
  }
`;
