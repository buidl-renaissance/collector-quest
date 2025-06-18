import styled from "@emotion/styled";
import { ReactNode } from "react";
import { CharacterScript } from "./CharacterScript";
import { useCampaignIntroduction } from "@/hooks/useCampaignIntroduction";

interface GameAreaProps {
  children?: ReactNode;
}

export const GameArea = ({ children }: GameAreaProps) => {
  const { introductionData, loading, error, generationStatus, generationMessage } = useCampaignIntroduction();

  // Show loading state
  if (loading) {
    return (
      <GameAreaContainer>
        <GameContent>
          <DungeonMasterSection>
            <DmHeader>
              <DmImageContainer>
                <DmImage src="/images/COLLECTOR-quest-intro-1024.jpg" alt="Dungeon Master" />
              </DmImageContainer>
              <DmInfo>
                <DmTitle>Dungeon Master</DmTitle>
              </DmInfo>
            </DmHeader>
            <LoadingMessage>
              {generationMessage || 'Loading your adventure...'}
            </LoadingMessage>
          </DungeonMasterSection>
          {children}
        </GameContent>
      </GameAreaContainer>
    );
  }

  // Show error state
  if (error) {
    return (
      <GameAreaContainer>
        <GameContent>
          <DungeonMasterSection>
            <DmHeader>
              <DmImageContainer>
                <DmImage src="/images/COLLECTOR-quest-intro-1024.jpg" alt="Dungeon Master" />
              </DmImageContainer>
              <DmInfo>
                <DmTitle>Dungeon Master</DmTitle>
              </DmInfo>
            </DmHeader>
            <ErrorMessage>Error: {error}</ErrorMessage>
          </DungeonMasterSection>
          {children}
        </GameContent>
      </GameAreaContainer>
    );
  }

  // Show introduction or fallback
  return (
    <GameAreaContainer>
      <GameContent>
        <DungeonMasterSection>
          <DmHeader>
            <DmImageContainer>
              <DmImage src="/images/COLLECTOR-quest-intro-1024.jpg" alt="Dungeon Master" />
            </DmImageContainer>
            <DmInfo>
              <DmTitle>Dungeon Master</DmTitle>
            </DmInfo>
          </DmHeader>
          {introductionData ? (
            <CharacterScript
              character={null}
              script={introductionData.introduction}
              image={introductionData.locale.imageUrl || "/images/the-sleeping-dragon-tavern.png"}
              imageTitle={introductionData.locale.name}
              imageCaption={introductionData.locale.description}
              locale={{
                village: introductionData.locale.name,
                region: introductionData.locale.type
              }}
            />
          ) : (
            <CharacterScript
              character={null}
              script={"You find yourself in the warm, inviting atmosphere of The Sleeping Dragon Tavern. The air is thick with the aroma of spiced mead and hearty stew. Wooden beams stretch across the ceiling, their ancient timbers darkened by years of hearth smoke. A mix of locals and travelers occupy the scattered tables, their conversations creating a gentle murmur throughout the room."}
              image="/images/the-sleeping-dragon-tavern.png"
              imageTitle="The Sleeping Dragon Tavern"
              imageCaption="The Sleeping Dragon Tavern"
              locale={{
                village: "Willowbrook",
                region: "Greenmeadow Valley"
              }}
            />
          )}
        </DungeonMasterSection>
        {children}
      </GameContent>
    </GameAreaContainer>
  );
};

const GameAreaContainer = styled.main`
  position: fixed;
  top: calc(60px); /* TopNavigationBar height + gap */
  left: 0;
  right: 0;
  padding: 0.5rem;
  /* bottom: calc(60px + 0.5rem + 86px); BottomNavigationBar + gap + ChatBox height */
  bottom: 60px;
  background: rgba(26, 26, 46, 0.8);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1;
`;

const GameContent = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 0;
  overflow-y: auto;
  color: #fff;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
    background-color: rgba(0, 0, 0, 0.2);
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(212, 175, 55, 0.3);
    border-radius: 4px;

    &:hover {
      background-color: rgba(212, 175, 55, 0.5);
    }
  }

  /* Firefox scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: rgba(212, 175, 55, 0.3) rgba(0, 0, 0, 0.2);
`;

const DungeonMasterSection = styled.div`
  padding: 0.5rem;
`;

const DmHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DmImageContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #d4af37;
  flex-shrink: 0;
`;

const DmImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DmInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DmTitle = styled.div`
  color: #d4af37;
  font-size: 1.2rem;
  font-weight: 600;
  font-family: "Cinzel", serif;
`;

const LoadingMessage = styled.div`
  color: #d4af37;
  font-family: "Cinzel", serif;
  font-size: 1rem;
  text-align: center;
  padding: 2rem;
  font-style: italic;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-family: "Cinzel", serif;
  font-size: 1rem;
  text-align: center;
  padding: 2rem;
`;