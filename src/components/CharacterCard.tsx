import React from 'react';
import styled from '@emotion/styled';
import { Character } from '../data/character';
import { FaCheck } from 'react-icons/fa';

interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  onClick?: () => void;
  showId?: boolean;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isSelected = false,
  onClick,
  showId = false,
}) => {
  return (
    <CardContainer onClick={onClick} isSelected={isSelected} clickable={!!onClick}>
      {character.image_url && (
        <CharacterImage src={character.image_url} alt={character.name} />
      )}
      <CharacterInfo>
        <CharacterName>{character.name}</CharacterName>
        <CharacterDetails>
          {character.race?.name} {character.class?.name}
        </CharacterDetails>
        {showId && <CharacterId>{character.id}</CharacterId>}
      </CharacterInfo>
      {isSelected && (
        <SelectedIndicator>
          <FaCheck />
        </SelectedIndicator>
      )}
    </CardContainer>
  );
};

const CardContainer = styled.div<{ isSelected: boolean; clickable: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid ${props => props.isSelected ? '#bb8930' : 'rgba(187, 137, 48, 0.3)'};
  border-radius: 8px;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  position: relative;
  background-color: ${props => props.isSelected ? 'rgba(187, 137, 48, 0.1)' : 'rgba(46, 30, 15, 0.7)'};
  transition: all 0.2s;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }

  &:hover {
    border-color: #bb8930;
    background-color: rgba(187, 137, 48, 0.1);
    transform: ${props => props.clickable ? 'translateY(-2px)' : 'none'};
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

const CharacterId = styled.div`
  font-size: 0.6rem;
  color: #6e6378;
  font-family: monospace;
  word-break: break-all;
`;

const SelectedIndicator = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: #bb8930;
`;

export default CharacterCard;
