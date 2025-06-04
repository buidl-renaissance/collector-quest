import styled from '@emotion/styled';

interface CharacterImageTileProps {
  name: string;
  imageUrl?: string;
  isHighlighted?: boolean;
}

const CharacterImageTile: React.FC<CharacterImageTileProps> = ({ name, imageUrl, isHighlighted }) => {
  return (
    <Container>
      <ImageCircle isHighlighted={isHighlighted}>
        <CharacterImage src={imageUrl || ''} alt={name} />
      </ImageCircle>
      <CharacterName isHighlighted={isHighlighted}>{name}</CharacterName>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const ImageCircle = styled.div<{ isHighlighted?: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #bb8930;
  ${props => props.isHighlighted && `
    border: 2px solid #4a9eff;
    box-shadow: 0 0 10px rgba(74, 158, 255, 0.3);
  `}
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CharacterName = styled.span<{ isHighlighted?: boolean }>`
  font-family: "Cinzel", serif;
  color: #e0dde5;
  font-size: 0.9rem;
  text-align: center;
  ${props => props.isHighlighted && `
    color: #4a9eff;
    text-shadow: 0 0 10px rgba(74, 158, 255, 0.3);
    border-bottom: 1px solid #4a9eff;
  `}
`;

export default CharacterImageTile;
