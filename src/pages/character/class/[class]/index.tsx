import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { useAuth } from '../../../../hooks/useAuth';
import { FaEdit, FaUserCog } from 'react-icons/fa';

interface CharacterClass {
  id: string;
  name: string;
  description: string;
  tags: string[];
  abilities: {
    name: string;
    description: string;
    level: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid #bb8930;
  border-radius: 4px;
  color: #bb8930;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(187, 137, 48, 0.1);
  }
`;

const ClassCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ClassDescription = styled.p`
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.8rem;
  color: #555;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const AbilitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const AbilityCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const AbilityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const AbilityName = styled.h3`
  font-size: 1.2rem;
  margin: 0;
`;

const AbilityLevel = styled.span`
  background: #bb8930;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
`;

const AbilityDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  color: #888;
  font-size: 0.8rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #bb8930;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 1.2rem;
  text-align: center;
  padding: 2rem;
`;

export default function CharacterClassView() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAdmin } = useAuth();
  const [characterClass, setCharacterClass] = useState<CharacterClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCharacterClass();
    }
  }, [id]);

  const fetchCharacterClass = async () => {
    try {
      const response = await fetch(`/api/character/class/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch character class');
      }
      const data = await response.json();
      setCharacterClass(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  if (error || !characterClass) {
    return (
      <Container>
        <ErrorMessage>
          {error || 'Character class not found'}
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>{characterClass.name}</Title>
        <ButtonGroup>
          {isAdmin && (
            <>
              <StyledButton onClick={() => router.push(`/character/class/${id}/modify`)}>
                <EditIcon /> Edit
              </StyledButton>
              <StyledButton onClick={() => router.push(`/character/class/${id}/admin`)}>
                <AdminPanelSettingsIcon /> Admin
              </StyledButton>
            </>
          )}
        </ButtonGroup>
      </Header>

      <ClassCard>
        <ClassDescription>{characterClass.description}</ClassDescription>
        <TagsContainer>
          {characterClass.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagsContainer>
      </ClassCard>

      <SectionTitle>Class Abilities</SectionTitle>
      <AbilitiesGrid>
        {characterClass.abilities.map((ability) => (
          <AbilityCard key={ability.name}>
            <AbilityHeader>
              <AbilityName>{ability.name}</AbilityName>
              <AbilityLevel>Level {ability.level}</AbilityLevel>
            </AbilityHeader>
            <AbilityDescription>{ability.description}</AbilityDescription>
          </AbilityCard>
        ))}
      </AbilitiesGrid>

      <Footer>
        <span>Created: {new Date(characterClass.createdAt).toLocaleDateString()}</span>
        <span>Last Updated: {new Date(characterClass.updatedAt).toLocaleDateString()}</span>
      </Footer>
    </Container>
  );
}
