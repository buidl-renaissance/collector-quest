import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Character } from '../data/character';
import { FaSearch } from 'react-icons/fa';
import { useWallet } from "@/hooks/useWallet";
import CharacterCard from './CharacterCard';

interface CharacterSelectionProps {
  selectedCharacters: Character[];
  onSelectionChange: (characters: Character[]) => void;
  multiSelect?: boolean;
  showSearch?: boolean;
  currentCharacter?: Character;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  selectedCharacters,
  onSelectionChange,
  multiSelect = false,
  showSearch = true,
  currentCharacter,
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
        const filteredData = currentCharacter 
          ? data.filter((char: Character) => char.id !== currentCharacter.id)
          : data;
        setCharacters(filteredData);
        setHasLoaded(true);
      } catch (err) {
        setError('Failed to load characters');
        console.error('Error loading characters:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCharacters();
  }, [address, hasLoaded, currentCharacter]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 8 && !value.includes(' ')) {
      setLoading(true);
      try {
        const response = await fetch(`/api/characters/${value}`);
        if (response.ok) {
          const character = await response.json();
          if (!currentCharacter || character.id !== currentCharacter.id) {
            setCharacters(prev => {
              const exists = prev.some(c => c.id === character.id);
              if (!exists) {
                if (multiSelect) {
                  const isAlreadySelected = selectedCharacters.some(c => c.id === character.id);
                  if (!isAlreadySelected) {
                    onSelectionChange([...selectedCharacters, character]);
                  }
                } else {
                  onSelectionChange([character]);
                }
                setSearchTerm('');
                return [...prev, character];
              }
              return prev;
            });
          }
          setError(null);
        }
      } catch (err) {
        console.error('Error loading character by ID:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredCharacters = characters
    .filter(character => 
      (character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.race?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.class?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.id?.includes(searchTerm)) &&
      (!currentCharacter || character.id !== currentCharacter.id)
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
        {filteredCharacters.map(character => (
          <CharacterCard
            key={character.id}
            character={character}
            isSelected={selectedCharacters.some(c => c.id === character.id)}
            onClick={() => handleCharacterClick(character)}
            showId={true}
          />
        ))}
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

export default CharacterSelection; 