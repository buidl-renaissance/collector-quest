import styled from "@emotion/styled";
import CharacterImage from "@/components/CharacterImage";
import { Character } from "@/data/character";

interface CharacterScriptProps {
  character: Character | null;
  image?: string;
  imageTitle?: string;
  imageCaption?: string;
  locale?: {
    village?: string;
    region?: string;
  };
}

export const CharacterScript = ({
  character,
  image = "/images/the-sleeping-dragon-tavern.png",
  imageTitle = "The Sleeping Dragon Tavern",
  imageCaption,
  locale,
}: CharacterScriptProps) => {
  return (
    <ScriptContainer>
      {character && (
        <CharacterHeader>
          <CharacterImage character={character} bordered size="small" />
          <CharacterName>{character.name}</CharacterName>
        </CharacterHeader>
      )}

      <ScriptContent>
        You find yourself in the warm, inviting atmosphere of The Sleeping
        Dragon Tavern. The air is thick with the aroma of spiced mead and hearty
        stew. Wooden beams stretch across the ceiling, their ancient timbers
        darkened by years of hearth smoke. A mix of locals and travelers occupy
        the scattered tables, their conversations creating a gentle murmur
        throughout the room.
      </ScriptContent>
      <LocationHeader>
        {image && (
          <LocationImageContainer>
            <LocationImageWrapper>
              <StyledLocationImage src={image} alt={imageTitle} />
            </LocationImageWrapper>
            <ImageContainer>
              <LocationTitle>{imageTitle}</LocationTitle>
              {imageCaption && <ImageCaption>{imageCaption}</ImageCaption>}
              {locale && (
                <LocaleText>
                  {locale.village && <span>{locale.village}</span>}
                  {locale.village && locale.region && <span> • </span>}
                  {locale.region && <span>{locale.region}</span>}
                </LocaleText>
              )}
            </ImageContainer>
          </LocationImageContainer>
        )}
      </LocationHeader>
    </ScriptContainer>
  );
};

const ScriptContainer = styled.div`
  /* background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.3); */
  border-radius: 8px;
  margin-bottom: 1rem;
  padding-left: 3rem;
  padding-top: 0;
`;

const LocationHeader = styled.div`
  margin-bottom: 0.5rem;
`;

const LocationImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 1rem;
`;

const LocationImageWrapper = styled.div`
  width: 256px;
  height: auto;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const StyledLocationImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageContainer = styled.div`
  margin-bottom: 0.5rem;
`;

const LocationTitle = styled.h2`
  color: #d4af37;
  font-family: "Cinzel", serif;
  font-size: 1rem;
  margin: 0;
`;

const ImageCaption = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  /* margin-top: 0.25rem; */
`;

const LocaleText = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;

  span {
    &:not(:last-child) {
      margin-right: 0.5rem;
    }
  }
`;

const CharacterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(212, 175, 55, 0.3);
`;

const CharacterName = styled.h3`
  color: #d4af37;
  font-family: "Cinzel", serif;
  font-size: 1.1rem;
  margin: 0;
`;

const ScriptContent = styled.p`
  color: #fff;
  line-height: 1.6;
  font-size: 0.9rem;
  margin: 0;
`;
