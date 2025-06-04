import styled from '@emotion/styled';

interface CharacterImageTileProps {
  name: string;
  imageUrl?: string;
  isHighlighted?: boolean;
  horizontal?: boolean;
  subtext?: string;
}

const CharacterImageTile: React.FC<CharacterImageTileProps> = ({ name, imageUrl, isHighlighted, horizontal, subtext }) => {
  return (
    <Container horizontal={horizontal}>
      <ImageCircle isHighlighted={isHighlighted}>
        <CharacterImage src={imageUrl || ''} alt={name} />
      </ImageCircle>
      <TextContainer horizontal={horizontal}>
        <CharacterName isHighlighted={isHighlighted}>{name}</CharacterName>
        {subtext && <Subtext>{subtext}</Subtext>}
      </TextContainer>
    </Container>
  );
};

const Container = styled.div<{ horizontal?: boolean }>`
  display: flex;
  flex-direction: ${props => props.horizontal ? 'row' : 'column'};
  align-items: center;
  gap: 0.5rem;
  text-align: ${props => props.horizontal ? 'left' : 'center'};
`;

const ImageCircle = styled.div<{ isHighlighted?: boolean }>`
  width: 50px;
  height: 50px;
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

const TextContainer = styled.div<{ horizontal?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.horizontal ? 'flex-start' : 'center'};
  gap: 0;
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

const Subtext = styled.span`
  font-size: 0.8rem;
  color: rgba(224, 221, 229, 0.7);
  text-align: center;
`;

export default CharacterImageTile;
