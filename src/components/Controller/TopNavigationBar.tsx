import styled from "@emotion/styled";
import { FaBars, FaQrcode } from "react-icons/fa";
import { useCurrentCampaign } from "@/hooks/useCurrentCampaign";

interface TopNavigationBarProps {
  onMenuClick?: () => void;
  onScanClick?: () => void;
}

export const TopNavigationBar = ({ onMenuClick, onScanClick }: TopNavigationBarProps) => {
  const { currentCampaign } = useCurrentCampaign();

  return (
    <TopNavigation>
      <IconNavButton title="Menu" onClick={onMenuClick}>
        <FaBars />
      </IconNavButton>
      <TitleContainer>
        {currentCampaign ? (
          <CampaignContainer>
            <CampaignLabel>Current Campaign</CampaignLabel>
            <CampaignTitle>{currentCampaign.name}</CampaignTitle>
          </CampaignContainer>
        ) : (
          <Title>Collector Quest</Title>
        )}
      </TitleContainer>
      <IconNavButton title="Scan QR Code" onClick={onScanClick}>
        <FaQrcode />
      </IconNavButton>
    </TopNavigation>
  );
};

const TopNavigation = styled.div`
  display: grid;
  grid-template-columns: 40px calc(100% - 80px - 1rem) 40px;
  gap: 0.5rem;
  align-items: center;
  height: 60px;
  padding: 0.5rem;
  background: rgba(26, 26, 46, 0.95);
  border-bottom: 1px solid rgba(187, 137, 48, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
`;

const IconNavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #d4af37;
  border: 1px solid #d4af37;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;

  svg {
    font-size: 1.2rem;
  }

  &:hover {
    color: #f5cc50;
    border-color: #f5cc50;
    background: rgba(212, 175, 55, 0.1);
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  background: transparent;
  /* border: 1px solid #d4af37; */
  border-radius: 4px;
`;

const Title = styled.h1`
  margin: 0;
  color: #d4af37;
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CampaignContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
`;

const CampaignLabel = styled.div`
  color: rgba(212, 175, 55, 0.7);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1;
`;

const CampaignTitle = styled.h2`
  margin: 0;
  color: #d4af37;
  font-size: 1rem;
  font-weight: 600;
  font-family: "Cinzel", serif;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.2;
  max-height: 2.4em;
`; 