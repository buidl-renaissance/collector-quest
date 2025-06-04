import styled from "@emotion/styled";
import { AnimatePresence } from "framer-motion";
import Page from "@/components/Page";
import { theme } from "@/styles/theme";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCharacter } from "@/hooks/useCharacter";
import { ChatBox } from "@/components/Controller/ChatBox";
import { CharacterMenu } from "@/components/Controller/CharacterMenu";
import { BottomNavigationBar } from "@/components/Controller/BottomNavigationBar";
import { TopNavigationBar } from "@/components/Controller/TopNavigationBar";
import { GameArea } from "@/components/Controller/GameArea";
import { QRCharacterModal } from "@/components/Controller/QRCharacterModal";
import { useCurrentCampaign } from "@/hooks/useCurrentCampaign";
import { CampaignSelectionModal } from "@/components/CampaignSelectionModal";

const mockLocationData = {
  village: "Willowbrook",
  location: "The Sleeping Dragon Tavern",
  region: "Greenmeadow Valley",
  nearbyPOIs: ["Market Square", "Village Well", "Elder's Hut"],
  activeQuests: 3,
  collectibles: 7,
};

const Controller = () => {
  const router = useRouter();
  const { character } = useCharacter();
  const { currentCampaign, loading } = useCurrentCampaign();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  // useEffect(() => {
  //   if (!currentCampaign && !loading) {
  //     setIsCampaignModalOpen(true);
  //   }
  // }, [currentCampaign, loading]);

  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message);
  };

  const handleMenuClick = () => {
    console.log("Menu clicked");
  };

  const handleScanClick = () => {
    setIsQRModalOpen(true);
  };

  const handleCloseQRModal = () => {
    setIsQRModalOpen(false);
  };

  const handleCloseCampaignModal = () => {
    setIsCampaignModalOpen(false);
    if (!currentCampaign) {
      router.replace('/campaign');
    }
  };

  if (loading) {
    return null;
  }

  return (
    <ControllerLayout>
      <TopNavigationBar
        onMenuClick={handleMenuClick}
        onScanClick={handleScanClick}
      />
      <GameArea />
      <CharacterMenu character={character} />
      <ChatBox onSendMessage={handleSendMessage} />
      <BottomNavigationBar locationData={mockLocationData} />

      <AnimatePresence>
        {isQRModalOpen && (
          <QRCharacterModal
            isOpen={isQRModalOpen}
            onClose={handleCloseQRModal}
            characterId={character?.id}
          />
        )}
      </AnimatePresence>

      <CampaignSelectionModal 
        isOpen={isCampaignModalOpen}
        onClose={handleCloseCampaignModal}
      />
    </ControllerLayout>
  );
};

const ControllerLayout = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.background};
  overflow: hidden;
  font-family: "Cormorant Garamond", serif;
`;

const MainSection = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
`;

const MiddleSection = styled.div`
  display: flex;
  gap: 2rem;
  flex: 1;
  overflow: hidden;
`;

const PlayerAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #d4af37;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AvatarLabel = styled.div`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(26, 26, 46, 0.8);
  color: #d4af37;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
  white-space: nowrap;
`;

const MainContentBox = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(26, 26, 46, 0.8);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const NavigationArrow = styled.button<{ direction: "left" | "right" }>`
  background: none;
  border: none;
  color: #d4af37;
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const ContentArea = styled.div`
  flex: 1;
  position: relative;
  min-height: 400px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
`;

const ImageBox = styled.div`
  width: 120px;
  height: 120px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  position: absolute;
  top: 1rem;
  left: 1rem;
`;

const MuteButton = styled.button`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: #d4af37;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
  }
`;

const QuestPanel = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  padding: 1rem;
  color: #d4af37;

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: #fff;
  }
`;

export default Controller;
