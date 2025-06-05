import React from "react";
import styled from "@emotion/styled";
import CharacterImage from "./CharacterImage";
import { Character } from "@/hooks/useCurrentCharacter";

interface CharacterSummaryProps {
  character: Character;
}

const CharacterSummary: React.FC<CharacterSummaryProps> = ({ character }) => {
  return (
    <Container>
      <Header>
        <Title>{character.name || "Unnamed Character"}</Title>
        <Subtitle>
          {character.race?.name} {character.class?.name}
        </Subtitle>
      </Header>

      {character.race && character.class && (
        <CharacterImage
          character={character}
          size="large"
        />
      )}
    </Container>
  );
};

export default CharacterSummary;

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;

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
