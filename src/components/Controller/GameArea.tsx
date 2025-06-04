import styled from "@emotion/styled";
import { ReactNode } from "react";
import { CharacterScript } from "./CharacterScript";

interface GameAreaProps {
  children?: ReactNode;
}

export const GameArea = ({ children }: GameAreaProps) => {
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
          <CharacterScript 
            character={null}
            image="/images/the-sleeping-dragon-tavern.png"
            imageTitle="The Sleeping Dragon Tavern"
            imageCaption="The Sleeping Dragon Tavern"
            locale={{
              village: "Willowbrook",
              region: "Greenmeadow Valley"
            }}
          />
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
  bottom: calc(60px + 0.5rem + 96px); /* BottomNavigationBar + gap + ChatBox height */
  background: rgba(26, 26, 46, 0.8);
  /* border: 1px solid rgba(187, 137, 48, 0.3); */
  /* border-radius: 8px; */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1;
`;

const DungeonMasterSection = styled.div`
  /* background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(187, 137, 48, 0.3); */
`;

const DmHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  /* padding: 1rem; */
`;

const DmImageContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
`;

const DmTitle = styled.div`
  color: #d4af37;
  font-size: 1.4rem;
  font-weight: 600;
`;

const DmStatus = styled.div`
  color: #4CAF50;
  font-size: 0.8rem;
`;

const GameContent = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 0;
  padding-right: 0.5rem;
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