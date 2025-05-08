import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { FaEdit, FaDownload, FaShare } from 'react-icons/fa';
import { Submission } from '@/data/submissions';

interface CharacterSummaryProps {
  character?: {
    race: string;
    class: string;
    name: string;
    background: string;
    motivation: string;
    appearance: string;
  };
  artwork?: Submission;
}

const CharacterSummary: React.FC<CharacterSummaryProps> = ({ character, artwork }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading character data
    if (character) {
      setIsLoading(false);
    }
  }, [character]);

  const handleEditSection = (section: string) => {
    const { race, class: characterClass } = router.query;
    switch (section) {
      case 'race':
        router.push('/character/race');
        break;
      case 'class':
        router.push('/character/class');
        break;
      case 'bio':
        router.push(`/character/bio?race=${race}&class=${characterClass}`);
        break;
      case 'motivation':
        router.push(`/character/motivation?race=${race}&class=${characterClass}`);
        break;
      default:
        break;
    }
  };

  const handleDownloadCharacterSheet = () => {
    // Implementation for downloading character sheet as PDF or image
    alert('Character sheet download functionality will be implemented here');
  };

  const handleShareCharacter = () => {
    // Implementation for sharing character on social media or generating a link
    alert('Character sharing functionality will be implemented here');
  };

  if (isLoading) {
    return <LoadingContainer>Loading character summary...</LoadingContainer>;
  }

  return (
    <Container>
      <Header>
        <Title>{character?.name || 'Unnamed Character'}</Title>
        <Subtitle>{character?.race} {character?.class}</Subtitle>
      </Header>

      <ContentGrid>
        <CharacterImageSection>
          {artwork ? (
            <CharacterImage src={artwork.imageUrl} alt={character?.name || 'Character'} />
          ) : (
            <PlaceholderImage>
              <p>Character artwork will appear here</p>
            </PlaceholderImage>
          )}
        </CharacterImageSection>

        <CharacterInfoSection>
          <SectionCard>
            <SectionHeader>
              <SectionTitle>Background</SectionTitle>
              <EditButton onClick={() => handleEditSection('bio')}>
                <FaEdit /> Edit
              </EditButton>
            </SectionHeader>
            <SectionContent>{character?.background || 'No background information available.'}</SectionContent>
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <SectionTitle>Motivation</SectionTitle>
              <EditButton onClick={() => handleEditSection('motivation')}>
                <FaEdit /> Edit
              </EditButton>
            </SectionHeader>
            <SectionContent>{character?.motivation || 'No motivation information available.'}</SectionContent>
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <SectionTitle>Appearance</SectionTitle>
              <EditButton onClick={() => handleEditSection('bio')}>
                <FaEdit /> Edit
              </EditButton>
            </SectionHeader>
            <SectionContent>{character?.appearance || 'No appearance information available.'}</SectionContent>
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
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: #7f8c8d;
  font-weight: normal;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CharacterImageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CharacterImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const PlaceholderImage = styled.div`
  width: 100%;
  max-width: 300px;
  height: 400px;
  background-color: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #7f8c8d;
  padding: 1rem;
`;

const CharacterInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #ecf0f1;
  padding-bottom: 0.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: #2c3e50;
  margin: 0;
`;

const SectionContent = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #34495e;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
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
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.2rem;
  color: #7f8c8d;
`;
