import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaCrown, FaSearch, FaUser, FaShieldAlt, FaBook } from 'react-icons/fa';
import { Character } from '@/data/character';
import { CharacterDB } from '@/db/character';
import useIsAdmin from '@/hooks/useIsAdmin';
import BottomNavigationBar from '@/components/BottomNavigationBar';

interface AdminPageProps {
  characters: Character[];
}

const AdminPage: React.FC<AdminPageProps> = ({ characters: initialCharacters }) => {
  const router = useRouter();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, isAdminLoading, router]);

  const handleCreateCharacter = () => {
    router.push('/character/create');
  };

  const handleEditCharacter = (id: string) => {
    router.push(`/character/${id}/edit`);
  };

  const handleDeleteCharacter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this character? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/characters/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete character');
      }

      setCharacters(characters.filter(character => character.id !== id));
    } catch (err) {
      console.error('Error deleting character:', err);
      setError('Failed to delete character. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCharacters = characters.filter(character => 
    character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (character.bio?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (character.race?.name.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (character.class?.name.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (isAdminLoading || loading) {
    return (
      <Container>
        <LoadingMessage>
          <CrownIcon><FaCrown /></CrownIcon>
          Processing...
        </LoadingMessage>
      </Container>
    );
  }

  if (!isAdmin) {
    return null; // Return null while redirecting
  }

  return (
    <Container>
      <BackLink href="/admin">
        <FaArrowLeft /> Back to Admin Panel
      </BackLink>

      <Title>Character Administration</Title>
      <Subtitle>Manage characters and their attributes</Subtitle>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search characters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchIcon><FaSearch /></SearchIcon>
      </SearchContainer>

      <ActionButton onClick={handleCreateCharacter}>
        <FaPlus /> Create New Character
      </ActionButton>

      <CharactersList>
        {filteredCharacters.length === 0 ? (
          <EmptyState>No characters found. Create your first character!</EmptyState>
        ) : (
          filteredCharacters.map(character => (
            <CharacterItem key={character.id}>
              <CharacterInfo>
                <CharacterImageContainer>
                  <Image
                    src={character.image_url || '/images/default-character.png'}
                    alt={character.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </CharacterImageContainer>
                <CharacterDetails>
                  <CharacterName>{character.name}</CharacterName>
                  <CharacterStats>
                    <StatBadge>
                      <UserIcon><FaUser /></UserIcon>
                      Race: {character.race?.name || 'Unknown'}
                    </StatBadge>
                    <StatBadge>
                      <ShieldIcon><FaShieldAlt /></ShieldIcon>
                      Class: {character.class?.name || 'Unknown'}
                    </StatBadge>
                    <StatBadge>
                      <BookIcon><FaBook /></BookIcon>
                      Level: {character.level || 1}
                    </StatBadge>
                  </CharacterStats>
                  <CharacterBio>{character.bio?.substring(0, 150) || 'No bio available'}...</CharacterBio>
                  {character.traits && (
                    <CharacterTraits>
                      {character.traits.personality?.map((trait, index) => (
                        <TraitBadge key={index}>{trait}</TraitBadge>
                      ))}
                    </CharacterTraits>
                  )}
                </CharacterDetails>
              </CharacterInfo>
              <CharacterActions>
                <ActionButton onClick={() => handleEditCharacter(character.id!)}>
                  <FaEdit /> Edit
                </ActionButton>
                <DeleteButton onClick={() => handleDeleteCharacter(character.id!)}>
                  <FaTrash /> Delete
                </DeleteButton>
              </CharacterActions>
            </CharacterItem>
          ))
        )}
      </CharactersList>

      <BottomNavigationBar />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const characterDB = new CharacterDB();
    const characters = await characterDB.listCharacters();
    
    return {
      props: {
        characters,
      },
    };
  } catch (error) {
    console.error('Error fetching characters:', error);
    return {
      props: {
        characters: [],
      },
    };
  }
};

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
  animation: ${fadeIn} 0.5s ease-out;
  padding-bottom: 120px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #bb8930;
  text-decoration: none;
  margin-bottom: 2rem;
  font-size: 1rem;
  transition: color 0.3s ease;

  &:hover {
    color: #d4a959;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
  font-family: "Cinzel", serif;
`;

const Subtitle = styled.h2`
  font-size: 1.25rem;
  color: #c7bfd4;
  margin-bottom: 2rem;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 1px solid #bb8930;
  border-radius: 4px;
  background: rgba(26, 26, 46, 0.8);
  color: #e0dde5;
  font-size: 1rem;
  font-family: "Cormorant Garamond", serif;

  &:focus {
    outline: none;
    border-color: #d4a959;
    box-shadow: 0 0 0 2px rgba(187, 137, 48, 0.2);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #bb8930;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #bb8930;
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Cinzel", serif;
  margin-bottom: 2rem;

  &:hover {
    background-color: #d4a959;
    transform: translateY(-2px);
  }
`;

const CharactersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CharacterItem = styled.div`
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid #bb8930;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CharacterInfo = styled.div`
  display: flex;
  gap: 1.5rem;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CharacterImageContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #bb8930;

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const CharacterDetails = styled.div`
  flex: 1;
`;

const CharacterName = styled.h3`
  font-size: 1.5rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
  font-family: "Cinzel", serif;
`;

const CharacterStats = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const StatBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(187, 137, 48, 0.2);
  border: 1px solid #bb8930;
  border-radius: 4px;
  color: #bb8930;
  font-size: 0.9rem;
`;

const CharacterBio = styled.p`
  color: #e0dde5;
  margin-bottom: 1rem;
  font-size: 1rem;
  line-height: 1.5;
`;

const CharacterTraits = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const TraitBadge = styled.div`
  padding: 0.25rem 0.75rem;
  background: rgba(187, 137, 48, 0.1);
  border: 1px solid rgba(187, 137, 48, 0.3);
  border-radius: 4px;
  color: #d4a959;
  font-size: 0.8rem;
`;

const CharacterActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border: 1px solid #dc3545;

  &:hover {
    background-color: rgba(220, 53, 69, 0.3);
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 1.5rem;
  color: #bb8930;
  height: 100vh;
`;

const CrownIcon = styled.div`
  color: #bb8930;
`;

const UserIcon = styled.div`
  color: #bb8930;
`;

const ShieldIcon = styled.div`
  color: #bb8930;
`;

const BookIcon = styled.div`
  color: #bb8930;
`;

const ErrorMessage = styled.div`
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid #bb8930;
  border-radius: 8px;
  color: #c7bfd4;
  font-size: 1.2rem;
`;

export default AdminPage; 