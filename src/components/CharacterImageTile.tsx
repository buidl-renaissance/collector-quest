import styled from '@emotion/styled';

interface CharacterImageTileProps {
  name: string;
  imageUrl?: string;
}

const CharacterImageTile: React.FC<CharacterImageTileProps> = ({ name, imageUrl }) => {
  return (
    <Container>
      <ImageCircle>
        <CharacterImage src={imageUrl || ''} alt={name} />
      </ImageCircle>
      <CharacterName>{name}</CharacterName>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const ImageCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #bb8930;
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CharacterName = styled.span`
  font-family: "Cinzel", serif;
  color: #e0dde5;
  font-size: 0.9rem;
  text-align: center;
`;

export default CharacterImageTile;
