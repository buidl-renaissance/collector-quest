import styled from "@emotion/styled";
import CharacterImage from "@/components/CharacterImage";
import { Character } from "@/data/character";

interface CharacterScriptProps {
  character: Character | null;
  locationName?: string;
  locationImage?: string;
  locale?: {
    village?: string;
    region?: string;
  };
}

export const CharacterScript = ({
  character,
  locationName = "The Sleeping Dragon Tavern",
  locationImage = "/images/the-sleeping-dragon-tavern.png",
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
      <LocationHeader>
        {locationImage && (
          <LocationImageWrapper>
            <StyledLocationImage src={locationImage} alt={locationName} />
          </LocationImageWrapper>
        )}
        <LocationInfo>
          <LocationTitle>{locationName}</LocationTitle>
          {locale && (
            <LocaleText>
              {locale.village && <span>{locale.village}</span>}
              {locale.village && locale.region && <span> • </span>}
              {locale.region && <span>{locale.region}</span>}
            </LocaleText>
          )}
        </LocationInfo>
      </LocationHeader>
      <ScriptContent>
        You find yourself in the warm, inviting atmosphere of The Sleeping
        Dragon Tavern. The air is thick with the aroma of spiced mead and hearty
        stew. Wooden beams stretch across the ceiling, their ancient timbers
        darkened by years of hearth smoke. A mix of locals and travelers occupy
        the scattered tables, their conversations creating a gentle murmur
        throughout the room.
      </ScriptContent>
    </ScriptContainer>
  );
};

const ScriptContainer = styled.div`
  /* background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.3); */
  border-radius: 8px;
  margin-bottom: 1rem;
  padding-left: 2.75rem;
  padding-top: 0.5rem;
`;

const LocationHeader = styled.div`
  margin-bottom: 0.5rem;
`;

const LocationImageWrapper = styled.div`
  width: 100%;
  height: auto;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const StyledLocationImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const LocationInfo = styled.div`
  margin-bottom: 0.5rem;
`;

const LocationTitle = styled.h2`
  color: #d4af37;
  font-family: "Cinzel", serif;
  font-size: 1.2rem;
  margin: 0;
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
