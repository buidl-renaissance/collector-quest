import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import styled from '@emotion/styled';
import { FaArrowLeft, FaDownload, FaShare } from 'react-icons/fa';
import { Story } from '@/lib/interfaces';

const CharacterSummaryPage: NextPage = () => {
  const router = useRouter();
  const { race, class: characterClass } = router.query;
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState<{
    race: string;
    class: string;
    name: string;
    bio: string;
    motivation: string;
    image?: string;
  } | null>(null);

  useEffect(() => {
    // Redirect to race selection if no race is selected
    if (!race || !characterClass) {
      router.push('/character/race');
      return;
    }

    // In a real app, you would fetch the character data from an API or state management
    // This is a mock implementation
    setCharacter({
      race: race as string,
      class: characterClass as string,
      name: localStorage.getItem('characterName') || 'Unnamed Character',
      bio: localStorage.getItem('characterBio') || 'No biography provided.',
      motivation: localStorage.getItem('characterMotivation') || 'Unknown motivation.',
      image: localStorage.getItem('characterImage') || '/images/characters/default.jpg',
    });
    setLoading(false);
  }, [race, characterClass, router]);

  const handleBack = () => {
    router.push(`/character/motivation?race=${race}&class=${characterClass}`);
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF or image of the character sheet
    alert('Character sheet download functionality would be implemented here.');
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog or copy a link to clipboard
    alert('Character sharing functionality would be implemented here.');
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading your character summary...</LoadingMessage>
      </Container>
    );
  }

  return (
    <>
      <NextSeo
        title="Character Summary | Lord Smearington's Gallery"
        description="Review your character for Lord Smearington's Gallery"
      />
      <Container>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Motivation
        </BackButton>
        
        <Title>Character Summary</Title>
        <Subtitle>Review your character for Lord Smearington&apos;s Gallery</Subtitle>
        
        {character && (
          <CharacterCard>
            <CharacterHeader>
              <CharacterName>{character.name}</CharacterName>
              <CharacterDetails>
                <DetailItem>{character.race}</DetailItem>
                <DetailSeparator>•</DetailSeparator>
                <DetailItem>{character.class}</DetailItem>
              </CharacterDetails>
            </CharacterHeader>
            
            {character.image && (
              <CharacterImageContainer>
                <CharacterImage src={character.image} alt={character.name} />
              </CharacterImageContainer>
            )}
            
            <CharacterSection>
              <SectionTitle>Biography</SectionTitle>
              <SectionContent>{character.bio}</SectionContent>
            </CharacterSection>
            
            <CharacterSection>
              <SectionTitle>Motivation</SectionTitle>
              <SectionContent>{character.motivation}</SectionContent>
            </CharacterSection>
            
            <ActionButtons>
              <ActionButton onClick={handleDownload}>
                <FaDownload /> Download Character Sheet
              </ActionButton>
              <ActionButton onClick={handleShare}>
                <FaShare /> Share Character
              </ActionButton>
            </ActionButtons>
          </CharacterCard>
        )}
      </Container>
    </>
  );
};

export default CharacterSummaryPage;

// Styled Components
const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #2c3e50;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #7f8c8d;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #3498db;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #7f8c8d;
  margin: 3rem 0;
`;

const CharacterCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-top: 2rem;
`;

const CharacterHeader = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;
`;

const CharacterName = styled.h2`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
`;

const CharacterDetails = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #7f8c8d;
`;

const DetailItem = styled.span`
  font-size: 1.1rem;
`;

const DetailSeparator = styled.span`
  margin: 0 0.5rem;
`;

const CharacterImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const CharacterImage = styled.img`
  max-width: 300px;
  max-height: 300px;
  border-radius: 8px;
  object-fit: cover;
`;

const CharacterSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #ecf0f1;
  padding-bottom: 0.5rem;
`;

const SectionContent = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #34495e;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
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
