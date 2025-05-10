import React from "react";
import styled from "@emotion/styled";
import CharacterImage from "./CharacterImage";
import CharacterDescription from "./CharacterDescription";
import { Character } from "@/hooks/useCharacter";

interface CharacterCardProps {
  character: Character;
  onSelect?: () => void;
  showEditButton?: boolean;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onSelect,
  showEditButton = false,
}) => {
  return (
    <Card>
      <CardHeader>
      <CharacterName>{character.name}</CharacterName>
          {character.level && (
            <CharacterLevel>Level {character.level}</CharacterLevel>
          )}
      </CardHeader>
      <CardContent>
        <CharacterImage
          race={character.race}
          characterClass={character.class}
          size="large"
        />
        <CharacterDescription
          race={character.race}
          characterClass={character.class}
          size="large"
        />
      </CardContent>
    </Card>
  );
};

export default CharacterCard;


const Card = styled.div`
  background-color: #2a2e35;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  max-width: 420px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  text-align: center;
  flex-direction: column;
`;

const CharacterName = styled.h3`
  font-size: 1.5rem;
  margin: 0;
  color: #e1e1e6;
  text-align: center;
`;

const CharacterLevel = styled.span`
  font-size: 1rem;
  color: #a0a0a0;
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
`;
