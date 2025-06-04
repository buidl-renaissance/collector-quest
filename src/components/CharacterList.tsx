import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Character } from '@/data/character';
import CharacterImageTile from './CharacterImageTile';
import CharacterSummaryModal from './CharacterSummaryModal';
import CharacterSheetModal from './CharacterSheetModal';

interface CharacterListProps {
  characters: Character[];
  highlightedCharacterId?: string;
}

const CharacterList: React.FC<CharacterListProps> = ({ characters, highlightedCharacterId }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleCloseModal = () => {
    setSelectedCharacter(null);
  };

  return (
    <>
      <CharactersList>
        {characters.filter(char => char?.id).map((char) => (
          <div
            key={char.id}
            onClick={() => handleCharacterClick(char)}
            style={{ cursor: 'pointer' }}
          >
            <CharacterImageTile
              name={char.name}
              imageUrl={char.image_url}
              isHighlighted={char.id === highlightedCharacterId}
            />
          </div>
        ))}
      </CharactersList>

      {selectedCharacter && (
        <CharacterSheetModal
          isOpen={!!selectedCharacter}
          onClose={handleCloseModal}
          character={selectedCharacter}
          characterSheet={selectedCharacter.sheet || {}}
        />
      )}
    </>
  );
};

const CharactersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

export default CharacterList;
