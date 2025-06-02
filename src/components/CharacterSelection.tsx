import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Character } from '../data/character';
import { FaSearch, FaCheck } from 'react-icons/fa';
import { useWallet } from "@/hooks/useWallet";

interface CharacterSelectionProps {
  selectedCharacters: Character[];
  onSelectionChange: (characters: Character[]) => void;
  multiSelect?: boolean;
  showSearch?: boolean;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  selectedCharacters,
  onSelectionChange,
  multiSelect = false,
  showSearch = true,
}) => {
  const { address } = useWallet();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    async function loadCharacters() {
      if (!address || hasLoaded) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/characters?owner=${address}`);
        if (!response.ok) {
          throw new Error('Failed to fetch characters');
        }
        const data = await response.json();
        setCharacters(data);
        setHasLoaded(true);
      } catch (err) {
        setError('Failed to load characters');
        console.error('Error loading characters:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCharacters();
  }, [address, hasLoaded]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // If the value looks like a character ID (you might want to adjust this validation)
    if (value.length > 8 && !value.includes(' ')) {
      setLoading(true);
      try {
        const response = await fetch(`/api/characters/${value}`);
        if (response.ok) {
          const character = await response.json();
          // Only add the character if it's not already in the list
          setCharacters(prev => {
            const exists = prev.some(c => c.id === character.id);
            if (!exists) {
              return [...prev, character];
            }
            return prev;
          });
          setError(null);
        }
      } catch (err) {
        // Don't set error for ID searches
        console.error('Error loading character by ID:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredCharacters = characters.filter(character =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.race?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.class?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.id?.includes(searchTerm)
  );

  const handleCharacterClick = (character: Character) => {
    if (multiSelect) {
      const isSelected = selectedCharacters.some(c => c.id === character.id);
      if (isSelected) {
        onSelectionChange(selectedCharacters.filter(c => c.id !== character.id));
      } else {
        onSelectionChange([...selectedCharacters, character]);
      }
    } else {
      onSelectionChange([character]);
    }
  };

  if (loading) {
    return <LoadingMessage>Loading characters...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!address) {
    return <ErrorMessage>Please connect your wallet to view characters</ErrorMessage>;
  }

  if (characters.length === 0) {
    return <EmptyMessage>You don&apos;t have any characters yet</EmptyMessage>;
  }

  return (
    <Container>
      {showSearch && (
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search by name or enter character ID..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <SearchIcon><FaSearch /></SearchIcon>
        </SearchContainer>
      )}

      <CharacterGrid>
        {filteredCharacters.map(character => {
          const isSelected = selectedCharacters.some(c => c.id === character.id);
          return (
            <CharacterCard
              key={character.id}
              onClick={() => handleCharacterClick(character)}
              isSelected={isSelected}
            >
              {character.image_url && (
                <CharacterImage src={character.image_url} alt={character.name} />
              )}
              <CharacterInfo>
                <CharacterName>{character.name}</CharacterName>
                <CharacterDetails>
                  {character.race?.name} {character.class?.name}
                </CharacterDetails>
                <CharacterId>{character.id}</CharacterId>
              </CharacterInfo>
              {isSelected && (
                <SelectedIndicator>
                  <FaCheck />
                </SelectedIndicator>
              )}
            </CharacterCard>
          );
        })}
      </CharacterGrid>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: rgba(46, 30, 15, 0.7);
  border: 1px solid #bb8930;
  border-radius: 4px;
  font-size: 1rem;
  color: #a89bb4;
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }

  &:focus {
    outline: none;
    border-color: #d4a959;
    box-shadow: 0 0 0 2px rgba(187, 137, 48, 0.2);
  }

  &::placeholder {
    color: #6e6378;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #bb8930;
`;

const CharacterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    max-height: 300px;
    padding-right: 0.25rem;
  }

  &::-webkit-scrollbar {
    width: 8px;
    @media (max-width: 768px) {
      width: 4px;
    }
  }

  &::-webkit-scrollbar-track {
    background: rgba(46, 30, 15, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #bb8930;
    border-radius: 4px;
  }
`;

const CharacterCard = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid ${props => props.isSelected ? '#bb8930' : 'rgba(187, 137, 48, 0.3)'};
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  background-color: ${props => props.isSelected ? 'rgba(187, 137, 48, 0.1)' : 'rgba(46, 30, 15, 0.7)'};
  transition: all 0.2s;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }

  &:hover {
    border-color: #bb8930;
    background-color: rgba(187, 137, 48, 0.1);
    transform: translateY(-2px);
  }
`;

const CharacterImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.75rem;
  border: 2px solid #bb8930;

  @media (max-width: 768px) {
    width: 64px;
    height: 64px;
    margin-right: 0.5rem;
  }
`;

const CharacterInfo = styled.div`
  flex: 1;
`;

const CharacterName = styled.div`
  font-family: "Cinzel", serif;
  font-weight: 600;
  color: #bb8930;
  margin-bottom: 0.25rem;
  font-size: 1.4rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 0;
  }
`;

const CharacterDetails = styled.div`
  font-size: 0.875rem;
  color: #a89bb4;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::after {
    content: "•";
    color: #6e6378;
  }
`;

const SelectedIndicator = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: #bb8930;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 1rem;
  color: #bb8930;
  font-family: "Cinzel", serif;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 1rem;
  color: #bb8930;
  font-family: "Cinzel", serif;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #a89bb4;
  background-color: rgba(46, 30, 15, 0.7);
  border-radius: 8px;
  border: 1px dashed #bb8930;
  font-family: "Cinzel", serif;
`;

const CharacterId = styled.div`
  font-size: 0.6rem;
  color: #6e6378;
  font-family: monospace;
  word-break: break-all;
`;

export default CharacterSelection; 